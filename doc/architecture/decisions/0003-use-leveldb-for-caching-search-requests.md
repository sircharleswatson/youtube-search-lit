# 3. Use LevelDB for caching search requests

Date: 2023-12-07

## Status

Accepted

## Context

The Youtube Data API uses a credit-like system (referred to as "quota"). For the free tier, you're allotted 10,000 credits.

The Search endpoint consumes 100 credits per request. 

It would be good to use some kind of caching mechanism for duplicate/repeat requests so as not to use more credits than necessary.

## Decision

I decided to use an in-memory/on-disk database plugin called LevelDB ([@fastify/leveldb](https://github.com/fastify/fastify-leveldb)) to cache searches.

Results from each search are stored as a key-value pair, where the key is a hash of the search term combined with the sort order.

## Consequences

An in-memory/on-disk solution seems sufficient for this project. With the low amount of credits, we can only get about 100 searches per day. This is meant to optimize that.

If a more permanent solution was necessary, something like Redis might be better.
