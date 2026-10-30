import { useState } from "react";
import "./AuthPanel.css";
export default function AuthData(){
    const [mode,setMode] = useState("signup");

    const [formData,setFormData] = useState({
        name : "",
        email : "",
        password : ""
    });

    const handleInputChange = (event) => {
        let fieldName = event.target.name;
        let newVal = event.target.value;
        setFormData((currData)=>{
            return {...currData,[fieldName] : newVal};
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(mode === "signup"){
            console.log("Register : ",formData);
        try{          
        const response = await fetch("http://localhost:9090/auth/register", {
                method: "POST",
                headers: {
                    "content-Type" : "application/json"
                },
                body: JSON.stringify(formData)
            });
        const data = await response.json();
        console.log(data);
        } catch (err){
            console.log(err);
        }
        } else {
            console.log("Login : ",formData);
            try{
            let response = await fetch("http://localhost:9090/auth/login",{
                method:"POST",
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify({email : formData.email,password : formData.password})
            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
                localStorage.setItem("token",data.token);
            }
        } catch (err){
            console.log(err);
        }
        }
        setFormData({
            name : "",
            email : "",
            password : ""
        });
    };

    return (
        <>
        <button onClick={() => setMode("signup")}>Sign Up</button>
        <button onClick={() => setMode("login")}>Log In</button>

            <form onSubmit={handleSubmit}>
                {mode === "signup" &&(<><label htmlFor="name">Name</label>
                <input name="name" id="name" type="text"
                value={formData.name} onChange={handleInputChange}
                placeholder="Enter Name"></input> <br></br> </>)}

                <label htmlFor="Email">Email</label>
                <input name="email" id="email" type="text"
                value={formData.email} onChange={handleInputChange}
                placeholder="Enter Email"></input>

                <br></br>
                <label htmlFor="password">Password</label>
                <input placeholder="Enter Password" value={formData.password} 
                type="password" id = "password" onChange={handleInputChange}
                name="password"></input>
                
                <br></br>
                <button>Submit</button>
                
            </form>
        </>
    )
}