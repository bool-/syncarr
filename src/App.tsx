import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import PlexAuthentication from "./components/plex_auth";

export default function App() {
    return (
        <Router>
            <div>
                <NavBar />

                <Switch>
                    <Route path="/about">
                        <div></div>
                    </Route>
                    <Route path="/player">
                        <div></div>
                    </Route>
                    <Route path="/">

                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function NavBar() {
    return (
        <ul>
            <li>
                <Link to="/">Syncarr</Link>
            </li>
        </ul>
    );
}