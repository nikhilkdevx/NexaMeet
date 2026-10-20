const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const initSocket = (server) => {
    const io = new Server(server,{
        cors : {
            origin : "http://localhost:5173"
        }
    });

    io.use((socket,next)=>{
        try{
            const token = socket.handshake.auth.token;
            const decoded = jwt.verify(token,process.env.JWT_SECERT);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error("Authentication Failed"));
        }
        
    });

    io.on("connection",(socket) => {
        console.log("Socket Connected : ",socket.id);

        socket.on("join-meeting",async ({meetingId}) => {

            console.log("Meeting ID Recieved",meetingId);
            await socket.join(meetingId);
            const sockets = await io.in(meetingId).fetchSockets();
            const participants = sockets
            .filter((s)=> s.id !== socket.id)
            .map((s)=>s.user.userId);
            socket.emit("existing-participants",{participants});
            socket.meetingId = meetingId;
            socket.to(meetingId).emit("user-joined",{userId:socket.user.userId});
        });

        socket.on("disconnect",()=> {
            console.log("Socket disconnected : ",socket.id);
            const meetingId = socket.meetingId;
            if(!meetingId){
                return;
            }
            const userId = socket.user.userId;
            socket.to(meetingId).emit("user-left",{
                userId
            });
        });

        socket.on("leave-meeting",()=>{
            console.log("User left Current Meeting",socket.id);
            const meetingId = socket.meetingId;
            const userId = socket.user.userId;
            socket.leave(meetingId);
            socket.to(meetingId).emit("user-left",{
                userId
            });
            delete socket.meetingId;

        });

        socket.on("send-offer",({meetingId,offer}) => {
            socket.to(meetingId).emit("send-offer",{offer});
        });

        socket.on("send-answer",({meetingId,answer}) => {
            console.log("Received answer:", answer);
            console.log("Answer type:", answer?.type);
            console.log("Answer SDP:", answer?.sdp);
            socket.to(meetingId).emit("send-answer",{answer});
        });

    });

    return io;
};

module.exports = initSocket;