import { useEffect, useState } from "react"
import socket from "../socket";
export default function Meeting(){
    const [formData,setFormData] = useState("");
    const [meetingId,setMeetingId] = useState("");
    const [participants,setParticipants] = useState([]);
    const handleJoinMeeting = () =>{ 
        console.log("Join-meeting",{meetingId});
        socket.emit("join-meeting" ,{meetingId})
    };
    useEffect(()=>{
        const handleUserJoined = (data) => {
            console.log("Another user Joined : ",data);
        }
        const handleExistingParticipiants = (data) => {
        console.log("Existing Participants",data.participants);
        setParticipants(data.participants);
        }
        socket.on("user-joined",handleUserJoined);
        socket.on("existing-participants",handleExistingParticipiants);
        return () =>{
            socket.off("user-joined",handleUserJoined);
            socket.off("existing-participants",handleExistingParticipiants);
        };
    },[]);
    
    
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
        </div>
    )
}