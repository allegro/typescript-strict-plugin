# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
