const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const {allMessage, createMessage } = require("./service/messageFunction") 

require("dotenv").config()

const app = express();

const http = require('http').Server(app)

const socket = require('socket.io')(http,{cors:{origin:'http://localhost:3000', credential:true}})

app.use(cors())

const {PORT, DB_HOST} = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(DB_HOST);

global.onlineUsers = new Map();
socket.on("connection", async (client) => {
    const res = await allMessage();
    client.emit('allMessages', res);
    console.log(res);
    client.on('addUser',async user => {
        onlineUsers.set(user.id, client.id);
        console.log("User connected");
        console.log(onlineUsers.size);
        client.broadcast.emit('change online', onlineUsers.size);
        
    })

    client.on("send message", async message => {
        const res = await createMessage(message);
        client.broadcast.emit('online message', res);
        console.log(res);
    })

    client.on("disconnect", id => {
        onlineUsers.delete(id);
        client.broadcast.emit('change online', onlineUsers.size); 
    })
})

http.listen(PORT,()=>{
    console.log("server is running");
})


