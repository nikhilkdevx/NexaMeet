import "./Navbar.css";
import NexaLogo from "../assets/Nexa-logo.png";
export default function Navbar(){
    return(
        <div className="Navbar">
            <div className="NavImg">
                <img src={NexaLogo} alt="Nexa Meet Logo"></img>
                <h2>Nexa<span>Meet</span></h2>
            </div>
            <div className="NavTitle">
                
            </div>
            
            <div className="Navbarbtns">
                <button>Sign Up</button>
                <button>Login</button>
            </div>
        </div>
    )
} 