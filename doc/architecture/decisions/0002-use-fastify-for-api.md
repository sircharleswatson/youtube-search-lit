# 2. Use Fastify for API

Date: 2023-12-07

## Status

Accepted

## Context

In order to avoid exposing API keys, a server to communicate with the Youtube Data API would be beneficial.

## Decision

[Fastify](https://fastify.dev/) was chosen for it's performance as well as it's ease of use from a developer experience perspective

## Consequences

Fastify is very easy to get up and running, and there is a plethora of plugins for various integrations (Databases, middleware, etc)

However, Fastify isn't quite as popular as other web frameworks like Express, so support from the developer community may be harder to come by. 