const express = require('express');
const router = express.Router();
const chatController = require('../controllers/message');
const isAuth = require('../middleware/is_auth');


/**
 * @swagger
 * /chatrooms/send-message/{chatRoomId}:
 *   post:
 *     tags:
 *       - Chatroom
 *     summary: Send a message in a chat room.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatRoomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat room ID where the message will be sent.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user sending the message.
 *               content:
 *                 type: string
 *                 description: Content of the message.
 *             required:
 *               - userId
 *               - content
 *     responses:
 *       '201':
 *         description: Message sent successfully.
 *       '400':
 *         description: Bad request. User is not a member of the chat room.
 *       '404':
 *         description: Chat room not found.
 *       '500':
 *         description: Internal server error.
 */
// Send a message in a chat room
router.post('/chatrooms/send-message/:chatRoomId',isAuth, chatController.sendMessage);

module.exports = router;
