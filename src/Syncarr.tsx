import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {PlexAuthentication} from './components/plex_auth';
import { v4 as uuidv4 } from 'uuid';
import store from 'store';
import platform from 'platform';
import { PlexOptions } from './plex';
import * as plex from './plex'
import { PlexDeviceSelection } from './components/plex_device_selection';

function PlexSignin() {
  const plexToken = store.get('plexToken');
  if (!plexToken) {
    return <Link to="/signin">Sign in to Plex</Link>;
  } else {
    return <Link to="/settings">Settings</Link>;
  }
}

export default function Syncarr() {
  // TODO address this code block properly
  let clientIdentifier: string = store.get('clientIdentifier');
  if (!clientIdentifier) {
    clientIdentifier = uuidv4();
    store.set('clientIdentifier', clientIdentifier);
  }
  let plexOptions: PlexOptions = {
    device: platform.os?.family,
    deviceName: platform.name,
    platform: platform.name,
    platformVersion: platform.version,
    identifier: clientIdentifier,
    provides: 'client, controller',
    product: 'Syncarr',
    token: store.get('plexToken', '')
  };
  return (
    <Router>
      <div>
        <NavBar />

        <Switch>
          <Route path="/signin">
            <PlexAuthentication
              plexOptions={plexOptions}
              onAuthenticationComplete={(authToken) => {
                plexOptions.token = authToken;
              }}
            />
          </Route>
          <Route path="/settings">
            <PlexDeviceSelection
              plexOptions={plexOptions}
              onDeviceSelection={() => {}}
            />
          </Route>
          <Route path="/player">
            <div/>
          </Route>
          <Route path="/"/>
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
        <PlexSignin />
      </li>
      <li>
        <Link to="/plex">Plex</Link>
      </li>
    </ul>
  );
}
