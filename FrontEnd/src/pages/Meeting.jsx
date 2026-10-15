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
        socket.on("user-joined",handleUserJoined);
        socket.on("existing-participants",handleExistingParticipiants);
        socket.on("user-left",handleUserLeft);
        return () =>{
            socket.off("user-joined",handleUserJoined);
            socket.off("existing-participants",handleExistingParticipiants);
            socket.off("user-left",handleUserLeft);
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