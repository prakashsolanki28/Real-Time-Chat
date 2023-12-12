const ChatMessage = require('../model/chatMessageModel');
const ChatRoom = require('../model/ChatRoomModel');

exports.sendMessage = async (message) => {
    try {
        const { text, sender, recipient } = message;

        let chatRoom = await ChatRoom.findOne({
            members: { $all: [sender, recipient] },
        });

        if (!chatRoom) {
            chatRoom = new ChatRoom({ members: [sender, recipient] });
            await chatRoom.save();
        }

        const chatMessage = new ChatMessage({
            room_id: chatRoom._id,
            user_id: sender,
            content: text,
        });
        await chatMessage.save();
    }
    catch (error) {
        console.log(error);
    }
}

exports.getChatMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const chatRoom = await ChatRoom.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat room not found' });
        }

        const chatMessages = await ChatMessage.find({ room_id: chatRoom._id });
        res.status(200).json(chatMessages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getChatRooms = async (req, res) => {
    try {
        const { userId } = req.params;
        // const chatRooms = await ChatRoom.find({ members: userId }).populate('members');

        // const chatRoomsWithLastMessageTimestamps = await Promise.all(
        //     chatRooms.map(async (chatRoom) => {
        //         const lastMessage = await ChatMessage.findOne({ room_id: chatRoom._id }).sort({ timestamp: -1 }).exec();
        //         return {
        //             chatRoom,
        //             lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null,
        //         };
        //     })
        // );

        // chatRoomsWithLastMessageTimestamps.sort((a, b) => {
        //     if (!a.lastMessageTimestamp) return 1;
        //     if (!b.lastMessageTimestamp) return -1;
        //     return b.lastMessageTimestamp - a.lastMessageTimestamp;
        // });

        // const sortedChatRooms = chatRoomsWithLastMessageTimestamps.map((item) => item.chatRoom);
        // res.status(200).json(sortedChatRooms);

        // Find chat rooms where the user is a member
        const chatRooms = await ChatRoom.find({ members: userId }).populate('members');

        // Prepare an array to store chat rooms with their last messages
        const chatRoomsWithLastMessages = [];

        for (const chatRoom of chatRooms) {
            const lastMessage = await ChatMessage.findOne({ room_id: chatRoom._id })
                .sort({ timestamp: -1 }) // Sort by timestamp in descending order to get the latest message
                .populate('user_id'); // Populate the 'user' field within the message

            const chatRoomWithLastMessage = {
                ...chatRoom.toObject(),
                lastMessage,
            };

            chatRoomsWithLastMessages.push(chatRoomWithLastMessage);
        }

        chatRoomsWithLastMessages.sort((a, b) => {
            if (!a.lastMessage) return 1; // Sort rooms with no messages to the end
            if (!b.lastMessage) return -1; // Sort rooms with no messages to the end
            return b.lastMessage.timestamp - a.lastMessage.timestamp;
        });

        res.status(200).json(chatRoomsWithLastMessages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};