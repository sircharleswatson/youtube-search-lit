export interface Video {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string,
        height: number
        width: number
      }
    }
  }
  statistics: {
    viewCount: number
    commentCount: number
  }
}