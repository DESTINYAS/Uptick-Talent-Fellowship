const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatRoom');
const isAuth = require('../middleware/is_auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRoom:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the chat room.
 *         name:
 *           type: string
 *           description: The name of the chat room.
 *         createdBy:
 *           type: string
 *           description: The user ID of the chat room creator.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the chat room was created.
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs representing chat room members.
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: An array of messages in the chat room.
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the message.
 *         userId:
 *           type: string
 *           description: The user ID of the message sender.
 *         content:
 *           type: string
 *           description: The content of the message.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the message was created.
 */



/**
 * @swagger
 * /chatrooms:
 *   post:
 *     tags:
 *       - Chatroom
 *     summary: Create a new chat room.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the chat room.
 *               userId:
 *                 type: string
 *                 description: ID of the user creating the chat room.
 *             required:
 *               - name
 *               - userId
 *     responses:
 *       '201':
 *         description: Chat room created successfully.
 *       '400':
 *         description: Chat room with the same name already exists.
 *       '500':
 *         description: Internal server error.
 */
// Create a new chat room
router.post('/chatrooms',isAuth, chatController.createChatRoom);


/**
 * @swagger
 * /chatrooms/join/{chatRoomId}:
 *   post:
 *     tags:
 *       - Chatroom
 *     summary: Join a chat room.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID.
 *               chatRoomId:
 *                 type: string
 *                 description: Chat room ID.
 *             required:
 *               - userId
 *               - chatRoomId
 *     responses:
 *       '200':
 *         description: Successful response with the chatRoomId.
 *       '400':
 *         description: Bad request. User is already a member.
 *       '404':
 *         description: User or chat room not found.
 *       '500':
 *         description: Internal server error.
 */
// Join a chat room
router.post('/chatrooms/join/:chatRoomId',isAuth, chatController.joinChatRoom);


/**
 * @swagger
 * /chatrooms/messages/{chatRoomId}:
 *   get:
 *     tags:
 *       - Chatroom
 *     summary: Get all messages in a chat room by chat room members, arranged by date created.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatRoomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat room ID.
 *     responses:
 *       '200':
 *         description: Successful response with a list of messages.
 *       '403':
 *         description: Forbidden. User is not a member of the chat room.
 *       '404':
 *         description: Chat room not found.
 *       '500':
 *         description: Internal server error.
 */
// Get all messages in a chat room by chat room members, arranged by date created
router.get('/chatrooms/messages/:chatRoomId',isAuth, chatController.getChatRoomMessages);

/**
 * @swagger
 * /chatrooms:
 *   get:
 *     tags:
 *       - Chatroom
 *     summary: Get a list of available chat rooms.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with a list of chat rooms.
 *       '500':
 *         description: Internal server error.
 */
router.get('/chatrooms',isAuth, chatController.getAllChatRooms);

/**
 * @swagger
 * /chatrooms/members/{chatRoomId}:
 *   get:
 *     tags:
 *       - Chatroom
 *     summary: Get all members of a chat room.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatRoomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat room ID.
 *     responses:
 *       '200':
 *         description: Successful response with a list of chat room members.
 *       '403':
 *         description: Forbidden. User is not a member of the chat room.
 *       '404':
 *         description: Chat room not found.
 *       '500':
 *         description: Internal server error.
 */
// Get all members of a chat room
router.get('/chatrooms/members/:chatRoomId',isAuth, chatController.getChatRoomMembers);



module.exports = router;