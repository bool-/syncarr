import React from 'react';
import { PlexOptions, Resource } from '../plex';
import * as plex from '../plex'

interface PlexDeviceSelectionProps {
  plexOptions: PlexOptions;
  onDeviceSelection(resource: Resource): any;
}

export class PlexDeviceSelection extends React.Component<PlexDeviceSelectionProps> {

  async componentDidMount() {
    const client = plex.client(this.props.plexOptions);
    const resources: Resource[] = await plex.resources(client);
    console.log(resources);
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        Just keep swimming...
      </div>
    )
  }
}