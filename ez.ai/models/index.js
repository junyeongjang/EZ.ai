const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.json"))[
  env
];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Chatbot = require("./chatbot")(sequelize, Sequelize);
db.Keyword = require("./keyword")(sequelize, Sequelize);
db.ChatbotData = require("./chatbotData")(sequelize, Sequelize);

db.Keyword.hasMany(db.Chatbot, { foreignKey: "keyworder", sourceKey: "id" });
db.Chatbot.belongsTo(db.Keyword, { foreignKey: "keyworder", targetKey: "id" });

module.exports = db;
