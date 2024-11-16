import {Children, createContext,useContext, useMemo, useState} from 'react'
import {io} from 'socket.io-client';
const SocketContext=createContext()

export const useSocket=()=>{
    return useContext(SocketContext)
}

const SocketContextProvider=({children})=>{

    // const req=io('http://localhost:8000');
    const socket=useMemo(() => io("localhost:8000"), []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )

}

export default SocketContextProvider