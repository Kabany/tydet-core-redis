# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.1] 2025-04-07
### Add
* Add `onDisconnected` and `onConnected` callbacks.
### Updated
* Call `super` on lifecycle events.

## [v2.0.0] 2025-04-07
### Updated
* Update `tydet-core` to `2.0.0`.
* Handle the new events for `restart` and `eject` service methods.
### Added
* Add `onReady()` callback.

## [v1.0.4] 2024-10-08
### Fix
* Downgrade chalk.

## [v1.0.3] 2024-10-08
* Update 'typescript', 'uuid', 'redis', 'tydet-utils', 'tydet-core-logger' and 'tydet-core' repositories.

## [v1.0.2] 2024-05-13
### Fix
* Fix empty space in the index.ts name
* Remove SQL input parameter in RedisCoreError constructor
* Add SkipLib in the TS Config.

## [v1.0.1] 2024-05-10
### Fix
* Export Redis ESM in a CJS build.

## [v1.0.0] 2024-05-07
### Added
* Redis Connector Service
* Redis simple methods: SET, GET, DEL, HSET, HGET, HDEL

