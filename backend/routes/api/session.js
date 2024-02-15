const express = require('express');

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//Validates Login Request Body
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];


// Log in - require authentication false
router.post(
    '/',
    // validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
      console.log(credential)
      console.log(password)
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if(!credential || !password) {
        return res.status(400).json({
          message: 'Bad Request',
          errors: {
            credential: 'Email or username is required',
            password: 'Password is required'
          }
        })
      }

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        return res.status(401).json({
          message: 'Invalid credentials',
        })
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

// Restore session user

router.get('/', (req, res) => {
    const { user } = req;
    // console.log(user)
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  });



  module.exports = router;
