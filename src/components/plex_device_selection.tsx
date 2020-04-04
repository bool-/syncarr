import React from 'react';
import PlexAPI, { PlexOptions, Resource } from '../plex';

interface PlexDeviceSelectionProps {
  plexOptions: PlexOptions;
  onDeviceSelection(resource: Resource): any;
}

interface PlexDeviceSelectionState {
  devices: Resource[];
}

class PlexDeviceSelection extends React.Component<PlexDeviceSelectionProps, PlexDeviceSelectionState> {
  constructor(props: PlexDeviceSelectionProps) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  async componentDidMount() {
    const client = new PlexAPI(this.props.plexOptions);
    const resources: Resource[] = await client.resources();
    resources.forEach((resource) => {
        console.log(resource);
        // filter out anything that doesn't include player or client
        if (resource.provides.includes('client') || resource.provides.includes('player')) {
          this.setState(state => {
            const list = [...state.devices, resource];
            return {
              devices: list
            };
          });
        }
      },
    );
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <ul>
          {
            // TODO make this a selection box and store the result in localStorage with a call to onDeviceSelection
            this.state.devices.map((resource) => (
              <li key={resource.clientIdentifier}>{resource.name}</li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default PlexDeviceSelection;