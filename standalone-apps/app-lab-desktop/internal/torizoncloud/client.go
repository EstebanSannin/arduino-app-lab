package torizoncloud

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const apiURL = "https://app.torizon.io/api/v2beta"

var httpClient = &http.Client{Timeout: 5 * time.Minute}

type client struct {
	token string
}

// newClient authenticates with the stored API client credentials.
func newClient(ctx context.Context) (*client, error) {
	c, err := GetCredentials()
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, errors.New("Torizon Cloud is not configured")
	}
	form := url.Values{
		"grant_type":    {"client_credentials"},
		"client_id":     {c.ClientID},
		"client_secret": {c.Secret},
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.TokenEndpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	var res struct {
		AccessToken string `json:"access_token"`
	}
	if err := send(req, &res); err != nil {
		return nil, fmt.Errorf("Torizon Cloud authentication failed: %w", err)
	}
	return &client{token: res.AccessToken}, nil
}

// call sends a request to the Torizon Cloud API and decodes the JSON answer into out.
func (c *client) call(ctx context.Context, method, path string, body io.Reader, contentType string, out any) error {
	req, err := http.NewRequestWithContext(ctx, method, apiURL+path, body)
	if err != nil {
		return err
	}
	if s, ok := body.(interface{ Size() int64 }); ok {
		req.ContentLength = s.Size()
	}
	req.Header.Set("Authorization", "Bearer "+c.token)
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}
	return send(req, out)
}

func send(req *http.Request, out any) error {
	resp, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		msg, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("%s: %s", resp.Status, strings.TrimSpace(string(msg)))
	}
	if out == nil {
		return nil
	}
	return json.NewDecoder(resp.Body).Decode(out)
}
