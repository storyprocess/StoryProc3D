import React, { useEffect, useState } from 'react';
import '../css/Navbar.css';
import dell from '../assets/dellLogo.png';
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

  const handleTwitterClick = () => {
    const text = encodeURIComponent('Predefined text for the Twitter tweet');
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleLinkedInClick = () => {
    const encodedUrl = encodeURIComponent('http://dell-edge-test.s3-website.ap-south-1.amazonaws.com/');
    const encodedTitle = encodeURIComponent('Predefined heading for the LinkedIn post');
    const encodedSummary = encodeURIComponent('This is a summary of my article.');
  
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
  
    window.open(linkedInUrl, '_blank','width=600,height=400');

  };
  return (
    <div className='wrapper'>
        <div className='navbar'></div>
        <img className='dell' src={dell}></img>
        <div className='divider1'></div>
        <img className='intel' src={intel}></img>
        <img className='twt withclick' src={tweet} onClick={handleTwitterClick}></img>
        <img className='lin withclick' src={linkedin} onClick={handleLinkedInClick}></img>
        <div className='divider2'></div>
        {/* {ApplicationDB == "M" ?<img style={{left:'82.84%'}} id="homeButton" className='mute withclick' src={homeIcon} onClick={()=>handleHome()}></img>:''} */}
        <img style={{left:'82.84%'}} id="homeButton" className='mute withclick' src={homeIcon} onClick={()=>handleHome()}></img>
         <img  style={{left:'84.71%'}} id="playPauseButton" className='mute withclick' src={!playAndPause ?  audioPlayIcon :  isTourOpen ? UcaudioPlayIcon : audioPauseIcon} onClick={playPause}></img>
        <img id="muteButton" className='mute withclick' src={muted ?  audioMutedIcon : audioPlayingIcon} onClick={muteUnmute}></img>
        {/* <img id="playButton" className='playPause withclick' src={playIcon} onClick={playPauseMusic}></img> */}
    </div>
  );
}

export default Navbar;