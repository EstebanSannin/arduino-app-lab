package torizoncloud

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"github.com/arduino/arduino-app-cli/pkg/board/remote"
)

// boardHelper is the board's Torizon Cloud helper, allowed through sudo.
const boardHelper = "/usr/libexec/arduino-applab/torizon-cloud"

type Status struct {
	Configured  bool    `json:"configured"`
	Provisioned bool    `json:"provisioned"`
	Device      *Device `json:"device,omitempty"`
}

type Device struct {
	UUID     string `json:"uuid"`
	ID       string `json:"id"`
	Name     string `json:"name"`
	Status   string `json:"status"`
	LastSeen string `json:"lastSeen"`
	// App is the last App Lab app installed from Torizon Cloud ("name version").
	App string `json:"app"`
}

// GetStatus reports whether Torizon Cloud is configured and the board provisioned.
func GetStatus(ctx context.Context, conn remote.RemoteConn) (*Status, error) {
	creds, err := GetCredentials()
	if err != nil {
		return nil, err
	}
	status := &Status{Configured: creds != nil}

	out, err := conn.GetCmd("sudo", boardHelper, "status").Output(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to read the board's Torizon Cloud status: %w", err)
	}
	var board struct {
		Provisioned bool   `json:"provisioned"`
		DeviceUUID  string `json:"deviceUuid"`
	}
	if err := json.Unmarshal(out, &board); err != nil {
		return nil, fmt.Errorf("unexpected board status %q: %w", out, err)
	}
	status.Provisioned = board.Provisioned
	if !board.Provisioned || !status.Configured {
		return status, nil
	}

	c, err := newClient(ctx)
	if err != nil {
		return nil, err
	}
	var d struct {
		DeviceID     string `json:"deviceId"`
		DeviceName   string `json:"deviceName"`
		DeviceStatus string `json:"deviceStatus"`
		LastSeen     string `json:"lastSeen"`
		Packages     []struct {
			Component string `json:"component"`
			Installed struct {
				Name    string `json:"name"`
				Version string `json:"version"`
			} `json:"installed"`
		} `json:"devicePackages"`
	}
	if err := c.call(ctx, "GET", "/devices/"+board.DeviceUUID, nil, "", &d); err != nil {
		return nil, fmt.Errorf("failed to get the device from Torizon Cloud: %w", err)
	}
	status.Device = &Device{
		UUID:     board.DeviceUUID,
		ID:       d.DeviceID,
		Name:     d.DeviceName,
		Status:   d.DeviceStatus,
		LastSeen: d.LastSeen,
	}
	for _, p := range d.Packages {
		if strings.HasPrefix(p.Component, hardwareIDPrefix) && p.Installed.Name != "NOT_FOUND" {
			status.Device.App = p.Installed.Name + " " + p.Installed.Version
		}
	}
	return status, nil
}

// Provision registers the board in Torizon Cloud under the given name.
func Provision(ctx context.Context, conn remote.RemoteConn, name string) error {
	c, err := newClient(ctx)
	if err != nil {
		return err
	}
	var token json.RawMessage
	if err := c.call(ctx, "GET", "/devices/token", nil, "", &token); err != nil {
		return fmt.Errorf("failed to get a provisioning token: %w", err)
	}

	cmd := conn.GetCmd("sudo", boardHelper, "provision")
	stdin, stdout, stderr, closer, err := cmd.Interactive()
	if err != nil {
		return err
	}
	if _, err := fmt.Fprintf(stdin, "%s\n%s\n", provisioningToken(token), name); err != nil {
		return err
	}
	if err := stdin.Close(); err != nil {
		return err
	}
	if err := closer(); err != nil {
		out, _ := io.ReadAll(stdout)
		errOut, _ := io.ReadAll(stderr)
		return fmt.Errorf("provisioning failed: %w: %s %s", err, out, errOut)
	}
	return nil
}

// provisioningToken accepts the token as a JSON string or as {"token": ...}.
func provisioningToken(raw json.RawMessage) string {
	var s string
	if json.Unmarshal(raw, &s) == nil {
		return s
	}
	var o struct {
		Token string `json:"token"`
	}
	_ = json.Unmarshal(raw, &o)
	return o.Token
}
