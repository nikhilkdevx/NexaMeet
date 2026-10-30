const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const initSocket = require("./Controllers/socketManager");
initSocket(server);
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
const { StatusCodes } = require("http-status-codes");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/zoom")
.then(()=>{
    console.log("MONGODB CONNECTED");
})
.catch((err)=>{
    console.log("MONGODB CONNECTION ERROR: ",err);
})
 
app.use(express.json({limit : "100kb"}));
app.use(express.urlencoded({extended:true,limit : "100kb"}));

//CORS 
app.use(cors({
    origin : "http://localhost:5173"
}));

const PORT = 9090;
server.listen(PORT,()=>{
    console.log(`APP IS LISTENING TO ${PORT}`);
});

app.get("/",(req,res)=>{
    res.status(StatusCodes.OK).json({message : "Currently on Home Tab"
    });
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth",authRoutes);


// ERROR HANDLING LOGIC
app.use((err,req,res,next)=>{
    const {statusCode = 500 , message = "Internal Server Error"} = err;
    res.status(statusCode).json({
        message
    });
});