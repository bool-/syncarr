import React from 'react';
import axios from 'axios';
import store from 'store';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps {
  clientIdentifier: string;
  clientVersion: string;
  clientName: string;
}

class PlexAuthentication extends React.Component<Props> {
  private ticker?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.ticker = undefined;
  }

  async componentDidMount() {
    const plex = axios.create({
      baseURL: 'https://plex.tv/',
      headers: {
        'X-Plex-Device': 'Web',
        'X-Plex-Device-Name': this.props.clientName,
        'X-Plex-Product': this.props.clientName,
        'X-Plex-Version': this.props.clientVersion,
        'X-Plex-Platform-Version': '',
        'X-Plex-Client-Identifier': this.props.clientIdentifier,
        'X-Plex-Platform': 'Firefox',
      },
    });
    let result = await plex.post('/api/v2/pins?strong=true');
    const features = 'width=800, height=500, left=300, top=200';
    const externalWindow = window.open(
      `https://app.plex.tv/auth/#!?clientID=${this.props.clientIdentifier}&code=${result.data.code}`,
      '',
      features,
    );
    this.ticker = setInterval(async () => {
      result = await plex.get(`https://plex.tv/api/v2/pins/${result.data.id}`);
      if (result && result.data && result.data.authToken) {
        if (externalWindow) {
          externalWindow.close();
        }

        if (this.ticker) {
          clearInterval(this.ticker);
        }
        store.set('plexToken', result.data.authToken);
        console.log(result.data.authToken);
        this.props.history.goBack();
      }
    }, 2000);
  }

  render() {
    return <div>Just keep swimming...</div>;
  }
}

export default withRouter(PlexAuthentication);
