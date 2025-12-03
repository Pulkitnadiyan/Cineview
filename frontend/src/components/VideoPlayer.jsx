import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoPlayer = (props) => {
  const videoNode = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    if (videoNode.current) {
      player.current = videojs(videoNode.current, {
        ...props,
        fluid: true,
        controls: true,
        preload: 'auto',
        html5: {
          hls: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
          },
        },
      });
    }
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [props.sources]);

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;