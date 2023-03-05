import { writeFileSync } from 'fs'
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v='
const FILE_NAME = 'result.csv'
const WAIT_TIME = 5000
console.debug = function () {}

if (process.env.YOUTUBE_API_KEY === undefined) {
  throw new Error('YOUTUBE_API_KEY is not defined')
}
const API_KEY: string = process.env.YOUTUBE_API_KEY

if (process.argv[2] === undefined) {
  throw new Error('Please search query. ref: https://developers.google.com/youtube/v3/docs/search/list?hl=ja')
}
// 'part=snippet&{検索条件}'
// ref: https://developers.google.com/youtube/v3/docs/search/list?hl=ja
const REQUEST_PARAM: string = process.argv[2]

interface FetchRequest {
  url: string
  options: object
}

interface YouTubeSearchResponseItem {
  kind: string
  etag: string
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: {
        url: string
        width: number
        height: number

      }
      medium: {
        url: string
        width: number
        height: number

      }
      high: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    liveBroadcastContent: string
    publishTime: string
  }
}

interface YouTubeSearchResponse {
  kind: string
  etag: string
  nextPageToken: string | undefined
  prevPageToken: string | undefined
  regionCode: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeSearchResponseItem[]
}

const sleep = async (msec: number): Promise<void> => { await new Promise(resolve => setTimeout(resolve, msec)) }

async function fetchAsync (request: FetchRequest): Promise<string> {
  return await fetch(request.url, request.options)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      return await response.blob()
    })
    .then(async (response) => {
      return await response.text()
    })
}

function parseYouTubeSearchResponse (response: string): YouTubeSearchResponse {
  return JSON.parse(response)
}

function createRequestURL (nextRequestParam: string): string {
  return YOUTUBE_SEARCH_URL + '?' + nextRequestParam + '&key=' + API_KEY
}

async function main (requestParam: string): Promise<void> {
  const items: YouTubeSearchResponseItem[] = []
  let nextRequestParam: string = requestParam

  while (true) {
    const result = await fetchAsync({
      url: createRequestURL(nextRequestParam),
      options: {}
    })

    console.debug(result)
    const youTubeSearchResponse = parseYouTubeSearchResponse(result)
    for (const item of youTubeSearchResponse.items) {
      items.push(item)
    }
    console.log(`${items.length} / ${youTubeSearchResponse.pageInfo.totalResults}`)
    if (youTubeSearchResponse.nextPageToken === undefined) {
      break
    }
    nextRequestParam = requestParam + '&pageToken=' + youTubeSearchResponse.nextPageToken
    await sleep(WAIT_TIME)
  }

  let csv = 'publishedAt,title,url\n'
  for (const item of items) {
    csv += `${item.snippet.publishedAt},${item.snippet.title},${YOUTUBE_WATCH_URL + item.id.videoId}\n`
  }
  writeFileSync(FILE_NAME, csv)
}

main(REQUEST_PARAM).catch((error) => {
  console.error(error)
})
