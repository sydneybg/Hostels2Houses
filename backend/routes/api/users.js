const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//Validate Signup Request Body
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
      check('firstName')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('First Name is required.'),
      check('lastName')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Last Name is required.'),
    handleValidationErrors
  ];


// Sign up - require authentication false
router.post("/", validateSignup, async (req, res) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      email,
      username,
      hashedPassword,
      firstName,
      lastName,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    await setTokenCookie(res, safeUser);
    return res.json({
      user: safeUser,
    });

  } catch (err) {
    let errors;
    if (err.name === "SequelizeUniqueConstraintError") {
      errors = {};

      if(err.errors[0].path === 'email') {
      errors.email = "User with that email already exists";
      }

      if(err.errors[0].path === 'username') {
        errors.username = "User with that username already exists";
        }

    }
    if(errors){
      return res.status(500).json({
      message: "User already exists",
      errors
    });
  }
  err.stack = null
  next(err);
  }
});


module.exports = router;
