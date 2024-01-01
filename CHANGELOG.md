# Changelog

## [Unreleased]

-   Nothing for now (but open to suggestions!)

## [3.0.2] - 2024-01-01

### Added

-   Added JSDocs with some examples for moest exposed methods
-   Added known caveats to this library to README.md

## [3.0.1] - 2024-01-01

### Added

-   Feature detection for Shared Worker modules
-   Failing gracefully in case of no Shared Worker module support
-   More event listeners to handle reload/close better on all devices

## [3.0.0] - 2024-01-01

### Added

-   This changelog
-   Added optional name to `SharedWebChannel` constructor
-   Added connection size to `SharedWebChannel` API
-   Added `ChannelObserver`
-   Added types to export

### Changed

-   Breaking changes for the `SharedWebChannel` sendMessage API

## [2.1.0] - 2023-12-30

### Fixed

-   Switch to build with [TSUP](https://tsup.egoist.dev/)

### Added

-   Support for ESM and CJS
-   Functional build for the first time, package can now be used

## [2.0.0] - 2023-12-30

### Changed

-   Switch back to only compiling with TSC (but build still fails)

## [1.2.0] - 2023-12-29

### Changed

-   Switch to building with Webpack (but build fails)

## [1.1.0] - 2023-12-24

### Added

-   SharedWebChannel API
-   README.md

## [1.0.0] - 2023-12-23

### Added

-   First raw setup for package to test npm install. Not functional yet.
