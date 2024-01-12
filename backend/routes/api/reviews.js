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

            console.log('\n\n\n')
            console.log(spot)
            return review
        })


        return res.status(200).json(reviews)

        const response = {
            Reviews: reviews.map(review => {
                const { User, Spot, ReviewImages } = review;

                return {
                    ...review.toJSON(),
                    User: {
                        id: User.id,
                        firstName: User.firstName,
                        lastName: User.lastName
                    },
                    Spot: {
                        id: Spot.id,
                        ownerId: Spot.ownerId,
                        address: Spot.address,
                        city: Spot.city,
                        state: Spot.state,
                        country: Spot.country,
                        lat: Spot.lat,
                        lng: Spot.lng,
                        name: Spot.name,
                        price: Spot.price,
                        // previewImage: SpotImage.preview
                    },
                    ReviewImages: ReviewImages.map( image => {
                        return {
                            id: image.id,
                            url: image.url
                        }
                    })
                }
            })
        }
        res.json(response)
    }
)

module.exports = router;
