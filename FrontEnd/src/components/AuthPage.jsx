import AuthPanel from "./AuthPanel";
import "./AuthPage.css";
export default function auth(){
    return(
        <div className="auth">
            <div className="left">
                <h2>NexaMeet</h2>
            </div>
            <div className="right">
                <AuthPanel/>
            </div>
        </div>
    )
}