import { useEffect, useState } from "react"
import socket from "../socket";
export default function Meeting(){
    const [formData,setFormData] = useState("");
    const [meetingId,setMeetingId] = useState("");
    const handleJoinMeeting = () =>{ 
        console.log("Join-meeting",{meetingId});
        socket.emit("join-meeting" ,{meetingId})
    };
    useEffect(()=>{
        const handleUserJoined = (data) => {
            console.log("Another user Joined : ",data);
        }
        socket.on("user-joined",handleUserJoined);
        return () =>{
            socket.off("user-joined",handleUserJoined);
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
        </div>
    )
}