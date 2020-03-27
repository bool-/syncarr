import React, { SyntheticEvent } from 'react';
import { PlexOptions, Resource } from '../plex';
import * as plex from '../plex';

interface PlexServerSelectionProps {
  plexOptions: PlexOptions;
  onServerSelection(resource: Resource): any;
}

interface PlexServerSelectionState {
  servers: Resource[];
}

class PlexServerSelection extends React.Component<PlexServerSelectionProps, PlexServerSelectionState> {
  constructor(props: PlexServerSelectionProps) {
    super(props);
    this.state = {
      servers: [],
    };
  }

  async componentDidMount() {
    const client = plex.client(this.props.plexOptions);
    const resources: Resource[] = await plex.resources(client);
    resources.forEach((resource) => {
        console.log(resource);
        // filter out anything that doesn't include player or client
        if (resource.provides.includes('server')) {
          this.setState(state => {
            const list = [...state.servers, resource];
            return {
              servers: list
            };
          });
        }
      },
    );
  }

  render() {
    return (
      <div>
        <ul>
          {
            // TODO make this a pretty view
            this.state.servers.map((resource) => (
              <li key={resource.clientIdentifier} onClick={() => this.props.onServerSelection(resource)}>{resource.name}</li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default PlexServerSelection;