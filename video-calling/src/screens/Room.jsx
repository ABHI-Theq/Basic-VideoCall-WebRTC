import React,{useCallback, useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../services/peer.js'
function RoomPage() {
    const socket=useSocket()
    const [remoteSocketId,setRemoteSocketId]=useState(null)
    const [mystream,setMystream]=useState()
    const [remoteStream,setRemoteStream]=useState()
    const handleUserJoined=useCallback(({email,room,id})=>{
        console.log(`Email ${email} joined room ${room}`);
        setRemoteSocketId(id)
        
    })

    const handleCallUser=useCallback(async()=>{
        const mystream=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
        const offer=await peer.getOffer()
        socket.emit('user:call',{to:remoteSocketId,offer})
        setMystream(mystream)
    },[remoteSocketId,socket])

    const handleIncommingCall=useCallback(async({from,offer})=>{
        setRemoteSocketId(from)
        const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
        setMystream(stream)
        console.log("incomming call: ",from,offer);
        const ans=await peer.getAnswer(offer)
        socket.emit('call:accepted',{to:from,ans})
    },[socket])
    const sendStreams=useCallback(()=>{
        mystream.getTracks().forEach((track)=>{
            peer.peer.addTrack(track,mystream)
        })
    },[mystream])


    const handleCallAccepted=useCallback(async({from,ans})=>{
        await peer.setLocalDescription(ans)
        console.log(ans,"call accepted");
        // console.log(mystream);
        sendStreams()
    },[sendStreams])

    const handleNegoNeeded=useCallback(async()=>{
        const offer=await peer.getOffer()
        socket.emit('peer:nego:needed',{offer,to:remoteSocketId})
    })

    const handleNegoDoneAccept=useCallback(async({from,ans})=>{
     await peer.setLocalDescription(ans)

    })

    const handleNegoIncomming=useCallback(async({from,offer})=>{
        const ans=await peer.getAnswer(offer)
        socket.emit('peer:nego:done',{to:from,ans});
    },[socket])

    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded',handleNegoNeeded)
        return()=>{
            peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded)
        }
        
    })

    useEffect(()=>{
        peer.peer.addEventListener('track',async ev=>{
            setRemoteStream(ev.streams[0])
        })
    },[socket])

    useEffect(()=>{
        socket.on('user:joined',handleUserJoined)
        socket.on('incomming:call',handleIncommingCall)
        socket.on('call:accepted',handleCallAccepted);
        socket.on('peer:nego:needed:accept',handleNegoIncomming);
        socket.on('peer:nego:done:accept',handleNegoDoneAccept)
        return(()=>{
            socket.off('room:joined',handleUserJoined)
            socket.off('incomming:call',handleIncommingCall)
            socket.off('call:accepted',handleCallAccepted);
            socket.off('peer:nego:needed:accept',handleNegoIncomming);
            socket.off('peer:nego:done:accept',handleNegoDoneAccept)
           
        })
    },[
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoIncomming,
        handleNegoDoneAccept,
    ])



  return (
    <div>
        <h1>Room Page</h1>
        <h2>{remoteSocketId?"Connected":"No one is connected"}</h2>
        {mystream && <button
        className='bg-gray-200 p-2 border-2 border-black rounded mx-auto block'
         onClick={sendStreams}>SendStream</button>}
        {remoteSocketId && <button
        className='bg-gray-200 p-2 border-2 border-black rounded mx-auto block'
         onClick={handleCallUser}>Call</button>}
        {mystream && (
            <>
            <h1>My Stream</h1>
            <ReactPlayer 
                playing
                muted
                height={"200px"}
                width="300px"
                url={mystream}
            />
            </>
        )}
        {remoteStream && (
            <>
            <h1>Remote Stream</h1>
            <ReactPlayer 
                playing
                muted
                height={"200px"}
                width="300px"
                url={remoteStream}
            />
            </>
        )}
    </div>
  )
}

export default RoomPage