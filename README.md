# Youtube Search App 

### [Live Demo](https://youtube-search-jngt.onrender.com/)

## Goal
The goal of this project is to implement Youtube's Data API in a SPA providing a UI for interacting the search endpoint.

The app should use Web Components, in this case: [Lit.dev](https://lit.dev)

### Requirements

**Search**
  - Search by keyword
  - Sort by date, rating, relevance

**Results**
  - List view
  - Title that links to the video on Youtube.com
  - Thumbnail
  - Description
  - Comment count


## Setup for local use

**Download:**
```
git clone https://github.com/sircharleswatson/youtube-search-lit
cd youtube-search-lit
```

**Install dependencies:**
```
npm i
```

**Setup env vars:**

There are _**two**_ `.env.sample` files in the project. One in the root directory and the other inside of `client`.

Copy those both to a new `.env` file, keeping them in their respective locations.

For the `YOUTUBE_API_KEY` you will need to follow the instructions [here](https://developers.google.com/youtube/v3/getting-started#before-you-start) to create a new API key.

> _Note: It's recommended to scope down the key as much as possible. Only allow access to Youtube, and only allow access to specific IPs or Domains_


**Start the client:**
```
npm run dev
```

**Start the server:**
```
npm start
```

## Dependencies

### Client: 

#### Lit

As far as web component frameworks go, this one seems to be fairly popular. It's got a very similar feel to React (mostly old react before hooks came along).

#### router-slot

The design I had in my head required multiple pages so I thought I'd include a client-side routing library. I tried many different ones including `@vaadin/router` and `@lit-labs/router`. 

Vaadin router seems like it's a popular choice but the lack of activity in issues/PRs and commits turned me away from it. There were also 3-4 different versions of their documentation, among many broken links, but even then, the docs seemed outdated.

@lit-labs/router looked a little more promising but it felt like it was still in very early stages.

Ultimately, I found [router-slot](https://github.com/andreasbm/router-slot) through webcomponents.org and ended up liking it. It includes a handful of extra helper functions that are nice as well. And their documentation has lots of great examples of how to do various things.

#### @lit/task + axios

I ended up using [@lit/task](https://lit.dev/docs/data/task/), in combination with [Axios](https://axios-http.com/), to communicate with the API.

From the Task docs:
>     Task takes care of a number of things needed to properly manage async work:
> 
>     - Gathers task arguments when the host updates
>     - Runs task functions when arguments change
>     - Tracks the task status (initial, pending, complete, or error)
>     - Saves the last completion value or error of the task function
>     - Triggers a host update when the task changes status
>     - Handles race conditions, ensuring that only the latest task invocation completes the task
>     - Renders the correct template for the current task status
>     - Allows aborting tasks with an AbortController

### Server:

#### Fastify

Fastify is a super fast Node.js web framework, and getting started with it is extremely fast as well. It was an easy choice for a project like this.

#### @fastify/static

This plugin allows fastify to serve the static client side app

#### @fastify/leveldb

This was pulled in to facilitate caching of the youtube search results.


## Design

I went back and forth on the design a bit because I wasn't anticipating setting up a server side for this project. The Youtube API allows you to scope your token to specific IP Addresses or Domains so I wasn't too worried about exposing the key on the front end since it wouldn't be able to be used anywhere else.

Ultimately though, I opted to setup a server in order to get the benefits of being able to cache the results, saving "credits" on the Data API.

### Endpoints

##### `GET /`

This route serves the static client files

##### `GET /api`

This is essentially a pulse check

##### `POST /api/search`

This is the main endpoint that takes care of everything.

```
@param {string} term - The search term passed to youtube
@param {string} [order=relevance] - The order (relevance, date, rating) to sort the search by, also passed through to youtube
```

When a user hits this, the app will first check in the leveldb cache to see if there are existing results stored with the associated hashed key. The key is a `sha1` hash of the search term and the order combined. If any exist, the API will return those.

Otherwise, if there are no cached videos, it will proceed to search Youtube.

To get the results from youtube, first it hits the `search` endpoint with the term and order that were supplied. This endpoint does not include comment counts which is a requirement, so we need to also call the `videos` endpoint (this takes 1 "credit"). The ids from the search results are extracted then we take the array of ids and do a bulk fetch for the statistics (along with the `snippet` and `contentDetails`) on the `videos` endpoint.

After that is done, the results are stored in the cache for subsequent requests of the same parameters and the results are returned to the client.


### Client

#### Routing

I wanted to have separate "home" and "results" pages, so I opted to include a client side router.

The main App component includes a header which contains the search bar and a "Youtube" home link.

The home page is a fairly simple grid of videos with a default search.

When a user enters a search term, they're brought to `/results?term=<TERM>` which then displays a list view of the videos with title, description, thumbnail, view count, comment count.

#### Sorting

I opted to _**not**_ do any client side sorting of the results because doing that wouldn't exactly be accurate. It would only be sorting the "relevant" results by date/rating rather than actually getting results back from youtube that are sorted on their end.

For example, sorting by `date` on the client side would only sort the returned relevant results. If we fetch from youtube with the `date` sort, we will actually get the most recently uploaded videos for the term.


## Future improvements

There are a lot of things I'd like to improve going forward on this project.

#### Styling

I'm a huge fan of TailwindCSS, so I'd love to get that working. I found a [video](https://www.youtube.com/watch?v=HwkXCYiRgtE) of someone explaining how to get that setup using [twlit](https://github.com/markjameshoward/twlit)

#### Split out more components

There's room to split some more things out into reusable components. For example, a `video-list-item` and a `video-grid-item`

#### Split the client and server

Ideally I'd have the client and the server in separate repos and hosted separately. The client app could live on S3 behind a CDN or something, while the server gets deployed to something like EC2 for example.

This would allow for better organization and separation of concerns. And reduce the shared dependencies they currently have.

#### Setup better npm scripts

Fastify has a cli that could be used to run the dev server and watch for changes.

#### Switch to yarn or pnpm

I've been wanting to try pnpm. I like the idea of being able to commit deps to the repo without the huge cost that has with npm/yarn, so it'd be fun to test that out.
