import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"
import { styleMap } from "lit/directives/style-map.js"
import { Video } from "types/video"

const formatter = Intl.NumberFormat("en", { notation: "compact" })

@customElement("video-list")
export class VideoList extends LitElement {
  @property({ type: Array })
    videos!: Video[]

  renderVideos() {
    return this.videos.map((video) => {
      const thumbnail = video.snippet.thumbnails.medium

      return html`
        <div class="video">
          <a 
            href="https://youtube.com/watch?v=${video.id}"
            title=${video.snippet.title}
            target="_blank"
          >
            <img src=${thumbnail.url} style=${styleMap({height: thumbnail.height, width: thumbnail.width})}>
          </a>
          <div class="video-details">
            <a 
              href="https://youtube.com/watch?v=${video.id}"
              title=${video.snippet.title}
              target="_blank"
            >
              ${video.snippet.title}
            </a>
            <div class="stats">
              <span>${formatter.format(video.statistics.viewCount)} views</span>
              <span>•</span>
              <span>${formatter.format(video.statistics.commentCount)} comments</span>
            </div>
            <p class="description">
              ${video.snippet.description}
            </p>
          </div>
        </div>
    `})
  }

  render() {
    return html`
      <div class="container">
        ${this.renderVideos()}
      </div>
    `
  }

  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      max-width: 920px;
      margin: 0 auto;
      gap: 16px;
    }

    .video {
      display: flex;
      flex-direction: row;
      gap: 16px;
    }

    .video-details {
      display: flex;
      flex-direction: column;
    }

    a {
      font-weight: 700;
      text-decoration: none;
      font-size: 20px;
      color: white
    }

    a:hover {
      text-decoration: underline;
    }
    
    .description {
      overflow:hidden;
      text-overflow: ellipsis;    
      display: -webkit-box;    

      /* number-of lines */    
      -webkit-line-clamp: 3;

      -webkit-box-orient: vertical; 
      word-wrap:break-word;    

      /* line-height for 1 line */    
      line-height:1.2; 

      /* line-height * 3 */
      max-height:3.6rem; 
    }

    .stats {
      font-size: 12px;
      color: #ccc
    }
  `
}