const db = require("./db");

const User = require("./models/User");
const Events = require("./models/Events");
const Groups = require("./models/Order");
const UserGroups = require("./models/UserGroups");

Groups.belongsToMany(User, { through: UserGroups, unique: false });
User.belongsToMany(Groups, { through: UserGroups, unique: false });

UserGroups.belongsTo(User);
UserGroups.belongsTo(Groups);

Groups.hasMany(Events);
Events.belongsTo(Groups);

module.exports = {
  db,
  models: {
    User,
    Events,
    Groups,
    UserGroups,
  },
};