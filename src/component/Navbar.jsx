import React, { useEffect, useState } from 'react';
import '../css/Navbar.css';
import companyLogo from '../assets/companyLogo.png';
import intel from '../assets/intelLogo.png';
import linkedin from '../assets/linLogo.png';
import tweet from '../assets/twtLogo.png';
import { setGlobalState, useGlobalState } from '../state';
import { Howl, Howler } from 'howler';
import audioPlayingIcon from '../assets/audioPlayingIcon.png';
import pauseIcon from '../assets/pauseIcon.png';
import playIcon from '../assets/playIcon.png';
import audioMutedIcon from '../assets/audioMutedIcon.png';
import audioPlayIcon from '../assets/playIcon.png';
import UcaudioPlayIcon from '../assets/Group 32 (1).png';
import audioPauseIcon from '../assets/pauseIcon.png';
import homeIcon from '../assets/Group 33.png';
import { useNavigate } from 'react-router-dom';


function Navbar() {

  let navigate = useNavigate();


  const [muted, setMuted] = useState(false);
  const [play, setPlay] = useState(false);
  const [ApplicationDB, setApplicationType] = useGlobalState("ApplicationDB");
  const [playAndPause, setPlayAndPause] = useGlobalState("playAndPause");
  const [isTourOpen, setIsTourOpen] = useGlobalState("IsTourOpen");

const playPause = () =>{
  
  if (playAndPause){
    setGlobalState("playAndPause", false);
    setPlay(false);
  }
  else  {
    setGlobalState("playAndPause", true);
    setPlay(true);

  }
}
useEffect(()=>{
if (isTourOpen) {
  document.getElementById('playPauseButton').style.pointerEvents = 'none';
}else{
  document.getElementById('playPauseButton').style.pointerEvents = 'auto';
}
},[isTourOpen])
  const muteUnmute = () => {
    if (muted){
      Howler.mute(false);
      setMuted(false);
    setGlobalState("IsMuted", false);

      try{
        var vid = document.getElementById("um-video");
        vid.muted = false;
      }catch(e){
        return;
      }
      document.getElementById("muteButton").src = audioPlayingIcon;
    }
    else  {
      Howler.mute(true);
      setMuted(true);
    setGlobalState("IsMuted", true);

      try{
        var vid = document.getElementById("um-video");
        vid.muted = true;
      }catch(e){
        return;
      }
      document.getElementById("muteButton").src = audioMutedIcon;
    }
  }
  
  const handleHome = () =>{
      Howler.stop();
    window.open("/", "_blank", "noreferrer");
    setGlobalState("MfToEdgeCity",false)

} 


  return (
    <div className='wrapper'>
        <div className='navbar'></div>
        <img className='company-logo' src={companyLogo}></img>
        {/* <div className='divider1'></div> */}
        {/* <img className='intel' src={intel}></img> */}
        {/* {ApplicationDB == "M" ?<img style={{left:'82.84%'}} id="homeButton" className='mute withclick' src={homeIcon} onClick={()=>handleHome()}></img>:''} */}
        {/* <img style={{left:'82.84%'}} id="homeButton" className='mute withclick' src={homeIcon} onClick={()=>handleHome()}></img> */}
         <img  style={{left:'91.15%'}} id="playPauseButton" className='mute withclick' src={!playAndPause ?  audioPlayIcon :  isTourOpen ? UcaudioPlayIcon : audioPauseIcon} onClick={playPause}></img>
        <img style={{left:"93.02%"}} id="muteButton" className='mute withclick' src={muted ?  audioMutedIcon : audioPlayingIcon} onClick={muteUnmute}></img>
        {/* <img id="playButton" className='playPause withclick' src={playIcon} onClick={playPauseMusic}></img> */}
    </div>
  );
}

export default Navbar;