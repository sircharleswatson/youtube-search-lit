import { LitElement, css, html } from "lit"
import { query, customElement } from "lit/decorators.js"
import { RouterSlot } from "router-slot"

import { routes } from "./router"
import "./components/navbar"

@customElement("lit-app")
export class App extends LitElement {
  @query("router-slot") $routerSlot!: RouterSlot

  firstUpdated() {
    this.$routerSlot.add(routes)
  }

  render() {
    return html`
      <header>
        <nav-bar></nav-bar>
      </header>
      <main>
        <router-slot></router-slot>
      </main>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 24px;
    }
  `
}