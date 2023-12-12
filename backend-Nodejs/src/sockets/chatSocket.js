const ChatMessage = require('../model/chatMessageModel');
const ChatRoom = require('../model/ChatRoomModel');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('message', async (data) => {
            // Create a new ChatMessage document and save it to MongoDB
            const chatMessage = new ChatMessage({
                room_id: data.roomId,
                user_id: data.userId,
                content: data.message,
            });

            try {
                await chatMessage.save();
                // Broadcast the message to all connected clients
                io.to(data.roomId).emit('message', data);
            } catch (error) {
                console.error('Error saving chat message:', error);
            }
        });

        // Handle room creation and joining
        socket.on('join-room', async (data) => {
            // Check if the room with the provided ID exists
            const existingRoom = await ChatRoom.findOne({ _id: data.roomId });

            if (!existingRoom) {
                // If the room doesn't exist, create a new one
                const chatRoom = new ChatRoom({
                    name: data.roomName,
                    members: [data.userId], // Add the user to the members list
                });

                try {
                    await chatRoom.save();
                } catch (error) {
                    console.error('Error creating chat room:', error);
                    return;
                }
            }

            // Join the room
            socket.join(data.roomId);
            // Notify the client that they've successfully joined the room
            socket.emit('room-joined', data.roomId);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};