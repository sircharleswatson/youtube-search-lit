import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"
import {styleMap} from "lit/directives/style-map.js"
import { Video } from "types/video"

@customElement("video-grid")
export class VideoGrid extends LitElement {
  @property({type: Array})
    videos!: Video[]

  renderVideos() {
    return this.videos.map((video) => {
      const thumbnail = video.snippet.thumbnails.medium

      return html`
        <a
          href="https://youtube.com/watch?v=${video.id}"
          title=${video.snippet.title}
          target="_blank"
        >
          <div class="video">
            <img src=${thumbnail.url} style=${styleMap({height: thumbnail.height, width: "100%"})}>

              ${video.snippet.title}
          </div>
        </a>
      `
    })
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
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 0 40px;
    }

    a {
      font-weight: 700;
      text-decoration: none;
      font-size: 16px;
      color: white
    }

    a:hover {
      text-decoration: underline;
    }
  `
}