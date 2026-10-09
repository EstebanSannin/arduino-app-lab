package torizoncloud

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"path"
	"regexp"
	"strings"

	"github.com/arduino/arduino-app-cli/pkg/board/remote"
)

const (
	// maxDescription keeps the package description within what the Torizon Cloud
	// web UI shows (about 5 KiB)
	maxDescription = 5000
	imageWidth     = 480

	examplesTreeURL = "https://api.github.com/repos/arduino/app-bricks-examples/git/trees/main?recursive=1"
	examplesRawURL  = "https://raw.githubusercontent.com/arduino/app-bricks-examples/main/"
)

var markdownImage = regexp.MustCompile(`!\[([^\]]*)\]\(([^)\s]+)\)`)

// packageDescription is the app's README for the Torizon Cloud package, or its
// description when it has none. Images in the app link to the identical file in
// Arduino's public examples, when there is one.
func packageDescription(ctx context.Context, conn remote.RemoteConn, appPath, appDescription string) (string, bool) {
	readme, err := readBoardFile(conn, appPath+"/README.md")
	if err != nil {
		return appDescription, false
	}
	var examples map[string]string
	text := markdownImage.ReplaceAllStringFunc(string(readme), func(m string) string {
		parts := markdownImage.FindStringSubmatch(m)
		alt, src := parts[1], parts[2]
		if !strings.HasPrefix(src, "http://") && !strings.HasPrefix(src, "https://") {
			if examples == nil {
				examples = examplesByHash(ctx)
			}
			data, err := readBoardFile(conn, path.Join(appPath, path.Clean("/"+src)))
			p, ok := examples[gitBlobHash(data)]
			if err != nil || !ok {
				return fmt.Sprintf("*Image: %s (in the app)*", path.Base(src))
			}
			src = examplesRawURL + p
		}
		return fmt.Sprintf(`<img src="%s" alt="%s" width="%d">`, src, alt, imageWidth)
	})
	if len(text) > maxDescription {
		cut := strings.LastIndex(text[:maxDescription], "\n")
		text = text[:max(cut, 0)] + "\n\n*The full description is in the app's README.*"
	}
	return text, true
}

func readBoardFile(conn remote.RemoteConn, name string) ([]byte, error) {
	f, err := conn.ReadFile(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return io.ReadAll(f)
}

// gitBlobHash is the hash git gives a file with this content.
func gitBlobHash(data []byte) string {
	h := sha1.New()
	fmt.Fprintf(h, "blob %d\x00", len(data))
	h.Write(data)
	return hex.EncodeToString(h.Sum(nil))
}

// examplesByHash maps the git hash of each file in Arduino's public examples to its path.
func examplesByHash(ctx context.Context) map[string]string {
	files := map[string]string{}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, examplesTreeURL, nil)
	if err != nil {
		return files
	}
	var tree struct {
		Tree []struct {
			Path string `json:"path"`
			Type string `json:"type"`
			SHA  string `json:"sha"`
		} `json:"tree"`
	}
	if err := send(req, &tree); err != nil {
		return files
	}
	for _, f := range tree.Tree {
		if f.Type == "blob" {
			files[f.SHA] = f.Path
		}
	}
	return files
}
