const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - User Signup/Login
 *     summary: User Signup
 *     description: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "User's email address."
 *               password:
 *                 type: string
 *                 format: password
 *                 description: "User's password (minimum length: 5)."
 *               name:
 *                 type: string
 *                 description: "User's name."
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Invalid email, password, or missing name.
 *       409:
 *         description: Conflict. Email address already exists.
 */
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User Signup/Login
 *     summary: User Login
 *     description: Authenticate user and generate an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "User's email address."
 *               password:
 *                 type: string
 *                 description: "User's password."
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns an access token.
 *       400:
 *         description: Bad request. Invalid email or password.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags:
 *       - User Signup/Login
 *     summary: Get details of the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.
 */
// Route to get the details of the currently authenticated user
router.get('/users/me', isAuth, authController.getUserDetails);

module.exports = router;
