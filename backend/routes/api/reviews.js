const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, ReviewImage, Review, User, SpotImage } = require('../../db/models');


const router = express.Router();

//Get all reviews of current user
router.get(
    '/current',
    requireAuth,
    async (req,res) => {
        const { id: authorId } = req.user;

        let reviews = await Review.findAll({
            attributes: ['spotId', ['authorId', 'userId'], 'stars', ['body', 'review'], 'createdAt', 'updatedAt'],
            where: {
                authorId
            },
            include: [
                {model: User, attributes: ['id', 'firstName', 'lastName']},
                { model: Spot, attributes: { exclude: ['description', 'createdAt', 'updatedAt']}, include: {model: SpotImage}},
                { model: ReviewImage, attributes: ['id', 'url'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        reviews = reviews.map(review => {
            const spot = review.get('Spot').dataValues; //removes dataValues

            const spotImages = spot.SpotImages
            let previewImage = '';

            const foundSpotImage = spotImages.find(image => {
                return image.dataValues.preview
            })
            if(foundSpotImage){
                previewImage = foundSpotImage.dataValues.url
            }

            spot.previewImage = previewImage;
            delete spot.SpotImages

            return review
        })
        const reviewsResponse = {
            Reviews: reviews
          };

          return res.status(200).json(reviewsResponse);
        }
);

//Add an Image to a Review based on the Review's id

router.post(
    '/:reviewId/images',
    requireAuth,
    async (req, res) => {
        const { reviewId } = req.params;
        const { url } = req.body;

        const review = await Review.findByPk(reviewId);

        if(!review){
            return res.status(404).json({message: 'Review not found'})
        };

        if (review.authorId !== req.user.id) {
            return res.status(403).json({message: 'Forbidden'})
        };

        const numImages = await ReviewImage.count({
            where: { reviewId}
        });

        if(numImages >= 10) {
            return res.status(403).json({message: "Maximum number of images for this resource was reached"})
        };

        const newImage = await ReviewImage.create({
            reviewId,
            url
        })

        delete newImage.dataValues.createdAt;
        delete newImage.dataValues.updatedAt;

        return res.json(newImage)
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

// Edit a Review

router.put(
    '/:reviewId',
    requireAuth,
    validateReview,
    async (req, res) => {
        const { reviewId } = req.params;
        const { stars, review } = req.body;

        const currentReview = await Review.findByPk(reviewId);

        if (!currentReview) {
            return res.status(404).json({ message: "Review not found"})
        };

        if (currentReview.authorId !== req.user.id) {
            return res.status(403).json({message: "Forbidden"})
        };

        const newReview = await currentReview.update({
            stars,
            body: review
        });

        return res.json(newReview)
    }
);



module.exports = router;
