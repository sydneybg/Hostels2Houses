const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');


const router = express.Router();

// Get all of the Current User's Bookings

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { id: guestId } = req.user;

        let bookings = await Booking.findAll({
            where: { guestId },
            include: [
                { model: Spot, attributes: { exclude: ['description', 'createdAt', 'updatedAt']}, include: {model: SpotImage}}
            ]
        });

        bookings = bookings.map(booking => {
            const spot = booking.get('Spot').dataValues;
            const spotImages = spot.SpotImages;
            let previewImage = '';

            const foundSpotImage = spotImages.find(image => {
                return image.dataValues.preview
            })

            if (foundSpotImage) {
                previewImage = foundSpotImage.dataValues.url
            };
            booking.dataValues.userId = booking.dataValues.guestId;
            delete booking.dataValues.guestId;
            spot.previewImage = previewImage;
            delete spot.SpotImages

            return booking
        });

        const bookingsResponse = { Bookings: bookings}
        res.json(bookingsResponse)
    }
);

//delete booking

router.delete(
  '/:bookingId',
  requireAuth,
  async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({message: "Booking couldn't be found"})
    };

    if(booking.guestId !== req.user.id) {
      const spot = await Spot.findByPk(booking.spotId);
      if(spot.ownerId !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden'
        });
      }
    }

    const now = new Date();
    if(booking.startDate < now) {
      return res.status(403).json({
        message: 'Bookings that have started can\'t be deleted'
      });
    }
    await booking.destroy();

    return res.json({message: 'Successfully deleted'});
  }
);

//edit booking
const validateBooking = [
  check('startDate')
    .exists()
    .withMessage('Start date is required'),

  check('endDate')
    .exists()
    .withMessage('End date is required')
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



// edit a booking
router.put(
    '/:bookingId',
    requireAuth,
    validateBooking,
    async (req, res) => {
      const { id: userId } = req.user;

        let bookingId = parseInt(req.params.bookingId);

        let { startDate, endDate } = req.body;

        let booking = await Booking.findByPk(bookingId, {
            include: Spot
        });

        if(!booking) {
          return res.status(404).json({
            message: "Booking not found"
          });
        };

        const { spotId } = booking.dataValues;

          if(booking.guestId !== userId) {
            return res.status(403).json({
              message: "Forbidden"
            });
          };

          const allBookings = await Booking.findAll({ where: { spotId }});

          startDate = new Date(startDate);
          endDate = new Date(endDate);

          if (new Date() > endDate) {
            return res.status(400).json({
              message: "Past bookings can't be modified"
            });
          }


          let hasConflict = false;
          let errors = {};

          for (let booking of allBookings){
            const existingStartDate = booking.dataValues.startDate;
            const existingEndDate = booking.dataValues.endDate;

            if (booking.dataValues.id === bookingId){
              continue
            };

            if (existingStartDate < startDate && startDate < existingEndDate) {
                hasConflict = true;
                errors.startDate = "Start date conflicts with an existing booking"
            };

            if (existingEndDate > endDate && endDate > existingStartDate ) {
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


          await booking.update({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          });

          return res.json(booking);
    }
);


module.exports = router;
