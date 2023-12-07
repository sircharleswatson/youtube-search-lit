import { LitElement, html } from "lit"
import { Task } from "@lit/task"
import { customElement } from "lit/decorators.js"
import axios from "axios"

import "./components/video-grid"

@customElement("page-home")
export class Home extends LitElement {
  private _searchTask = new Task(this, {
    task: async ([term], { signal }) => {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + "/search", { term }, { signal })
        return response.data
      } catch (e: unknown) {
        throw new Error(e as string) 
      }
    },
    args: () => ["lit.dev"]
  })


  render() {
    return this._searchTask.render({
      pending: () => html`<p>Loading videos...</p>`,
      complete: (result) => html`
        <video-grid .videos=${result}></video-grid>
      `,
      error: (e) => html`<p>Error: ${e}</p>`
    })
  }
}