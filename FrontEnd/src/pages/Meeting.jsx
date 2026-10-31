import { useEffect, useRef, useState } from "react"
import socket from "../socket";
import "./Meeting.css";
import {useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, MonitorUp, MessageCircle, PhoneOff } from "lucide-react";
export default function Meeting(){
    const {meetingId} = useParams();
    const [participants,setParticipants] = useState([]);
    const [camera,setCamera] = useState(null);
    const videoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const peerVideoRef = useRef(null);
    const meetingIdRef = useRef("");
    const [message,setMessage] = useState([]);
    const [messageInput,setMessageInput] = useState("");
    useEffect(()=>{
        meetingIdRef.current = meetingId;
    },[meetingId]);

    const [isChatOpen,setIsChatOpen] = useState(false);
    const [isScreenSharing,setIsScreenSharing] = useState(false);

    useEffect(()=>{
        socket.emit("join-meeting" ,{meetingId});
    },[meetingId]);

    const handleCamera = async () => {
        try{
        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        });
            setCamera(stream);
            handleConnection(stream);
        } catch (err){
            console.error("Camera access failed : ",err);
        }
    }
    const peerConnection = () => {
        if(peerConnectionRef.current === null){
            peerConnectionRef.current = new RTCPeerConnection({});
            peerConnectionRef.current.oniceconnectionstatechange = () => {
            };
            peerConnectionRef.current.addEventListener("track",(e)=>{
                const remoteStream = e.streams[0];
                peerVideoRef.current.srcObject = remoteStream;
                
            });

        } 
        return peerConnectionRef.current;
        
    }
    const handleConnection = async (stream) => {
        peerConnection();
        const tracks = stream.getTracks();
        for(let i = 0;i<tracks.length;i++){
            peerConnectionRef.current.addTrack(tracks[i],stream);
        }
        
        const offer = await peerConnectionRef.current.createOffer();
        peerConnectionRef.current.addEventListener("icecandidate",(ev)=>{
            if(ev.candidate != null){
                let candidate = ev.candidate;
                socket.emit("icecandidate",{meetingId,candidate});  
            }
            
        });

        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("send-offer",{meetingId,offer});  
    }
    
    useEffect(()=>{
        const handleUserJoined = (data) => {
            setParticipants((currentParticipants)=>{
            if(currentParticipants.includes(data.userId)){
                return currentParticipants;
            }
            return [...currentParticipants,data.userId];
            });
        };
        const handleExistingParticipiants = (data) => {
        setParticipants(data.participants);
        }
        const handleUserLeft = (data) => {
            setParticipants((currentParticipants)=>
            currentParticipants.filter((id) => id !== data.userId)
            );
        };
        const handleReceiveOffer = async (data) => {
            const offer = data.offer;
            const peer = peerConnection();
            await peer.setRemoteDescription(offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("send-answer",{ 
                meetingId : meetingIdRef.current,
                answer
            });
        };
        const handleReceiveAnswer = async (data) => {
            const answer = data.answer;
            const peer = peerConnection();
            await peer.setRemoteDescription(answer);
            
        };
        const handleCandidate = async(data) => {
            const candidate = data.candidate;
            const peer = peerConnection();
            await peer.addIceCandidate(candidate);
        }
        const handleNewMessage = (message) => {
            setMessage((prev) => [...prev,message]);
        };

        socket.on("user-joined",handleUserJoined);
        socket.on("existing-participants",handleExistingParticipiants);
        socket.on("user-left",handleUserLeft);
        socket.on("send-offer",handleReceiveOffer);
        socket.on("send-answer",handleReceiveAnswer);
        socket.on("icecandidate",handleCandidate);
        socket.on("new-message",handleNewMessage);
        return () =>{
            socket.off("user-joined",handleUserJoined);
            socket.off("existing-participants",handleExistingParticipiants);
            socket.off("user-left",handleUserLeft);
            socket.off("send-offer",handleReceiveOffer);
            socket.off("send-answer",handleReceiveAnswer);
            socket.off("icecandidate",handleCandidate);
            socket.off("new-message",handleNewMessage);
        };
    },[]);
    
    useEffect(()=>{
        if(videoRef.current && camera){
            videoRef.current.srcObject = camera;
        }
    },[camera]);
    
    return (
    <div className="meeting-room">

        <main className="meeting-stage">

            {/* Remote participant's video */}
            <video
                ref={peerVideoRef}
                autoPlay
                playsInline
                className="remote-video"
            />

            {/* Your floating camera preview */}
            <div className="local-video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="local-video"
                />
            </div>

            <div className="meeting-controls">

                <button className="control-btn" title="Microphone">
                    <Mic size={22} />
                </button>

                <button className="control-btn" title="Camera">
                    <Video size={22} />
                </button>

                <button className="control-btn" title="Share Screen">
                    <MonitorUp size={22} />
                </button>

                <button
                    className="control-btn"
                    title="Chat"
                    onClick={() => setIsChatOpen(prev => !prev)}
                >
                    <MessageCircle size={22} />
                </button>

                <button className="control-btn leave-btn" title="Leave Meeting">
                    <PhoneOff size={22} />
                </button>

            </div>
            {isChatOpen && (
                <aside className="chat-panel">
                    <div className="chat-header">
                        <h2>Meeting Chat</h2>
                        <button onClick={() => setIsChatOpen(false)}>
                            ×
                        </button>
                    </div>

                    <div className="chat-messages">
                        <p className="chat-empty">No messages yet. Start the conversation!</p>
                    </div>

                    <form className="chat-input-form">
                        <input
                            type="text"
                            placeholder="Type a message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </aside>
            )}

        </main>

    </div>
    );
    
}