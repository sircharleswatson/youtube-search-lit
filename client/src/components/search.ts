import { LitElement, html } from "lit"
import { customElement, state, query } from "lit/decorators.js"
import { queryString } from "router-slot"

@customElement("search-bar")
export class SearchBar extends LitElement {
  @state()
    term = new URLSearchParams(queryString()).get("term") || ""

  @query("#search")
    input!: HTMLInputElement

  render() {
    return html`
      <div class="search-bar">
        <form @submit=${this.search}>
          <input id="search" .value=${this.term} @input=${this.setTerm}></input>
          <button type="submit" @click=${this.search}>search</button>
        </form>
      </div>
    `
  }

  setTerm(event: Event) {
    this.term = (event.target as HTMLInputElement).value
  }

  search(event: Event) {
    event.preventDefault()

    this.input.blur()
    history.pushState(null, "", "/results?" + new URLSearchParams({term: this.term}))
  }
}