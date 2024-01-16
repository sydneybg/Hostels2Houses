const express = require('express');
const bcrypt = require('bcryptjs');

const { query, check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');


const router = express.Router();

const validateQuery = [
    query('page')
        .isInt({ min: 1})
        .withMessage('Page must be greater than or equal to 1')
        .optional(),
    query('page')
        .isInt({ max: 10})
        .withMessage('Page must be less than or equal to 10')
        .optional(),
    query('size')
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1')
        .optional(),
        query('size')
        .isInt({ max: 20 })
        .withMessage('Size must be less than or equal to 20')
        .optional(),
    query('minLat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Minimum latitude is invalid')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxLat;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum latitude cannot be greater than maximum latitude')
            }
        })
        .optional(),
    query('maxLat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Maximum latitude is invalid')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minLat;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum latitude cannot be less than minimum latitude')
            }
        })
        .optional(),
    query('minLng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Minimum longitude is invalid')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxLng;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum longitude cannot be greater than maximum longitude')
            }
        })
        .optional(),
    query('maxLng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Maximum longitude is invalid')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minLng;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum longitude cannot be less than minimum longitude')
            }
        })
        .optional(),
    query('minPrice')
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxPrice;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum price cannot be greater than maximum price')
            }
        })
        .optional(),
    query('maxPrice')
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minPrice;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum price cannot be less than minimum price')
            }
        })
        .optional(),
    handleValidationErrors
];


//Get all spots
router.get(
    '/',
    validateQuery,
    async (req, res) => {

        let { page, size, maxLat, minLat, minLng, maxLng } = req.query
        let minPrice = req.query.minPrice
        let maxPrice = req.query.maxPrice
        page = parseInt(page) || 1;
        size = parseInt(size) || 20;

        let limit = size;
        let offset = size * (page - 1);

        const options = {
            include: [
                {model: Review},
                {model: SpotImage, where: {preview: true}, required: false}
            ],
            where: {},
            limit,
            offset
        };

        if(minLat){
            options.where.lat = {[Op.gte]: minLat}
        };

        if(maxLat){
            options.where.lat = {[Op.lte]: maxLat}
        };

        if(minLng){
            options.where.lng = {[Op.gte]: minLng}
        };

        if(maxLng){
            options.where.lng = {[Op.lte]: maxLng}
        };

        if(minPrice){
            options.where.price = {[Op.gte]: minPrice}
        };

        if(maxPrice){
            options.where.price = {[Op.lte]: maxPrice}
        };

        let spots = await Spot.findAll(options)

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
        const response = {Spots: spots, page, size}
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
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    check("lng")
      .notEmpty()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
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
      .isFloat({ min: 0 })
      .withMessage('Price must be greater than 0'),
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

          return res.status(201).json(spot.dataValues)
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
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({ message: "Spot could not be found" });
        }

        const reviews = await Review.findAll({
            attributes: ['id', 'spotId', ['authorId', 'userId'], 'stars', ['body', 'review'], 'createdAt', 'updatedAt'],
            where: { spotId },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName']},
            { model: ReviewImage, attributes: ['id', 'url']}
        ],
        order: [['createdAt', 'DESC']]});


    const reviewsResponse = {
        Reviews: reviews
    };
    return res.json(reviewsResponse)
    }
);

//Get all Bookings for a Spot based on the Spot's id

