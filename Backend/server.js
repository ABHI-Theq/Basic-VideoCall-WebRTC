import {Server} from 'socket.io'

const io=new Server(8000,{
    cors:true
})

const emailTosocketIdMap=new Map();
const socketIdToemailMap=new Map();


io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);
    socket.on('room:join',data=>{
        const {email,room}=data;
        emailTosocketIdMap.set(email,socket.id); 
        socketIdToemailMap.set(socket.id,email);
        io.to(room).emit('user:joined',{...data,id:socket.id});
        socket.join(room);
        io.to(socket.id).emit('room:listen',data);
        // console.log(data);  
    })

 socket.on('user:call',({to,offer})=>{
    io.to(to).emit('incomming:call',{from:socket.id,offer})
 })

 socket.on('call:accepted',({to,ans})=>{
    io.to(to).emit('call:accepted',{from:socket.id,ans})    
 })
   
 socket.on('peer:nego:needed',({offer,to})=>{
    io.to(to).emit('peer:nego:needed:accept',{from:socket.id,offer});
 })

 socket.on('peer:nego:done',({to,ans})=>{
    io.to(to).emit('peer:nego:done:accept',{from:socket.id,ans})
 })
})