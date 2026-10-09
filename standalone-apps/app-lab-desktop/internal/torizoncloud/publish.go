package torizoncloud

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"slices"
	"strings"
	"sync"

	"github.com/arduino/arduino-app-cli/pkg/board/remote"
)

// hardwareIDPrefix plus the board target is the Torizon hardware ID of App Lab releases.
const hardwareIDPrefix = "arduino-applab-"

// releaseName matches the release file name: <app>-<YYYYMMDD-HHMMSS>-<target>.ard
var releaseName = regexp.MustCompile(`^(.+)-(\d{8}-\d{6})-([^-]+)\.ard$`)

type Release struct {
	Name       string `json:"name"`
	Version    string `json:"version"`
	HardwareID string `json:"hardwareId"`
	Size       int64  `json:"size"`
	// Published are the versions of this app already in Torizon Cloud.
	Published []string `json:"published"`
	// FromReadme tells whether the package description is the app's README.
	FromReadme bool `json:"fromReadme"`
}

// releaseDir is where the board writes the release archive.
const releaseDir = "/tmp/applab-torizon-release"

// prepared is the release built by PrepareRelease, waiting for UploadRelease.
var prepared struct {
	sync.Mutex
	release     *Release
	data        []byte
	description string
}

// PrepareRelease builds a release of the app on the board, ready to be uploaded,
// passing each line of the build output to onLog.
func PrepareRelease(ctx context.Context, conn remote.RemoteConn, orchestratorURL, appID string, onLog func(line string)) (*Release, error) {
	app, err := getApp(ctx, orchestratorURL, appID)
	if err != nil {
		return nil, err
	}
	appPath := app.Path
	fileName, data, err := buildRelease(ctx, conn, appPath, onLog)
	if err != nil {
		return nil, err
	}
	m := releaseName.FindStringSubmatch(fileName)
	if m == nil {
		return nil, fmt.Errorf("unexpected release file name %q", fileName)
	}
	rel := &Release{Name: m[1], Version: m[2], HardwareID: hardwareIDPrefix + m[3], Size: int64(len(data))}
	if rel.Published, err = publishedVersions(ctx, rel.Name, rel.HardwareID); err != nil {
		return nil, err
	}

	prepared.Lock()
	defer prepared.Unlock()
	description, fromReadme := packageDescription(ctx, conn, appPath, app.Description)
	rel.FromReadme = fromReadme

	prepared.release, prepared.data, prepared.description = rel, data, description
	return rel, nil
}

// UploadRelease uploads the prepared release, reporting the uploaded percentage.
func UploadRelease(ctx context.Context, onProgress func(percent int)) (*Release, error) {
	prepared.Lock()
	defer prepared.Unlock()
	rel := prepared.release
	if rel == nil {
		return nil, errors.New("no release to upload")
	}
	c, err := newClient(ctx)
	if err != nil {
		return nil, err
	}

	q := url.Values{
		"name":         {rel.Name},
		"version":      {rel.Version},
		"hardwareId":   {rel.HardwareID},
		"targetFormat": {"BINARY"},
	}
	body := &progressReader{Reader: bytes.NewReader(prepared.data), size: rel.Size, onProgress: onProgress}
	if err := c.call(ctx, "POST", "/packages?"+q.Encode(), body, "application/octet-stream", nil); err != nil {
		return nil, fmt.Errorf("failed to upload the release to Torizon Cloud: %w", err)
	}
	if prepared.description != "" {
		// The release is in the cloud already: a missing description is not a failure
		comment, _ := json.Marshal(map[string]string{"comment": prepared.description})
		_ = c.call(ctx, "PATCH", "/packages/"+url.PathEscape(rel.Name+"-"+rel.Version), bytes.NewReader(comment), "application/json", nil)
	}
	prepared.release, prepared.data, prepared.description = nil, nil, ""
	return rel, nil
}

type appInfo struct {
	Path        string `json:"path"`
	Description string `json:"description"`
}

func getApp(ctx context.Context, orchestratorURL, appID string) (*appInfo, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/v1/apps/%s", orchestratorURL, appID), nil)
	if err != nil {
		return nil, err
	}
	var app appInfo
	if err := send(req, &app); err != nil {
		return nil, fmt.Errorf("failed to get the app: %w", err)
	}
	return &app, nil
}

// buildRelease builds the release archive with arduino-app-cli on the board.
func buildRelease(ctx context.Context, conn remote.RemoteConn, appPath string, onLog func(line string)) (string, []byte, error) {
	_ = conn.GetCmd("rm", "-rf", releaseDir).Run(ctx)
	if err := conn.GetCmd("mkdir", releaseDir).Run(ctx); err != nil {
		return "", nil, fmt.Errorf("failed to prepare the release directory: %w", err)
	}
	defer func() { _ = conn.GetCmd("rm", "-rf", releaseDir).Run(context.Background()) }()

	stdin, stdout, stderr, closer, err := conn.GetCmd("arduino-app-cli", "app", "build", appPath, "-o", releaseDir+"/").Interactive()
	if err != nil {
		return "", nil, err
	}
	_ = stdin.Close()
	var last string
	go func() { _, _ = io.Copy(io.Discard, stderr) }()
	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		if line := strings.TrimSpace(strings.TrimPrefix(scanner.Text(), "[INFO] ")); line != "" {
			last = line
			onLog(line)
		}
	}
	if err := closer(); err != nil {
		return "", nil, fmt.Errorf("failed to build the release: %s", last)
	}

	files, err := conn.List(releaseDir)
	if err != nil || len(files) != 1 {
		return "", nil, fmt.Errorf("release archive not found on the board: %v", err)
	}
	f, err := conn.ReadFile(releaseDir + "/" + files[0].Name)
	if err != nil {
		return "", nil, err
	}
	defer f.Close()
	data, err := io.ReadAll(f)
	if err != nil {
		return "", nil, fmt.Errorf("failed to read the release from the board: %w", err)
	}
	return files[0].Name, data, nil
}

// publishedVersions lists the versions of a package already in Torizon Cloud.
func publishedVersions(ctx context.Context, name, hardwareID string) ([]string, error) {
	c, err := newClient(ctx)
	if err != nil {
		return nil, err
	}
	var res struct {
		Values []struct {
			Name        string   `json:"name"`
			Version     string   `json:"version"`
			HardwareIDs []string `json:"hardwareIds"`
		} `json:"values"`
	}
	q := url.Values{"nameContains": {name}, "limit": {"100"}}
	if err := c.call(ctx, "GET", "/packages?"+q.Encode(), nil, "", &res); err != nil {
		return nil, fmt.Errorf("failed to list the packages in Torizon Cloud: %w", err)
	}
	versions := []string{}
	for _, p := range res.Values {
		if p.Name == name && slices.Contains(p.HardwareIDs, hardwareID) {
			versions = append(versions, p.Version)
		}
	}
	slices.Sort(versions)
	return versions, nil
}

type progressReader struct {
	io.Reader
	size, read int64
	percent    int
	onProgress func(percent int)
}

func (r *progressReader) Read(p []byte) (int, error) {
	n, err := r.Reader.Read(p)
	r.read += int64(n)
	if percent := int(r.read * 100 / r.size); percent != r.percent {
		r.percent = percent
		r.onProgress(percent)
	}
	return n, err
}

// Size lets the client send a Content-Length instead of a chunked body.
func (r *progressReader) Size() int64 { return r.size }
