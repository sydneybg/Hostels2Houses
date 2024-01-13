const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');


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

            spot.dataValues.previewImage = '';
            if(spot.dataValues.SpotImages) {
                const foundSpotImage = spot.dataValues.SpotImages.find(image => {
                    return image.preview
                })
                if(foundSpotImage){
                    spot.dataValues.previewImage = foundSpotImage.url
                }
            }

            delete spot.dataValues.SpotImages
            return spot
        })
        const response = {Spots: spots}
        return res.json(response)
    }
);

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

            spot.dataValues.previewImage = '';
            if(spot.dataValues.SpotImages) {
                const foundSpotImage = spot.dataValues.SpotImages.find(image => {
                    return image.preview
                })
                if(foundSpotImage ){
                 spot.dataValues.previewImage = foundSpotImage.url;
                }
            }
            delete spot.dataValues.SpotImages
            return spot
        })
        const response = {Spots: spots}
        return res.json(response)
    }
);

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

        if(!spot){
            return res.status(404).json({message: 'Spot not found'})
        }

        const reviews = spot.Reviews || [];
        let numReviews = 0;
        let avgStarRating = null;

        if(reviews.length > 0) {
            let sum = reviews.reduce((sum, review) => {
             return sum + review.stars
        }, 0);

        numReviews = reviews.length;
        avgStarRating = sum / numReviews;

    }
        spot.dataValues.avgStarRating = avgStarRating
        spot.dataValues.numReviews = numReviews;


        delete spot.dataValues.Reviews


        return res.status(200).json(spot)
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
            return res.status(403).json({message: "Forbidden"})
        };

        const spotImage = await SpotImage.create({spotId: spot.id, url, preview})

        return res.json({id: spotImage.id, url: spotImage.url, preview: spotImage.preview})

    }
);


//Edit a spot

router.put(
    '/:spotId',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        if (spot.ownerId !== req.user.id){
            return res.status(403).json({message: "Forbidden"})
        };

        await spot.update(req.body);
        return res.json(spot)
    }
);

//delete a spot
  router.delete(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const spot = await Spot.findByPk(req.params.spotId);

        if (!spot) {
            return res.status(404).json({message: "Spot couldn't be found"})
        }

        if(spot.ownerId !== req.user.id){
            return res.status(403).json({message: "Forbidden"})
        }

        await spot.destroy();
        await Booking.destroy({where: {spotId: req.params.spotId}});
        await Review.destroy({where: {spotId: req.params.spotId}});
        return res.json({message: "Sucessfully deleted"})
    }
  );



  //Get all Reviews by a Spot's id

router.get(
    '/:spotId/reviews',
    async (req, res) => {
        const { spotId } = req.params;
console.log(spotId)
        const reviews = await Review.findAll({
            where: { spotId },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName']},
            { model: ReviewImage, attributes: ['id', 'url']}
        ],
    order: [['createdAt', 'DESC']]});

    console.log(reviews, 'REVIEWSSS')
    if(!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "Spot could not be found" });
    }
    const reviewsResponse = {
        Reviews: reviews
    };
    return res.json(reviewsResponse)
    }
);

const validateReview = [
    check('review')
    .exists({ checkFalsy: true})
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// Create a Review for a Spot based on the Spot's id

router.post(
    '/:spotId/reviews',
    requireAuth,
    validateReview,
    async (req, res) => {
        const { spotId } = req.params;
        const { stars, review } = req.body;
        const authorId = req.user.id;

        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({ message: 'Spot could not be found'})
        }


        const newReview = await Review.create({
            stars,
            review,
            authorId,
            spotId
        })

        return res.status(201).json(newReview)
    }
)

module.exports = router;
