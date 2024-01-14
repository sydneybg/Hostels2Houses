const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');


const router = express.Router();

router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const { imageId } = req.params;

        const image = await SpotImage.findByPk(imageId);

        if(!image) {
            return res.status(404).json({message: 'Spot Image not found'})
        };

        const spot = await Spot.findByPk(image.spotId);

        if(spot.ownerId !== req.user.id) {
            return res.status(403).json({message: 'Forbidden'});
        };

        await image.destroy();

        return res.json({message: 'Successfully deleted'});
    }
);


module.exports = router;
