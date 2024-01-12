const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');


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
        const { spotId } = req.params;

        let spot = await Spot.findByPk(spotId, {
            include: [
            { model: SpotImage, attributes: ['id', 'url', 'preview']},
            { model: Review },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        spot = spot.toJSON();

        if(!spot){
            return res.status(404).json({message: 'Spot not found'})
        }


        const reviews = spot.Reviews || [];
        let numReviews = 0;
        let avgRating = null;

        if(reviews.length > 0) {
            let sum = reviews.reduce((sum, review) => {
             return sum + review.stars
        }, 0);

        numReviews = reviews.length;
        avgRating = sum / numReviews;

        spot.avgRating = avgRating
    }
        spot.numReviews = numReviews;


        delete spot.dataValues.Reviews


        return res.status(200).json(spot)
    }
)

module.exports = router;
