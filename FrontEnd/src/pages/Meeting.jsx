import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Meeting.css";
import {useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorDown, MessageCircle, PhoneOff } from "lucide-react";

export default function Meeting(){
    const {meetingId} = useParams();
    const [participants,setParticipants] = useState([]);
    const [camera,setCamera] = useState(null);
    const videoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const peerVideoRef = useRef(null);
    const meetingIdRef = useRef("");
    const [messages,setMessages] = useState([]);
    const [messageInput,setMessageInput] = useState("");
    
    useEffect(()=>{
        meetingIdRef.current = meetingId;
    },[meetingId]);
    const currentUserId = localStorage.getItem("userId");
    const [isMicOn,setIsMicOn] = useState(true);
    const [isCameraOn,setIscameraOn] = useState(true);
    const [isChatOpen,setIsChatOpen] = useState(false);
    const [isScreenSharing,setIsScreenSharing] = useState(false);
    const cameraStreamRef = useRef(null);
    const displayMediaRef = useRef(null);
    const navigate = useNavigate();
    useEffect(()=>{
        handleCamera();
    },[]);

    const handleCamera = async () => {
        try{
        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        });
            cameraStreamRef.current = stream;
            setCamera(stream);
            socket.emit("join-meeting",{meetingId});
        } catch (err){
            console.error("Camera access failed : ",err);
        }
    }
    
    const peerConnection = () => {
        if(peerConnectionRef.current === null){
            peerConnectionRef.current = new RTCPeerConnection({});
            peerConnectionRef.current.addEventListener("icecandidate",(ev)=>{
            if(ev.candidate != null){
                let candidate = ev.candidate;
                socket.emit("icecandidate",{
                    meetingId : meetingIdRef.current,
                    candidate : ev.candidate
                });  
            }
        });
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
        console.log("CREATING OFFER");
        peerConnection();
        const tracks = stream.getTracks();
        for(let i = 0;i<tracks.length;i++){
            peerConnectionRef.current.addTrack(tracks[i],stream);
        }
        
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("send-offer",{meetingId,offer});  
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if(!messageInput.trim()){
            return;
        }
        socket.emit("send-message",{
            meetingId,
            content: messageInput.trim()
        });
        setMessageInput("");
    }

    const handleScreenShare = async () => {
    let screenStream;

    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        const senders = peerConnectionRef.current.getSenders();

        const videoSender = senders.find(
            (sender) => sender.track?.kind === "video"
        );

        if (!videoSender) {
            screenStream.getTracks().forEach(track => track.stop());
            return;
        }

        displayMediaRef.current = screenTrack;

        await videoSender.replaceTrack(screenTrack);
        setIsScreenSharing(true);

        screenTrack.onended = async () => {
            const cameraTrack = cameraStreamRef.current.getVideoTracks()[0];

            await videoSender.replaceTrack(cameraTrack);

            screenStream.getTracks().forEach(track => track.stop());

            displayMediaRef.current = null;
            setIsScreenSharing(false);
        };

    } catch (err) {
        console.error("Screen sharing failed:", err);
    }
    };

    const toggleMic = () => {
        const audioTrack = cameraStreamRef.current?.getAudioTracks()[0];
        if(audioTrack){
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }

    const toggleCamera = () => {
        const videoTrack = cameraStreamRef.current?.getVideoTracks()[0];
        if(videoTrack){
            videoTrack.enabled = !videoTrack.enabled;
            setIscameraOn(videoTrack.enabled);
        }
    }

    const handleLeaveMeeting = () => {
        cameraStreamRef.current?.getTracks().forEach(track => track.stop());
        displayMediaRef.current?.stop();
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        socket.emit("leave-meeting", { meetingId });
        navigate("/");
    }
    
    useEffect(()=>{
        const handleUserJoined = async(data) => {
            console.log("USER JOINED:", data.userId);
            setParticipants((currentParticipants)=>{
            if(currentParticipants.includes(data.userId)){
                return currentParticipants;
            }
            return [...currentParticipants,data.userId];
            });
            const stream = cameraStreamRef.current;
            if(!stream || peerConnectionRef.current) return;
            await handleConnection(stream);
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
            console.log("OFFER RECEIVED");
            const offer = data.offer;
            const peer = peerConnection();
            const stream = cameraStreamRef.current;
            if (stream) {
                stream.getTracks().forEach((track) => {
                    peer.addTrack(track, stream);
                });
            }
            await peer.setRemoteDescription(offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("send-answer",{ 
                meetingId : meetingIdRef.current,
                answer
            });
        };
        const handleReceiveAnswer = async (data) => {
            console.log("ANSWER RECEIVED");
            const answer = data.answer;
            const peer = peerConnection();
            await peer.setRemoteDescription(answer);
            
        };
        const handleCandidate = async(data) => {
            console.log("ICE CANDIDATE RECEIVED");
            const candidate = data.candidate;
            const peer = peerConnection();
            await peer.addIceCandidate(candidate);
        }
        const handleNewMessage = (message) => {
            setMessages((prev) => [...prev,message]);
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

                <button className="control-btn" onClick = {toggleMic} title = {isMicOn? "Turn Mic Off" : "Turn Mic On"}>
                    {isMicOn ?<Mic size={22} /> : <MicOff size={22}/>}
                </button>

                <button className="control-btn" onClick={toggleCamera} title= {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}>
                    {isCameraOn ? <Video size={22} /> : <VideoOff size={22} />}    
                </button>

                <button
                    className={`control-btn ${isScreenSharing ? "active" : ""}`}
                    onClick={handleScreenShare}
                    title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                >
                    {isScreenSharing
                        ? <MonitorDown size={22} />
                        : <MonitorUp size={22} />
                    }
                </button>
                
                <button
                    className="control-btn"
                    title="Chat"
                    onClick={() => setIsChatOpen(prev => !prev)}
                >
                    <MessageCircle size={22} />
                </button>

                <button className="control-btn leave-btn" title="Leave Meeting" onClick = {handleLeaveMeeting}>
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
                        {messages.length === 0 ? (
                            <p className="chat-empty">No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map((message) => {
                                const isMyMessage = message.sender._id === currentUserId;
                                return (
                                    <div
                                        key={message._id}
                                        className={`chat-message ${isMyMessage ? "my-message" : "other-message"}`}
                                    >
                                        <span className="message-sender">
                                            {isMyMessage ? "You" : message.sender.name}
                                        </span>

                                        <p>{message.content}</p>
                                    </div>
                                );
                            })
                        )}
                        
                    </div>

                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e)=>setMessageInput(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </aside>
            )}

        </main>

    </div>
    );
    
}