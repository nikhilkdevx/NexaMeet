import { useEffect, useRef, useState } from "react"
import socket from "../socket";
export default function Meeting(){
    const [formData,setFormData] = useState("");
    const [meetingId,setMeetingId] = useState("");
    const [participants,setParticipants] = useState([]);
    const [camera,setCamera] = useState(null);
    const videoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    
    const handleJoinMeeting = () =>{ 
        console.log("Join-meeting",{meetingId});
        socket.emit("join-meeting" ,{meetingId})
    };
    const handleCamera = async () => {
        try{
        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        });
        console.log("Stream",stream);
        console.log("Video tracks :",stream.getVideoTracks());
            setCamera(stream);
            handleConnection(stream);
        } catch (err){
            console.error("Camera access failed : ",err);
        }
    }
    const peerConnection = () => {
        if(peerConnectionRef.current === null){
            peerConnectionRef.current = new RTCPeerConnection({});
        } 
        
        return peerConnectionRef.current;
        
    }
    const handleConnection = async (stream) => {
        peerConnection();
        const tracks = stream.getTracks();
        for(let i = 0;i<tracks.length;i++){
            peerConnectionRef.current.addTrack(tracks[i],stream);
        }
        const offer = peerConnectionRef.current.createOffer();
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
        console.log("Existing Participants",data.participants);
        setParticipants(data.participants);
        }
        const handleUserLeft = (data) => {
            setParticipants((currentParticipants)=>
            currentParticipants.filter((id) => id !== data.userId)
            );
        };
        const handleReceiveOffer = async (data) => {
            const offer = data.offer;
            peerConnection();
            await peerConnectionRef.current.setRemoteDescription(offer);
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit("send-answer",{meetingId,answer});
        }
        const handleReceiveAnswer = async(data) => {
            const answer = data.answer;
            peerConnection();
            await peerConnectionRef.current.setRemoteDescription(answer);
        }
        socket.on("user-joined",handleUserJoined);
        socket.on("existing-participants",handleExistingParticipiants);
        socket.on("user-left",handleUserLeft);
        socket.on("send-offer",handleReceiveOffer);
        socket.on("send-answer",handleReceiveAnswer);
        return () =>{
            socket.off("user-joined",handleUserJoined);
            socket.off("existing-participants",handleExistingParticipiants);
            socket.off("user-left",handleUserLeft);
            socket.off("send-offer",handleReceiveOffer);
            socket.off("send-answer",handleReceiveAnswer);
        };
    },[]);
    
    useEffect(()=>{
        if(videoRef.current && camera){
            videoRef.current.srcObject = camera;
        }
    },[camera]);
    
    return (
        <div>
            <h1>Meeting Room</h1>
            <input
            type="text"
            placeholder="Enter Meeting ID"
            value = {meetingId}
            onChange = {(e) => setMeetingId(e.target.value)}>
            </input>
            <button onClick= {handleJoinMeeting} >
                Join Meeting
            </button>
            
            <h2>Participants</h2>
            {participants.length === 0 ? (
                <p>No Existing Participants.</p>
            ) : (
            participants.map((id)=>(
                <p key={id}>{id}</p>
            ))
            )}
            <button onClick={handleCamera}>Start Camera</button>
            <video ref={videoRef}
            autoPlay 
            muted 
            playsInline />
        </div>
        
    )
}