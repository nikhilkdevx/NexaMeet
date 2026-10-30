import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Authentication";
import PreJoin from "./pages/PreJoin";
import socket from "./socket";
import Meeting from "./pages/Meeting";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Home />}/>
        <Route path="/auth" element={<Auth/>} />
        <Route path="/meeting/:meetigId" element={<PreJoin />} />
        <Route path= "/meeting/:meetingId/live" element = {<Meeting/>} />
      </Routes>
    </BrowserRouter>
    
  );
};

