import { Home } from "../pages/home/page-home"
import { SearchResults } from "../pages/results/page-results"

export const routes = [
  { path: "/results", component: SearchResults },
  { path: "**", component: Home },
]