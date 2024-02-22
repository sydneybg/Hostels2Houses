'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const demoSpotImages = [
  {
    spotId: 1,
    url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftown-n-country-living.com%2Fbeautiful-blue-house.html&psig=AOvVaw2JP2MotwCWck07iihAf9lO&ust=1708652014612000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLCP4vfmvYQDFQAAAAAdAAAAABAD",
    preview: true
  },
  {
    spotId: 1,
    url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/254995061.jpg?k=156945f36cb141e8c98961bfe9df176c5f5d1ae32ce22d9d4294d7977154d202&o=&hp=1",
    preview: true
  },
  {
    spotId: 1,
    url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/254995060.jpg?k=c054ff852037f3b50d09e1209baf8963a2c79b301b76ae310bb1dc8f93042b34&o=&hp=1",
    preview: true
  },
  {
    spotId: 1,
    url: "https://i.ytimg.com/vi/T6qWuNuPJ0w/maxresdefault.jpghttps://www.google.com/url?sa=i&url=https%3A%2F%2Ftown-n-country-living.com%2Fbeautiful-blue-house.html&psig=AOvVaw2JP2MotwCWck07iihAf9lO&ust=1708652014612000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLCP4vfmvYQDFQAAAAAdAAAAABAD",
    preview: true
  },
  {
    spotId: 1,
    url: "https://hips.hearstapps.com/hmg-prod/images/blue-living-rooms-hbx080121katicurtis-003-copy-1652815934.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "www.abcd.com"
  },
  {
    spotId: 3,
    url: "www.bdef.com",
    preview: true
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImage';
    await SpotImage.bulkCreate( demoSpotImages, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.abc.com']}
    }, {})
  }
};
