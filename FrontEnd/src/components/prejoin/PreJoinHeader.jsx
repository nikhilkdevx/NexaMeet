import NexaLogo from "../../assets/Nexa-logo.png";
import "./PreJoinHeader.css";
export default function PreJoinHeader() {
  return (
    <header className = "prejoin-header">
        <div className = "prejoin-brand">
        <img src={NexaLogo} alt="NexaMeet Logo" />
        <h2>Nexa<span>Meet</span></h2>
        </div>
    </header>
  );
}
