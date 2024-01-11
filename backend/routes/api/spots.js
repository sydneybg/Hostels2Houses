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

//Edit a spot

router.put(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        await spot.update(req.body);
        return res.json(spot)
    }
)

//Ensure only the owner of the spot is authorized to edit

/*
1. Two Queries is bad right?
const currentUser = await User.findByPk(req.user.id);
const spot = await Spot.findByPk(spotId);

if (!currentUser.hasSpot(spot)) {
   // User doesn't own spot
}

2. prototype?
Spot.prototype.ownedBy = function (user) {
  return this.ownerId === user.id;
}

const spot = await Spot.findByPk(spotId);

if (!spot.ownedBy(req.user)) {
  // Not owner
}


*/


module.exports = router;
