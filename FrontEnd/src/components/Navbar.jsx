import "./Navbar.css";
import NexaLogo from "../assets/Nexa-logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();
    return(
        <div className="Navbar">
            <div className="NavImg">
                <img src={NexaLogo} alt="Nexa Meet Logo"></img>
                <h2>Nexa<span>Meet</span></h2>
            </div>
            <div className="NavTitle">
                
            </div>
            
            <div className="Navbarbtns">
                <button onClick = {()=> navigate("/auth")}>Sign Up</button>
                <button onClick = {()=> navigate("/auth")} >Login</button>
            </div>
        </div>
    )
} 