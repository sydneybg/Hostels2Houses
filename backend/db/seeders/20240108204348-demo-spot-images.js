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
    url: "https://www.kathykuohome.com/blog/wp-content/uploads/2016/02/blue_feature-1140x570.jpg",
    preview: true
  },
  {
    spotId: 1,
    url: "https://hips.hearstapps.com/hmg-prod/images/blue-living-rooms-hbx080121katicurtis-003-copy-1652815934.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_EXTERIOR_011.jpg.rend.hgtvcom.791.527.suffix/1663185741249.jpeg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_EXTERIOR_017.jpg.rend.hgtvcom.791.527.suffix/1663185744099.jpeg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_ROOM2_011.jpg.rend.hgtvcom.791.527.suffix/1663185747303.jpeg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_ROOM7_007.jpg.rend.hgtvcom.791.527.suffix/1663185747556.jpeg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/9/14/0/Original_Derek_Trimble_HouseofAdora_ROOM7_014.jpg.rend.hgtvcom.791.1187.suffix/1663185750209.jpeg",
    preview: true
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
  },
  {
    spotId: 4,
    url: "https://imageio.forbes.com/specials-images/imageserve/648916c1be9483831575c365/Tree-Haus/960x0.jpg?format=jpg&width=1440",
    preview: true
  },
  {
    spotId: 4,
    url: "https://wacocreeksideresort.com/wp-content/uploads/2023/06/P1223374-2-2048x1638.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://wacocreeksideresort.com/wp-content/uploads/2023/06/CC5A3275-1536x1025.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://wacocreeksideresort.com/wp-content/uploads/2022/10/BEN_7632.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://wacocreeksideresort.com/wp-content/uploads/2022/10/BEN_9558.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://cdn.homedit.com/wp-content/uploads/2012/03/the_bedford_luxurious_restaurant.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://cdn.homedit.com/wp-content/uploads/2012/03/the_bedford_luxurious_restaurant2.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://cdn.homedit.com/wp-content/uploads/2012/03/the_bedford_luxurious_restaurant3.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://cdn.homedit.com/wp-content/uploads/2012/03/the_bedford_luxurious_restaurant4.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://nypost.com/wp-content/uploads/sites/2/2018/10/24a-bank108leo3-c-ta_rr.jpg?resize=1536,1025&quality=75&strip=all",
    preview: true
  },

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
