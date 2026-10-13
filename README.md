# App Lab for Torizon (unofficial build)

This branch is an **unofficial build** of [Arduino App Lab](https://github.com/arduino/arduino-app-lab)
with support for Torizon OS and Torizon Cloud. It is not affiliated with or endorsed by Arduino.
Arduino and App Lab are trademarks of Arduino SA. The upstream README follows below.

What it adds to App Lab 0.10.0:

- shows the board's Linux distribution (e.g. Torizon OS) in the setup;
- **Torizon Cloud** in the settings: import an API client (JSON, stored in the OS keychain) and
  provision the board to Torizon Cloud under a name you choose;
- **Publish** next to Run: builds the app on the board and uploads it to Torizon Cloud as a package
  (the app's README becomes the package description), ready to deploy to a fleet;
- the desktop self-update is off, so that Arduino's update channel does not replace this build.

It needs a board running Torizon OS with the App Lab integration (Arduino VENTUNO Q). With
Arduino's own OS images it behaves as the upstream App Lab.

### Install (unsigned binaries)

The release binaries are not signed:

- **macOS:** move *App Lab for Torizon.app* to Applications, then right-click it and choose Open
  (or run `xattr -dr com.apple.quarantine "/Applications/App Lab for Torizon.app"`).
- **Windows:** unzip and run `AppLabTorizon.exe`; on the SmartScreen warning choose More info, Run
  anyway. Needs the WebView2 runtime (included in Windows 10 and 11).
- **Linux (x86-64):** `chmod +x AppLabTorizon` and run it; needs `libwebkit2gtk-4.1` (Ubuntu 22.04 or
  later).

It installs next to the official App Lab and shares its settings and caches. `arduino-app-lab://`
links open whichever of the two the system picked.

### Build

As below, with the version set at build time, for example:

```
wails build -platform darwin/universal -ldflags "-X main.version=0.10.0+torizon.1"
```

Source: branch [`torizon-cloud`](https://github.com/EstebanSannin/arduino-app-lab/tree/torizon-cloud).
License: GPL-3.0, as upstream.

---

# Arduino App Lab

This is the Arduino App Lab desktop application. It's a cross-platform application built with [Wails](https://wails.io)

<img src="docs/app-lab-screenshot.png" alt="Arduino App Lab" width="600">

## Issues

GitHub issue reports for both user and contributor facing bugs of App Lab are welcome. 

## Setup

Required:

- `node.js`
- `yarn`
- `direnv`

### direnv

This project uses [direnv](https://direnv.net/) to execute it in a dedicated shell and isolate it from the system. This gives us full control of the project and makes it easily reproducible.
This means that you do not need to have anything special installed on your machine (neither node, nor yarn), but the necessary engines will be handled automatically and will be isolated only in this project.
All you need to do is:

#### macOS and Linux
1. Make sure direnv is installed on your machine. It is usually shipped with most distributions, if not in your case please follow these instructions for installation https://direnv.net/docs/installation.html and setup for your shell https://direnv.net/docs/hook.html .
2. Run `direnv allow` the first time you enter the project.

#### Windows
([Git Bash](https://gitforwindows.org/) or an equivalent shell that supports bash is required).
1. Follow the instructions contained in this [gist](https://gist.github.com/rmtuckerphx/4ace28c1605300462340ffa7b7001c6d) from point 1, to 7. When asked to download the direnv release keep in mind that the version tested and working with our project is the `v2.19.2`.
2. Follow the installation guide from [this repository](https://github.com/AppalachiaInteractive/bash-preexec#installation) (if you are curious to know the reason for these additional steps, you can read [here](https://github.com/direnv/direnv/issues/796)).
3. Run `direnv allow` the first time you enter the project.

#### Verify
Once you've confirmed you have direnv and you've setup your environment after doing `direnv allow`, you can verify that node and yarn are isolated for your environment by typing in the shell `which node`, `node -v`, `which yarn` and `yarn -v`.
You should receive paths inside the project and respectively the version of node 18.15.0 and yarn 3.5.0.


## Building (local machine)

To build a redistributable, production mode package:

1. Install Yarn with `sudo npm install --global yarn`
1. Setup npm package with `yarn`.
1. Install Wails with `go install github.com/wailsapp/wails/v2/cmd/wails@latest`.
1. Install `wget` and `jq` globally on your machine, using the right procedure for your operating system. 
    
    E.g. on macOS, you could use `brew install wget jq`.    
    On a Debian based machine you could use `apt-get install wget jq -y`.

1. `cd standalone-apps/app-lab-desktop/internal/board/`
1. Download the tools to bundle in the wails app by running: `./download_resources.sh`.
1. Run `wails build` to make the final build.

To correctly build the app on Linux, the webkit library is required. At the time of writing, on Ubuntu 24.04 `libwebkit2gtk-4.1-dev` package is available, and the corresponding wails app should be built with the command `wails build -tags webkit2_41`. You may adjust these values as needed for your OS version.

## Live Development

To run in live development mode, run `yarn start-app-lab-desktop` from the root of the project. This will run a Vite development server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on `http://localhost:34115`. Connect
to this in your browser, and you can call your Go code from devtools.

## A note for Linux users
Some users have reported issues selecting the Arduino Q board in App Lab on Linux. A solution can be found in this [post on the Arduino forum](https://forum.arduino.cc/t/solution-arduino-app-lab-ubuntu-does-nothing-when-selecting-the-board/1411373)

