'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const demoSpotImages = [
  {
    spotId: 1,
    url: "https://media-cdn.tripadvisor.com/media/photo-p/1c/d4/cb/01/the-blue-house.jpg",
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
    url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iscapeit.com%2Fblog%2Fflower-ideas-for-a-blue-house&psig=AOvVaw3S_AoaPPgu03dJfLHCmcSg&ust=1708993836621000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMCcu9_gx4QDFQAAAAAdAAAAABAQ",
    preview: true
  },
  {
    spotId: 1,
    url: "https://hips.hearstapps.com/hmg-prod/images/blue-living-rooms-hbx080121katicurtis-003-copy-1652815934.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_EXTERIOR_011.jpg.rend.hgtvcom.791.527.suffix/1663185741249.jpeg"
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_EXTERIOR_017.jpg.rend.hgtvcom.791.527.suffix/1663185744099.jpeg"
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_ROOM2_011.jpg.rend.hgtvcom.791.527.suffix/1663185747303.jpeg"
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_ROOM7_007.jpg.rend.hgtvcom.791.527.suffix/1663185747556.jpeg"
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_ROOM7_014.jpg.rend.hgtvcom.791.1187.suffix/1663185750209.jpeg"
  },
  {
    spotId: 3,
    url: "https://hips.hearstapps.com/hmg-prod/images/ka-ehu-kai-marriott-villas-1615930743.jpg?crop=1xw:1xh;center,top&resize=980:*",
    preview: true
  },
  {
    spotId: 3,
    url: "https://hips.hearstapps.com/hmg-prod/images/onefinestay-pacific-palisades-1615925484.png?crop=1xw:1xh;center,top&resize=980:*",
    preview: true
  },
  {
    spotId: 3,
    url: "https://hips.hearstapps.com/hmg-prod/images/loscabos-res-joyadelmar-ext-hero-uhd-1615923541.jpeg?crop=1xw:1xh;center,top&resize=980:*",
    preview: true
  },
  {
    spotId: 3,
    url: "https://hips.hearstapps.com/hmg-prod/images/atelier-house-villa-rentals-barbados-caribbean-4-640x480-c-center-1615922068.jpg?crop=1xw:1xh;center,top&resize=980:*",
    preview: true
  },
  {
    spotId: 3,
    url: "https://hips.hearstapps.com/hmg-prod/images/ani-villas-anguilla-cg1-11-long-1616005841.jpg?crop=1xw:1xh;center,top&resize=980:*",
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
