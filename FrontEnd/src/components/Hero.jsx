import "./Hero.css";
import PhoneMockup from "../assets/PhoneMockup.png";
export default function Hero(){
    return(
        <div className="Hero">
            <div className="HeroDetails">
                <h1><span style={{color: "yellowgreen"}}>Connect. </span> Meet. Collaborate.</h1>
                <p>
                    Simple and reliable video meetings for 
                    connecting with pepople anywhere.
                </p>
                <button>Get Started</button>
            </div>
            <div className="HeroImage">
                <img src={PhoneMockup} alt="NexaMeet Video Meeting" />
            </div>
        </div>
    )
}