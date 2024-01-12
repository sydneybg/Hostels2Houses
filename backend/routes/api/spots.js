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
);

const validateSpot = [
    check("address")
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Street address is required"),
    check("city")
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("City is required"),
    check("state")
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("State is required"),
    check("country")
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Country is required"),
    check("lat")
      .notEmpty()
      .isNumeric()
      .withMessage("Latitude is not valid"),
    check("lng")
      .notEmpty()
      .isNumeric()
      .withMessage("Longitude is not valid"),
    check("name")
      .notEmpty()
      .isLength({ max: 50 })
      .withMessage("Name must be less than 50 characters"),
    check("description")
      .notEmpty()
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check("price")
      .notEmpty()
      .isNumeric()
      .exists({ checkFalsy: true })
      .withMessage("Price per day is required"),
    handleValidationErrors,
  ];

  //Create a spot
  router.post(
      '/',
      requireAuth,
      validateSpot,
      async (req, res) => {
          const { address, city, state, country, lat, lng, name, description, price } = req.body;

          const ownerId = req.user.dataValues.id;
          const spot = await Spot.create({ ownerId,
              address, city, state, country, lat, lng, name, description, price
          })

          return res.status(200).json(spot.dataValues)
      }
  );

// Add an Image to a Spot based on the Spot's id

router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res) => {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        };

        if (spot.ownerId !== req.user.id){
            return res.status(403).json({message: "Must be owner of spot"})
        };

        const spotImage = await SpotImage.create({spotId: spot.id, url, preview})

        return res.json({id: spotImage.id, url: spotImage.url, preview: spotImage.preview})

    }
)


module.exports = router;
