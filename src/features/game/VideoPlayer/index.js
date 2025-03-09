import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import clsx from 'clsx';
import LikeIcon from '../../../assets/img/like.svg';
import SaveIcon from '../../../assets/img/save.svg';
import ShareIcon from '../../../assets/img/share.svg';
import "./VideoPlayer.scss";

const VideoPlayer = ({
  video
}) => {

  const [isLiked, setIsLiked] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {

    if (video?.user_id) {
      video?.engagements.map((item) => {
        if (item.user == video.user_id) {
          if (item.action === "like") setIsLiked(true);
          else if (item.action === "favourite") setIsFavourite(true);
        }
      })
    }

  }, [video]);

  const updateEngagement = async (action) => {
    try {
      const api = `${process.env.REACT_APP_API_ENDPOINT}/video/${action}`;
      const userKey = localStorage.getItem("key");
      await axios.post(api, {
        videoId: video.id,
        userKey
      }).then(() => {
        if (action === "like") {
          setIsLiked(!isLiked);
        } else {
          setIsFavourite(!isFavourite);
        }
      });
    } catch (err) {

    }
  }

  return (
    <div className="video-container">
      <ReactPlayer
        key={video.url}
        playing
        url={video.url}
        controls
        playsinline
        className="player"
        height='100%'
        config={{ file: { forceHLS: true } }}
      />

      <div className="engagement-group">
        <button className={
          clsx(
            "btn-engagement",
            {
              "liked": isLiked
            }
          )
        } onClick={() => updateEngagement("like")}>
          <img src={LikeIcon} alt="" />
        </button>
        <button className={
          clsx(
            "btn-engagement",
            {
              "favourite": isFavourite
            }
          )
        } onClick={() => updateEngagement("favourite")}>
          <img src={SaveIcon} alt="" />
        </button>
        <button className="btn-engagement">
          <img src={ShareIcon} alt="" />
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer;