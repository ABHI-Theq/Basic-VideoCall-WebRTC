import React,{useCallback, useEffect, useState} from 'react'
import { useSocket } from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'

function Lobby() {
  const [email,setEmail]=useState("")
  const [room,setRoom]=useState("")
  const socket=useSocket()
  // console.log({socket});
  const navigate=useNavigate()
  
  const handleSubmit=useCallback((e)=>{
    e.preventDefault()
    // console.log({email,room});
    socket.emit('room:join',{email,room})

    
  },[socket,email,room])

  const handleJoinRoom=useCallback((data)=>{
    const {email,room}=data;
    console.log(email,room);
    navigate(`/room/${room}`)
  },[navigate])

  useEffect(()=>{
    socket.on('room:listen',handleJoinRoom)
    return(()=>{
      socket.off('room:listen')
    })
    
  },[socket,handleJoinRoom])
  return (
    <>
    <div className= 'w-full max-w-md mx-auto p-4 text-white flex flex-col gap-2 rounded-xl bg-gray-500 mt-10  font-normal text-4xl'>
      <h1 className='font-bold block mx-auto'>Lobby</h1>
      <form onSubmit={handleSubmit} action="" className='my-4 flex flex-col'>
        <label htmlFor="email">Email</label>
        <input className='text-blue-500 text-lg bg-white my-4 rounded' 
        type="email" 
        id="email"
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
          />
        <br/>
        <label htmlFor="room">Room number</label>
        <input className='text-blue-500 text-lg bg-white my-4 rounded'
         type="text"
          id="room"
          value={room}
          onChange={(e)=>{setRoom(e.target.value)}} 
           />
        <button type="submit" className='bg-black p-2 border-2 border-black rounded mx-auto block'>Join</button>
      </form>
    </div>
    </>
  )
}

export default Lobby