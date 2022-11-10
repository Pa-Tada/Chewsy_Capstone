const Sequelize = require("sequelize");
const db = require("../db");

const Event = db.define("event", {
  // restaurantCode: {
  //   type: Sequelize.INTEGER,
  // },
  restaurantImgUrl: {
    type: Sequelize.STRING,
    defaultValue: "https://thumbs.dreamstime.com/b/dining-table-icon-154896552.jpg",
  },
  restaurantName: {
    type: Sequelize.STRING,
  },
  restaurantLocation: {
    type: Sequelize.STRING,
  },
  eventDateTime: {
    type: Sequelize.DATE,
  },
  submissions: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  groupId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Event;
