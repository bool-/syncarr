import React, { ReactNode } from 'react';
import PlexAPI, { PlexOptions } from '../plex';

interface PlexLibraryState {

}

interface PlexLibraryProps {
  plexOptions: PlexOptions;
  onItemSelection(): any;
}

class PlexLibrary extends React.Component<PlexLibraryProps, PlexLibraryState> {

  async componentDidMount() {
    const client = new PlexAPI(this.props.plexOptions);
    const library =  await client.library(5, 'all');
    console.log(library);
  }

  render(): ReactNode {
    return <div/>;
  }
}

export default PlexLibrary;