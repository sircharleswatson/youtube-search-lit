const fastify = require("fastify")({ logger: true })
const axios = require("axios")
const path = require("path")
const fastifyEnv = require("@fastify/env")
const fastifyLeveldb = require("@fastify/leveldb")
const fastifyStatic = require("@fastify/static")

const youtube = require("./youtube")

const schema = {
  type: "object",
  required: ["YOUTUBE_API_KEY"],
  properties: {
    YOUTUBE_API_KEY: {
      type: "string",
    },
  },
}

const options = {
  schema,
  dotenv: true,
}

fastify
  .register(fastifyEnv, options)
  .ready()

fastify.register(
  fastifyLeveldb,
  { name: "db" },
)

fastify.post("/api/search", async function cb(request, reply) {
  const { term, order } = request.body

  const videos = await youtube.search(term, order, {context: this})

  reply.send(videos)
})

fastify.get("/api", (request, reply) => {
  reply.send({ ping: "pong" })
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/",
})

fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile("index.html")
})

fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
  },
  (err) => {
    if (err) throw err
  },
)
