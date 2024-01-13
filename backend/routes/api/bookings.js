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
        const { id: guestId } = req.user;

        let bookings = await Booking.findAll({
            where: { guestId },
            include: [
                { model: Spot, attributes: { exclude: ['description', 'createdAt', 'updatedAt']}, include: {model: SpotImage}}
            ]
        });

        bookings = bookings.map(booking => {
            const spot = booking.get('Spot').dataValues;
            const spotImages = spot.SpotImages;
            let previewImage = '';

            const foundSpotImage = spotImages.find(image => {
                return image.dataValues.preview
            })

            if (foundSpotImage) {
                previewImage = foundSpotImage.dataValues.url
            };

            spot.previewImage = previewImage;
            delete spot.SpotImages

            return booking
        });

        const bookingsResponse = { Bookings: bookings}
        res.json(bookingsResponse)
    }
);


module.exports = router;
