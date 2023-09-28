const ChatRoom = require('../models/chatRoom');
const User = require('../models/user');
const Message = require('../models/message');

// Create a new chat room
exports.createChatRoom = async (req, res,next) => {
    try {
        const user = await User.findOne({email:req.user.email})
        
        const { name, userId } = req.body; // Include userId in the request body

        // Check if a chat room with the same name already exists
        const existingChatRoom = await ChatRoom.findOne({ name });
        if (existingChatRoom) {
            return res.status(400).json({ message: 'Chat room with the same name already exists.' });
        }

        // Create a new chat room
        const chatRoom = new ChatRoom({ name });
        
        // Add the creator (user who initiated the request) to the chat room's members
        chatRoom.members.push(userId);
        user.chatRooms.push(chatRoom._id)

        await chatRoom.save();
        await user.save()

        return res.status(201).json(chatRoom);
    } catch (error) {
        return  next(error)
    }
};

// Join a chat room
exports.joinChatRoom = async (req, res, next) => {
    const user = await User.findOne({email:req.user.email})
    try {
        const { userId } = req.body;
        const { chatRoomId } = req.params;

        // Check if the user and chat room exist
        const userExist = await User.findById(userId);
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!userExist || !chatRoom) {
            return res.status(404).json({ message: 'User or chat room not found.' });
        }

        // Check if the user is already a member of the chat room
        if (chatRoom.members.includes(user._id)) {
            return res.status(400).json({ message: 'User is already a member of this chat room.' });
        }

        // Add the user to the chat room's members
        chatRoom.members.push(user._id);
        await chatRoom.save();
        user.chatRooms.push(chatRoom._id);
        await user.save();

        return res.status(200).json(chatRoom);
    } catch (error) {
        return  next(error)
    }
};

exports.getAllChatRooms = async (req, res,next) => {
    try {
        const chatRooms = await ChatRoom.find();

        return res.status(200).json(chatRooms);
    } catch (error) {
        return  next(error)
    }
};

// Get all members of a chat room
exports.getChatRoomMembers = async (req, res,next) => {
    try {
        const { chatRoomId } = req.params;

        // Check if the chat room exists
        const chatRoom = await ChatRoom.findById(chatRoomId);
        console.log(chatRoom)
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found.' });
        }

        // Retrieve all user IDs who are members of the chat room
        const memberIds = chatRoom.members;

        // Find user documents based on the member IDs
        const members = await User.find({ _id: { $in: memberIds } });

        return res.status(200).json(members);
    } catch (error) {
       return  next(error)
    }
};

// Get all messages in a chat room by chat room members, arranged by date created
exports.getChatRoomMessages = async (req, res,next) => {
    try {
        const { chatRoomId } = req.params;

        // Check if the chat room exists
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found.' });
        }

        // Check if the user requesting the messages is a member of the chat room
        const userId = req.user.id;
        if (!chatRoom.members.includes(userId)) {
            return res.status(403).json({ message: 'You are not a member of this chat room.' });
        }

        // Retrieve all messages in the chat room, sorted by createdAt in ascending order
        const messages = await Message.find({ chatRoom: chatRoomId })
            .sort({ createdAt: 1 })
            .populate('sender', 'username');

        return res.status(200).json(messages);
    } catch (error) {
        return  next(error)
    }
};