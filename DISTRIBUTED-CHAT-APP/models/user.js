const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: {
    type: String,
    required: true
  },
  chatRooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
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

module.exports = mongoose.model('User', userSchema);
