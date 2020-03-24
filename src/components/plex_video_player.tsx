import React from 'react';
import videojs from 'video.js';

/*
EXAMPLE USAGE
const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [{
        src: 'playlist.m3u8',
        type: 'application/x-mpegURL'
    }]
}

return (
    <PlexVideoPlayer {...videoJsOptions} />
);
*/

interface Props {
  videoJsOptions: videojs.PlayerOptions;
}

export default class PlexVideoPlayer extends React.Component<Props> {
  private player?: videojs.Player;
  private videoNode?: HTMLVideoElement;

  constructor(props: Props) {
    super(props);
    this.player = undefined;
    this.videoNode = undefined;
  }

  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props.videoJsOptions).ready(function () {
      console.log('onPlayerReady', this);
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>
        <div data-vjs-player="true">
          <video ref={(node: HTMLVideoElement) => (this.videoNode = node)} className="video-js"/>
        </div>
      </div>
    );
  }
}
