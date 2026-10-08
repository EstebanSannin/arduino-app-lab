package torizoncloud

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"sync"
)

// hardwareIDPrefix plus the board target is the Torizon hardware ID of App Lab releases.
const hardwareIDPrefix = "arduino-applab-"

// releaseName matches the daemon's release file name: <app>-<YYYYMMDD-HHMMSS>-<target>.ard
var releaseName = regexp.MustCompile(`^(.+)-(\d{8}-\d{6})-([^-]+)\.ard$`)

type Release struct {
	Name       string `json:"name"`
	Version    string `json:"version"`
	HardwareID string `json:"hardwareId"`
	Size       int64  `json:"size"`
}

// prepared is the release built by PrepareRelease, waiting for UploadRelease.
var prepared struct {
	sync.Mutex
	release *Release
	data    []byte
}

// PrepareRelease builds a release of the app on the board, ready to be uploaded.
func PrepareRelease(ctx context.Context, orchestratorURL, appID string) (*Release, error) {
	fileName, data, err := buildRelease(ctx, orchestratorURL, appID)
	if err != nil {
		return nil, err
	}
	m := releaseName.FindStringSubmatch(fileName)
	if m == nil {
		return nil, fmt.Errorf("unexpected release file name %q", fileName)
	}
	rel := &Release{Name: m[1], Version: m[2], HardwareID: hardwareIDPrefix + m[3], Size: int64(len(data))}

	prepared.Lock()
	defer prepared.Unlock()
	prepared.release, prepared.data = rel, data
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
	prepared.release, prepared.data = nil, nil
	return rel, nil
}

// buildRelease asks the board's daemon for a release archive of the app.
func buildRelease(ctx context.Context, orchestratorURL, appID string) (string, []byte, error) {
	u := fmt.Sprintf("%s/v1/apps/%s/build", orchestratorURL, appID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, u, strings.NewReader("{}"))
	if err != nil {
		return "", nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := httpClient.Do(req)
	if err != nil {
		return "", nil, fmt.Errorf("failed to build the release: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		msg, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return "", nil, fmt.Errorf("failed to build the release: %s: %s", resp.Status, strings.TrimSpace(string(msg)))
	}
	_, params, err := mime.ParseMediaType(resp.Header.Get("Content-Disposition"))
	if err != nil {
		return "", nil, fmt.Errorf("release without a file name: %w", err)
	}
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, err
	}
	return params["filename"], data, nil
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
