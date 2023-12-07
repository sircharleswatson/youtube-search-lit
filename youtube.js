const axios = require("axios")
const crypto = require("crypto")

/*
 * Public API
 */

async function search(term, order = "relevance", { context }) {
  const cachedResults = await searchCache(term, order, { context })

  if (cachedResults) {
    return cachedResults
  }

  return searchYoutube(term, order, { context })
}

/*
 * Private
 */

async function searchCache(term, order, { context }) {
  const searchKey = hashSearchArgs(term, order)
  try {
    return JSON.parse(await context.level.db.get(searchKey))
  } catch (e) {
    return null
  }
}

async function searchYoutube(term, order, { context }) {
  const queryString = getQueryString({
    key: process.env.YOUTUBE_API_KEY,
    q: term,
    order,
    maxResults: 50,
    part: "snippet",
  })

  const searchResults = await searchVideos(queryString)
  const enrichedVideos = await enrichVideos(searchResults)

  await cacheVideos(term, order, enrichedVideos, {context})

  return enrichedVideos
}

async function enrichVideos(videos) {
  const ids = extractVideoIds(videos).join(",")
  return getVideoDetails(ids)
}

async function cacheVideos(term, order, videos, { context }) {
  const searchKey = hashSearchArgs(term, order)

  await context.level.db.put(searchKey, JSON.stringify(videos))
}

/*
 * Youtube API
 */

async function searchVideos(queryString) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search${queryString}`)
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

async function getVideoDetails(ids) {
  const queryParams = {
    key: process.env.YOUTUBE_API_KEY,
    id: ids,
    part: "snippet,contentDetails,statistics",
  }

  const queryString = `?${new URLSearchParams(queryParams).toString()}`

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos${queryString}`)
    const cleanedVideos = getVideoFields(
      response.data.items, 
      ["id", "snippet", "statistics", "contentDetails"]
    )

    return cleanedVideos
  } catch (e) {
    throw new Error(e)
  }
}

/*
 * Helpers
 */

function getQueryString(params) {
  const queryString = `?${new URLSearchParams(params).toString()}`
  return queryString
}

function hashSearchArgs(term, order) {
  const searchArgString = [term, order].join(",")

  return crypto.createHash("sha1")
    .update(searchArgString).digest("hex")
}

function getVideoFields(videos, fields) {
  return videos.map((video) => fields.reduce((result, key) => ({
    ...result,
    [key]: video[key],
  }), {}))
}

function extractVideoIds(searchResults) {
  return searchResults.items.map((video) => video.id.videoId)
}

module.exports = {
  search,
}
