import "./Navbar.css"
export default function Navbar(){
    return(
        <div className="Navbar">
            <div className="NavbarHead">
                <h2>NexaMeet</h2>
            </div>
            <div className="Navbarbtns">
                <button>Sign Up</button>
                <button>Login</button>
                <button>Guest User</button>
            </div>
        </div>
    )
} 