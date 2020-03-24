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
import {v4 as uuidv4} from 'uuid'
import store from 'store'

// TODO address this code block properly
let clientIdentifier: string = store.get('clientIdentifier');
if (!clientIdentifier) {
    clientIdentifier = uuidv4();
    store.set('clientIdentifier', clientIdentifier);
}
const clientVersion: string = '0.0.1';
const clientName: string = 'Syncarr';

function PlexSignin() {
    const plexToken = store.get('plexToken');
    if (plexToken) {
        return <Link to="/signin">Sign in to Plex</Link>;
    } else {
        return <Link to="/settings">Settings</Link>;
    }
}

export default function Syncarr() {
    return (
        <Router>
            <div>
                <NavBar/>

                <Switch>
                    <Route path="/signin">
                        <PlexAuthentication clientIdentifier={clientIdentifier} clientVersion={clientVersion}
                                            clientName={clientName}/>
                    </Route>
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
            <li>
                <PlexSignin/>
            </li>
            <li>
                <Link to="/plex">Plex</Link>
            </li>
        </ul>
    );
}