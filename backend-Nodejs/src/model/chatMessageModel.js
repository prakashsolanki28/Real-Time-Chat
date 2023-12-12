const mongoose = require('mongoose');

// Define the Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Create the Chat Message Model
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
