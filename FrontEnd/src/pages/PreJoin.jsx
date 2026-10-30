import { useRef, useState, useEffect } from "react";
import PreJoinHeader from "../components/prejoin/PreJoinHeader";
import "./prejoin.css";
import {Mic,Video,Volume2,VolumeX,VideoOff,MicOff } from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function Prejoin(){
    const [meetingId,setMeetingId] = useState("");
    const [isCameraOn,setIscameraOn] = useState(true);
    const [isMicOn,setIsMicOn] = useState(true);
    const [isSpeakerOn,setIsSpeakerOn] = useState(true);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    const startCamera = async() => {
        try{
            streamRef.current = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
            });
            videoRef.current.srcObject = streamRef.current;
        } catch(err){
            console.log(err);
        }
       
    }
    useEffect(()=>{
        startCamera();
        return () => {
            if(streamRef.current){
                streamRef.current.getTracks().forEach((track)=>{
                    track.stop();
                })
            }
        }
    },[]);

    const toggleCamera = () => {
        const videoTrack = streamRef.current?.getVideoTracks()[0];
        if(videoTrack){
            videoTrack.enabled = !videoTrack.enabled;
            setIscameraOn(videoTrack.enabled);
        }
    }

    const toggleMic = () => {
        const audioTrack = streamRef.current?.getAudioTracks()[0];
        if(audioTrack){
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }

    const toggleSpeaker = () => {
        setIsSpeakerOn((prev) => !prev);
    };

    const handleJoinMeeting = (e) => {
        e.preventDefault();
        if(e == ""){
            alert("Please Enter a Meeting Id");
            return;
        }
        navigate(`/meeting/${meetingId.trim()}`);
    }

    return (
        <div className="prejoin-page">
        <PreJoinHeader/>

        <main className="prejoin-container">
            <section className="prejoin-video-section">
                <h2>Check your Camera and microphone</h2>
                <p>Your camera preview will appear here</p>
                <div className="video-preview">
                    <div className="video-placeholder">
                        <video ref={videoRef} autoPlay muted playsInline />
                    </div>
                </div>
                <div className="media-controls">
                    <button className="media-button" onClick = {toggleMic} title = {isMicOn? "Turn Mic Off" : "Turn Mic On"}>
                        {isMicOn ?<Mic size={21} /> : <MicOff size={21}/>}
                    </button>
                    <button className="media-button" onClick = {toggleCamera} title = {isCameraOn? "Turn camera off" : "Turn camera on"}>
                        {isCameraOn ? <Video size={21} /> : <VideoOff size={21} />} 
                    </button>
                    <button className="media-button" onClick = {toggleSpeaker} title = {isSpeakerOn ? "Mute Speaker" : "UnMute Speaker"}>
                        {isSpeakerOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
                    </button>
                </div>
            </section>
            <section className="prejoin-action-section">
                <h2>Ready to Join ?</h2>
                <p>Your meeting is ready. Join when you're comfortable.</p>
                <form onSubmit = {handleJoinMeeting}>
                    <input className="meeting-id-input" type="text" placeholder="Enter Meeting ID" value = {meetingId}
                        onChange = {(e) => setMeetingId(e.target.value)}>
                    </input>
                    <button type="submit" className="join-meeting-btn">Join Meeting</button>
                </form>
                <button type="button" className="go-back-btn" onClick={()=> navigate("/")}>Go Back</button>
            </section>
        </main>
        </div>
    );
}