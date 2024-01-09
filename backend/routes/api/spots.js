const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review } = require('../../db/models');

// const spotimage = require('../../db/models/spotimage');

const router = express.Router();

router.get(
    '/',
    async (req, res) => {
        const spots = await Spot.findAll({include: [SpotImage , Review]})

        //tell sql to also go into spotimage and get the associated ones
        //get all reviews, isolate to starts, create average

        return res.json(spots)
    }
)

module.exports = router;
