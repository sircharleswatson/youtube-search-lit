import { Task } from "@lit/task"
import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { queryString } from "router-slot"
import axios from "axios"

import "./components/video-list"
import "./components/video-filter"

@customElement("page-search-results")
export class SearchResults extends LitElement {
  @state()
    term: string = new URLSearchParams(queryString()).get("term") || ""

  @state()
    order?: string = new URLSearchParams(queryString()).get("order") || undefined


  private _searchTask = new Task(this, {
    task: async ([term, order], { signal }) => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/search", 
          { term, order }, 
          { signal }
        )
        return response.data
      } catch (e: unknown) {
        throw new Error(e as string) 
      }
    },
    args: () => [this.term, this.order]
  })

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener("changestate", this.updateParams)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener("changestate", this.updateParams)
  }

  updateParams = () => {
    this.term = new URLSearchParams(queryString()).get("term") || ""
    this.order = new URLSearchParams(queryString()).get("order") || undefined
  }

  renderTask() {
    return this._searchTask.render({
      pending: () => html`<div class="container"><p>Loading videos...</p></div>`,
      complete: (result) => html`
        <video-list id="list" .videos=${result}></video-list>
      `,
      error: (e) => html`<p>Error: ${e}</p>`
    })
  }

  render() {
    return html`
      <div class="container">
        <video-sort .sort=${this.order}></video-sort>
      </div>
      ${this.renderTask()}
    `
  }

  static styles = css`
    .container {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding-left: 24px;
      padding-right: 24px;
      margin-bottom: 16px;
    }
  `
}