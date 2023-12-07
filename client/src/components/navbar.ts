import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

import "./search"


@customElement("nav-bar")
export class NavBar extends LitElement {
  render() {
    return html`
      <div id="container">
        <div id="start" class="box">
          <a id="title" href="/">Youtube</a>
        </div>
        <div id="center" class="box">
          <search-bar></search-bar>
        </div>
        <div id="end" class="box">
          <p>Welcome!</p>
        </div>
      </div>
    `
  }

  static styles = css`
    #title {
      margin: 0;
      display: block;
      font-size: 32px;
      color: white;
      text-decoration: none;
      font-weight: 700;
    }

    #container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-left: 24px;
      padding-right: 24px;
    }

    .box {
      display: flex;
      flex: 1;
    }

    #center {
      align-items: center;
      justify-content: center;
    }
    #start {
      margin-right: auto;
      justify-content: flex-start;
    }
    #end {
      margin-left: auto;
      justify-content: flex-end;
    }
  `
}
