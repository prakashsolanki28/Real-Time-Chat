const mongoose = require('mongoose');

// Define the Chat Room Schema
const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

// Create the Chat Room Model
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
