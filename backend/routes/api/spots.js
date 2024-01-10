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

            if(spot.SpotImage.preview === true ){
                spot.dataValues.previewImage = spot.SpotImage.url;
            }
            delete spot.dataValues.SpotImage
            return spot
        })
        return res.json(spots)
    }
)

const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .isNumeric()
      .withMessage('Latitude is not valid'),
    check('lng')
      .isNumeric()
      .withMessage('Longitude is not valid'),
    check('name')
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
      handleValidationErrors
  ];

router.post(
    '/',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        if(!validateSpot.isEmpty){
            return res.status(400).json({
                message: "Bad Request",
                errors
            })
        }

        const ownerId = req.user.dataValues.id;
        const spot = await Spot.create({ ownerId,
            address, city, state, country, lat, lng, name, description, price
        })


        return res.status(200).json(spot.dataValues)
    }
)

module.exports = router;







// router.get('/', async (req, res) => {

//     const spots = await Spot.findAll({
//       attributes: [
//         'id',
//         'ownerId',
//         'address',
//         'city',
//         'state',
//         'country',
//         'lat',
//         'lng',
//         'name',
//         'description',
//         'price',
//         'createdAt',
//         'updatedAt'
//       ],
//       include: [{
//         model: SpotImage,
//         attributes: ['url'],
//         where: {
//           preview: true
//         }
//       }],
//       raw: true,
//       nest: true
//     });

//     // Calculate average ratings
//     spots.forEach(spot => {
//       // implementation code
//     });

//     // Shape response
//     const formatted = {
//       "Spots": spots.map(spot => {
//         return {
//           ...spot,
//           "avgRating": spot.avgRating,
//           "previewImage": spot.SpotImages[0]?.url
//         };
//       })
//     };

//     res.json(formatted);

//   });
