import React from "react";
import "./VideoBackground.css"; // Import the CSS file for styling
import videosrc from "../../images/black_-_13495 (720p).mp4";
const VideoBackground = ({ children }) => {
  return (
    <div className="video-background">
      <video autoPlay loop muted>
        <source src={videosrc} type="video/mp4" />
      </video>
      <div className="content">{children}</div>
    </div>
  );
};

export default VideoBackground;
