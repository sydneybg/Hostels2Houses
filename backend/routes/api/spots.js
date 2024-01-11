const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review } = require('../../db/models');


const router = express.Router();

//Get all spots
router.get(
    '/',
    async (req, res) => {
        let spots = await Spot.findAll({include: [SpotImage, Review]})
        spots = spots.map(spot => {
            const reviews = spot.Reviews
            const numReviews = reviews.length
            let sum = 0
            reviews.forEach(review => {
                sum += review.stars
            });
            const avgRating = sum / numReviews
            spot.dataValues.avgRating = avgRating;
            delete spot.dataValues.Reviews

            if(spot.SpotImage) {
                if(spot.SpotImage.preview === true ){
                 spot.dataValues.previewImage = spot.SpotImage.url;
                }
            delete spot.dataValues.SpotImage
            }
            return spot
        })
        return res.json(spots)
    }
)

//Get all Spots owned by the Current User

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        let userId = req.user.id;
        let spots = await Spot.findAll({
            where: {
                ownerId: userId
            },
            include: [SpotImage, Review]
    })
        spots = spots.map(spot => {
            const reviews = spot.Reviews
            const numReviews = reviews.length
            let sum = 0
            reviews.forEach(review => {
                sum += review.stars
            });
            const avgRating = sum / numReviews
            spot.dataValues.avgRating = avgRating;
            delete spot.dataValues.Reviews

            if(spot.SpotImage) {
                if(spot.SpotImage.preview === true ){
                 spot.dataValues.previewImage = spot.SpotImage.url;
                }
            delete spot.dataValues.SpotImage
            }
            return spot
        })
    res.json(spots)
    }
)

// Get details of a Spot from an id

router.get(
    '/:spotId',
    async (req, res) => {
        const { spotId } = req.params
        const spot = await Spot.findByPk(spotId, {include: [SpotImage, ]})
        console.log(spot)

        const filteredSpotImages = spot.dataValues.SpotImages.map(spotImage => {
            console.log(spotImage)
            return {id: spotImage.id, url: spotImage.url, preview: spotImage.preview}
        })
        console.log(filteredSpotImages)

        spot.SpotImages = filteredSpotImages

        return res.status(200).json(spot)
    }
)

module.exports = router;
