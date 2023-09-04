# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2022-10-17

### Added

- Add feature to exclude files from strict check based on `exclude` config property

## [2.1.0] - 2022-10-14

### Added

- Support for projects not located at root of repository using `tsc`'s `--project` flag.

## [2.0.2] - 2022-07-28

### Fixed

- Incorrect handling of out of memory exception

## [2.0.1] - 2022-07-28

### Fixed

- Incorrect relative path resolving

## [2.0.0] - 2021-29-11

### Changed

- Strict by default without `@ts-strict` comment
- Ignores file with `@ts-strict-ignore` comment
- Migration tool `update-strict-comments` which updates comments in files which contain at least 1
  strict error
- Fixes error when `pretty: true` option was set in `tsconfig.json`
- Adds a cache to compilation for `tsc-strict` process resulting in 50% speedup

## [1.1.2] - 2021-06-15

### Added

- Rewrites some tests to `jest`
- Adds feature to pass `tsc` parameters to `tsc-strict` command

## [1.1.1] - 2021-08-29

### Fixed

- Path features not working on Windows machines

## [1.1.0] - 2021-06-15

### Added

- Adds cli tool to check strict files during build time

## [1.0.1] - 2021-06-01

### Fixed

- Issue when using // @ts-strict in one file would affect other files without this comment resulting
  in strict mode errors

## [1.0.0] - 2021-05-11

### Added

- First stable version of the plugin
