import { LinksFunction } from "@remix-run/node";
import styles from "./topNavbar.css";
import { useFavoriteSalads } from "./hooks";
import { Link, useMatches } from "@remix-run/react";
import { UIMatch } from "react-router";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function TopNavBar() {
  const matches = useMatches();
  const { favoriteSalads } = useFavoriteSalads();

  const currentRoute = getCurrentRoute(matches)

  return (
    <nav className="top-nav-bar">
      <ul className="nav-links">
        <li className={`nav-link${currentRoute === '/' ? ' active' : ''}`}>
          <Link to="/">Home</Link>
        </li>
        <li className={`nav-link${currentRoute === '/favorites' ? ' active' : ''}`}>
          <Link to="/favorites">{Object.values(favoriteSalads).length} Favorites</Link>
        </li>
      </ul>
    </nav>
  );
}

function getCurrentRoute(matches: UIMatch<unknown, unknown>[]) {
  const lastMatch = matches[matches.length - 1]
  return lastMatch.pathname
}