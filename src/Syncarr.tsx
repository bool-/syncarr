import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import store from 'store';
import platform from 'platform';
import PlexAuthentication from './components/plex_auth';
import PlexDeviceSelection from './components/plex_device_selection';

import { PlexOptions, Resource } from './plex';
import PlexServerSelection from './components/plex_servers';
import PlexLibrary from './components/plex_library';

function PlexSignin() {
  const plexToken = store.get('plexToken');
  if (!plexToken) {
    return <Link to="/signin">Sign in to Plex</Link>;
  } else {
    return <Link to="/settings">Settings</Link>;
  }
}


interface SyncarrState {
  token: string;
  server?: Resource
}

class Syncarr extends React.Component<any, SyncarrState> {
  private plexOptions: PlexOptions;

  constructor(props: any) {
    super(props);
    let clientIdentifier: string = store.get('clientIdentifier');
    if (!clientIdentifier) {
      clientIdentifier = uuidv4();
      store.set('clientIdentifier', clientIdentifier);
    }
    const token = store.get('plexToken', '');
    this.plexOptions = {
      device: platform.os?.family,
      deviceName: platform.name,
      platform: platform.name,
      platformVersion: platform.version,
      identifier: clientIdentifier,
      provides: 'client, controller',
      product: 'Syncarr',
      token: token,
    };
    this.state = {
      token: '',
      server: undefined,
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Router>
        <div>
          <NavBar/>

          <Switch>
            <Route path="/signin">
              <PlexAuthentication
                plexOptions={this.plexOptions}
                onAuthenticationComplete={(authToken: string) => {
                  this.plexOptions.token = authToken;
                  this.setState(state => {
                    return {
                      token: authToken,
                    };
                  });
                }}
              />
            </Route>
            <Route path="/settings">
              <PlexDeviceSelection
                plexOptions={this.plexOptions}
                onDeviceSelection={() => {
                }}
              />
            </Route>
            <Route path="/player">
              <div/>
            </Route>
            <Route path="/library">
              {
                this.state.server &&
                <PlexLibrary plexOptions={this.plexOptions} onItemSelection={() => {}}/>
              }
            </Route>
            <Route path="/">
              {
                this.plexOptions.token !== '' &&
                <PlexServerSelection plexOptions={this.plexOptions} onServerSelection={(server) => {
                  this.setState(state => {
                    this.plexOptions.url = server.connections[0].uri;
                    return {
                      server: server,
                    };
                  });
                }}/>
              }
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
export default Syncarr;

function NavBar() {
  return (
    <ul>
      <li>
        <Link to='/'>Syncarr</Link>
      </li>
      <li>
        <PlexSignin/>
      </li>
      <li>
        <Link to='/plex'>Plex</Link>
      </li>
      <li>
        <Link to='/library'>Library</Link>
      </li>
    </ul>
  );
}
