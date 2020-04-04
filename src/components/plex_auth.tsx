import PlexAPI, { PlexOptions, Pin } from '../plex';
import React from 'react';

interface PlexAuthenticationProps {
  plexOptions: PlexOptions;

  onAuthenticationComplete(authToken: string): any;
}

class PlexAuthentication extends React.Component<PlexAuthenticationProps, any> {
  private ticker?: NodeJS.Timeout;

  constructor(props: PlexAuthenticationProps) {
    super(props);
    this.ticker = undefined;
  }

  async componentDidMount() {
    const client: PlexAPI = new PlexAPI(this.props.plexOptions);
    let result: Pin = await client.pin();
    const features = 'width=800, height=500, left=300, top=200';
    const externalWindow = window.open(`https://app.plex.tv/auth/#!?clientID=${this.props.plexOptions.identifier}&code=${result.code}`, '', features);
    this.ticker = setInterval(async () => {
      result = await client.pin(result.id);
      if (result && result.authToken) {
        if (externalWindow) {
          externalWindow.close();
        }

        if (this.ticker) {
          clearInterval(this.ticker);
        }
        this.props.onAuthenticationComplete(result.authToken);
      }
    }, 2000);
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        Just keep swimming...
      </div>
    );
  }
}

export default PlexAuthentication;