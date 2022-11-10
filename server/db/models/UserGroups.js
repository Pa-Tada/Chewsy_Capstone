const Sequelize = require("sequelize");
const db = require("../db");

const UserGroups = db.define("userGroups", {
  isLeader: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = UserGroups;
