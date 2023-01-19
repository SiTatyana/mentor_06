import {useState, useEffect} from "react";
import io from "socket.io-client";
import {nanoid} from "nanoid";
import axios from "axios";
const socket = {current:io("http://localhost:3001")};

export default function Chat(){
    const [currentUser, setCurrentUser] = useState(()=> ({name:"", id:nanoid()}));
    const[message, setMessage]=useState({});
    const[messages, setMessages]=useState([]);
    const [onlineUsers, setOnlineUsers] = useState(1);

    useEffect( () => {
        socket.current.on("change online", data => {
            setOnlineUsers(data);
        })

        socket.current.on("allMessages", data => {
            setMessages(data);
        })

    },[]);

    useEffect ( () => {
        socket.current.on("online message", data => {
            setMessages([data, ...messages]);
        })
    },[messages]);

    const handleClick = (e) => {
        e.preventDefault();
        socket.current.emit("addUser", currentUser);
    }

    const handleClickMessage = (e) => {
        e.preventDefault();
        socket.current.emit("send message", {author: currentUser.name, text: message.text});
        setMessages([{author: currentUser.name, text: message.text}, ...messages])
    }

    return (<>
    <p>{!!onlineUsers ? onlineUsers : 0}</p>
    <form>
        <label>
            Enter your name:
        </label>
        <input value={currentUser.name} onChange={e => {
            setCurrentUser({name:e.target.value, id:nanoid()})
        }}/>
        <button onClick={handleClick}>Submit</button>
    </form>

    <ul>
        {messages.map((item, index) => (<li key={index}>
            <span>{item.author}</span>:
            <span>{item.text}</span>
            </li>))}
    </ul>

    <form>
        <label>
            Enter your message:
        </label>
        <input value={message.text} onChange={e => 
            setMessage({text:e.target.value})
        }/>
        <button onClick={handleClickMessage}>Submit</button>
    </form>
    </>)
    
}