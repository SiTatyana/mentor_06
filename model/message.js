const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
text:String,
date:String,
author:String,
});

const Message = model("message", messageSchema);

module.exports = Message;

