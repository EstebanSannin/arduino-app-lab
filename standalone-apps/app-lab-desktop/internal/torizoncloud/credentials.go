// Package torizoncloud connects App Lab to Torizon Cloud: API client
// credentials, board provisioning and app publishing.
package torizoncloud

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/zalando/go-keyring"
)

const (
	keyringService = "AppLab-torizon-cloud"
	keyringUser    = "api-client"

	defaultTokenEndpoint = "https://kc.torizon.io/auth/realms/ota-users/protocol/openid-connect/token"
)

// Credentials of a Torizon Cloud API client, as in its downloaded JSON file.
type Credentials struct {
	TokenEndpoint string `json:"token_endpoint"`
	ClientID      string `json:"client_id"`
	Secret        string `json:"secret"`
}

func SetCredentials(c Credentials) error {
	if c.ClientID == "" || c.Secret == "" {
		return errors.New("client ID and secret are required")
	}
	if c.TokenEndpoint == "" {
		c.TokenEndpoint = defaultTokenEndpoint
	}
	data, err := json.Marshal(c)
	if err != nil {
		return err
	}
	if err := keyring.Set(keyringService, keyringUser, string(data)); err != nil {
		return fmt.Errorf("failed to store Torizon Cloud credentials: %w", err)
	}
	return nil
}

// ImportCredentials stores the credentials of an API client JSON file.
func ImportCredentials(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	var c Credentials
	if err := json.Unmarshal(data, &c); err != nil {
		return fmt.Errorf("not a Torizon Cloud API client file: %w", err)
	}
	return SetCredentials(c)
}

// GetCredentials returns nil when no credentials are stored.
func GetCredentials() (*Credentials, error) {
	data, err := keyring.Get(keyringService, keyringUser)
	if errors.Is(err, keyring.ErrNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to read Torizon Cloud credentials: %w", err)
	}
	var c Credentials
	if err := json.Unmarshal([]byte(data), &c); err != nil {
		return nil, err
	}
	return &c, nil
}

func DeleteCredentials() error {
	err := keyring.Delete(keyringService, keyringUser)
	if err != nil && !errors.Is(err, keyring.ErrNotFound) {
		return fmt.Errorf("failed to delete Torizon Cloud credentials: %w", err)
	}
	return nil
}
