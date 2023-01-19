const Message = require("../model/message")

const allMessage = async() => {
    return Message.find()
}

const createMessage = async(message) => {
return Message.create(message)
}

module.exports = {
    allMessage,
    createMessage,
}