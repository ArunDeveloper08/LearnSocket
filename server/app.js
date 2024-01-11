import express from "express" ;
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";
import jwt from "jsonwebtoken"


const Port = 5000;
const secretKeyJWT = "bajsdfhjflidfa"
const app = express();
app.use(cors());


const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:"true",
    }
});


  io.use((socket,next)=>{

  })


io.on("connection",(socket)=>{
  
  console.log("user connected ->",socket.id);

  socket.on("message",({message , room})=>{
    console.log({message , room})
    io.to(room).emit("receive-message",message)
  })
 
  socket.on("disconnect",()=>{
    console.log(`User disconnected ${socket.id}`);
  })
socket.on("join-room",(room)=>{
  socket.join(room)
})

})

  app.get("/",(req,res)=>{
   res.send("Hello World");

  })
  app.get("/login",(req,res)=>{
  const token= jwt.sign({_id:"ruqwthigrkrfgtrwe"},secretKeyJWT)
  res.cookie("token",token ,{httpOnly:true , secure:true , sameSite:"none"})
  .json({ msg:" Login Succesfully"})

  })

  server.listen(Port,()=>{
    console.log(`sever is running on port ${Port}`)
})