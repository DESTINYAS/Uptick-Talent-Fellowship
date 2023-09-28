const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
          ref: 'Message'
        }
      ]},
       {
    timestamps: true,
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);