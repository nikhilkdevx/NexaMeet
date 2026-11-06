import AuthPanel from "./AuthPanel";
import "./AuthPage.css";
export default function auth(){
    return(
        <div className="auth">
            <div className="right">
                <AuthPanel/>
            </div>
        </div>
    )
}