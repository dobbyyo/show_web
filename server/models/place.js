const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Place extends Model {
  static init(sequelize) {
    return super.init(
      {
        lat: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        lng: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        modelName: "Place",
        tableName: "places",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Place.belongsTo(db.Post);
  }
};
