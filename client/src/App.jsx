import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Swal from 'sweetalert2'

const App = () => {
  const socket = useMemo(() => io("http://localhost:5000"), []);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId , setSocketId] = useState("")
  useEffect(() => {
    socket.on("connect", () => {
      Swal.fire("connected",socket.id)
      setSocketId(socket.id)
    });

  socket.on("receive-message",(data)=>{
    console.log(data)
    setMessages((messages)=>[...messages,data])
  })

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("message", {message , room});
    setMessage("");
  };

  const joinRoomHandler=(e)=>{
    e.preventDefault()
   socket.emit("join-room",roomName)
   setRoomName("")
  }

  return (
    <Container>
      <Typography variant="h3" component="div">
        Welcome to socket io
      </Typography>
      <Typography variant="h6" component="div">
       {socketId}
      </Typography>

   <form onSubmit={joinRoomHandler}>
    <h5>Join the room</h5>
    <TextField id="outlined-basic" label="Enter Room Name" variant="outlined"
    value={roomName}
    onChange={(e)=>setRoomName(e.target.value)}
    />
    <Button variant="contained" color="primary" type="submit">Join</Button>
   </form>

      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          send
        </Button>
      </form>
      <Stack>
        {
          messages?.map((m,i)=>(
            <Typography key={i}>{m}</Typography>
          ))
        }
      </Stack>
    </Container>
  );
};

export default App;