router.get(
    '/:spotId/bookings',
    requireAuth,
    async(req, res) => {
        const loggedInUserId = req.user.id;
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if (!spot){
            return res.status(404).json({message: "Spot could not be found"})
        }

        const ownerId = spot.dataValues.ownerId;

        let bookings
        if(loggedInUserId === ownerId) {
            bookings = await Booking.findAll({
                where: { spotId },
                include: {model: User, attributes: ['id', 'firstName', 'lastName']}})
        } else {
            bookings = await Booking.findAll({where: { spotId }, attributes: ['spotId', 'startDate', 'endDate']})
        }

        const bookingsResponse = bookings.map(booking => {
            booking.dataValues.userId = booking.dataValues.guestId;
            delete booking.dataValues.guestId;

            return booking;

          });

        return res.json({ Bookings: bookingsResponse})
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
        const userId = req.user.id

        const spot = await Spot.findByPk(spotId, {
            include: {
                model: Review,
                attributes: ['spotId', ['authorId', 'userId'], 'stars', ['body', 'review'], 'createdAt', 'updatedAt']
            }
        });


        if(!spot) {
            return res.status(404).json({ message: 'Spot could not be found'})
        }

        const hasRaview = spot.dataValues.Reviews.find(review => {
            return review.dataValues.userId === userId
        });

        if(hasRaview) {
                return res.status(500).json({message: "User already has a review for this spot"})
            };


        const newReview = await Review.create({
            authorId: userId,
            spotId,
            stars,
            body: review
        })

        newReview.dataValues.userId = newReview.dataValues.authorId;
        newReview.dataValues.review = newReview.dataValues.body;
        delete newReview.dataValues.authorId
        delete newReview.dataValues.body

        return res.status(201).json(newReview)
    }
);

const validateBooking = [
    check('startDate')
      .exists()
      .isAfter()
      .withMessage('Cannot create a booking in the past'),

    check('endDate')
      .exists()
      .isAfter()
      .withMessage('Cannot create a booking in the past')
      .custom((value, { req }) => {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);

        if (endDate <= startDate) {
          throw new Error("endDate cannot be on or before startDate");
        }

        return true;
      }),
    handleValidationErrors
  ];

//Create a booking from a spot based on the spots id

router.post(
    '/:spotId/bookings',
    requireAuth,
    validateBooking,
    async (req, res) => {
        const { spotId } = req.params;
        let { startDate, endDate } = req.body;
        const { id: userId } = req.user;

        const spot = await Spot.findByPk(spotId)
        if(!spot) {
            return res.status(404).json({ message: 'Spot could not be found'})
        };

        if (spot.ownerId === userId) {
            return res.status(403).json({
              message: 'Forbidden'
            });
          }

          const allBookings = await Booking.findAll({ where: { spotId}})

          const startDateCreate = new Date(startDate);
          const endDateCreate = new Date(endDate);

          startDate = new Date(startDate).getTime();
          endDate = new Date(endDate).getTime();

          let hasConflict = false;
          let errors = {};


          for (let booking of allBookings){
            console.log('In the for loop')
            let existingStartDate = new Date(booking.dataValues.startDate).getTime();
            let existingEndDate = new Date(booking.dataValues.endDate).getTime();

            console.log(typeof existingEndDate, 'Existing end date')
            console.log(typeof existingStartDate, 'existing start date')

            if (existingStartDate < startDate && startDate <= existingEndDate) {
                hasConflict = true;
                errors.startDate = "Start date conflicts with an existing booking"
            };

            if (existingEndDate > endDate && endDate >= existingStartDate ) {
                hasConflict = true;
                errors.endDate = "End date conflicts with an existing booking"
            };

            if(existingStartDate < startDate && existingEndDate > endDate) {
                hasConflict = true;
                errors.startDate = "Start date conflicts with an existing booking"
            };

            if (startDate < existingStartDate && existingEndDate < endDate) {
                hasConflict = true;
                errors.endDate = "End date conflicts with an existing booking"
            };

            if (startDate === existingStartDate) {
                hasConflict = true;
                errors.startDate = "Start date conflicts with an existing booking"
            };

            if (endDate === existingEndDate) {
                hasConflict = true;
                errors.endDate = "End date conflicts with an existing booking"
            }
          }

          if(hasConflict === true){
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                errors
              })
          };


        const newBooking = await Booking.create({
            startDate: startDateCreate.toISOString(),
            endDate: endDateCreate.toISOString(),
            guestId: userId,
            spotId
        })

        newBooking.dataValues.userId = newBooking.dataValues.guestId;
        delete newBooking.dataValues.guestId;


        return res.json(newBooking);
    }
);




module.exports = router;
