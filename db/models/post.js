'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { as: 'author', foreignKey: 'author_id' });
      Post.hasMany(models.File, { as: 'files', foreignKey: 'post_id', onDelete: 'CASCADE' });
    }
  }
  Post.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    published_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        isDate: true
      },
    },
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
  });
  return Post;
};
