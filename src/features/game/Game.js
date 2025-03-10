import { useContext, useEffect, useRef, useState } from 'react';
import './Game.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../../context/socket';
import * as PIXI from 'pixi.js';
import Reel from '../../slot/Reel';
import SlotGame from '../../slot/SlotGame';
import initControls from '../../slot/initControls';
import gsap from 'gsap';
import VideoPlayer from './VideoPlayer';

const Game = () => {
  const elRef = useRef(null);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [videoLink, setVideoLink] = useState({
    url: "",
    id: -1
  });

  useEffect(() => {
    let game;

    axios.get(`../gamescripts/egyptian-treasures.js`).then((response) => {
      game = (new Function(`
        const gameId = arguments[0];
        const Game = arguments[1];
        const Reel = arguments[2];
        const initControls = arguments[3];
        const socket = arguments[4];
        const PIXI = arguments[5];
        const gsap = arguments[6];
        const goToLobby = arguments[7];

        ${response.data}
      `))("egyptian-treasures", SlotGame, Reel, initControls, socket, PIXI, gsap, () => { navigate('/'); });

      const userKey = localStorage.getItem("key");
      socket.emit("video", {
        key: userKey
      });

      socket.on("video", (state) => {
        setVideoLink(state.video);
      });

      const gameCanvas = elRef.current.querySelector('canvas');

      if (gameCanvas) {
        gameCanvas.remove();
      }

      elRef.current.prepend(game.renderer.view);
      console.log(game.renderer)
      function resizeGame() {
        const clientWidth = elRef.current.clientWidth;
        const clientHeight = elRef.current.clientHeight;
        console.log(clientWidth)
        game.renderer.resize(clientWidth > 1700 ? clientWidth - 650 : clientWidth, clientHeight > 1700 ? 960 : clientHeight);
      }
      
      window.addEventListener("resize", resizeGame);
      resizeGame();
    });
    return () => {
      game.destroy();
    };
  }, []);

  return (
    <div
      className="Game"
      ref={elRef}
      id="egyptian-treasures"
    >
      <VideoPlayer video={videoLink} />
    </div>
  );
}

export default Game;
