const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');


const router = express.Router();

// Get all of the Current User's Bookings

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { id: userId } = req.user;

        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                { model: Spot, attributes: { exclude: ['description', 'createdAt', 'updatedAt']}}
            ]
        });
        const bookingsResponse = { Bookings: bookings}
        res.json(bookingsResponse)
    }
);
