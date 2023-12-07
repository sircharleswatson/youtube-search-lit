import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { queryString } from "router-slot"

@customElement("video-sort")
export class VideoSort extends LitElement {
  @property()
    sort?: string | null

  updateSort(event: Event) {
    const selectInput = event.target as HTMLSelectElement

    const params = new URLSearchParams(queryString())
    params.set("order", selectInput.value)

    const updatedParams = params.toString()
    history.pushState(null, "", `/results?${updatedParams}`)
  }

  render() {
    return html`
      <select @change=${this.updateSort}>
        <option value="relevance" ?selected=${this.sort === "relevance"}>Relevance</option>
        <option value="date" ?selected=${this.sort === "date"}>Date</option>
        <option value="rating" ?selected=${this.sort === "rating"}>Rating</option>
      </select>
    `
  }
}