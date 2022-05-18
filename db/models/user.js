'use strict';
const { Model } = require('sequelize');
const { encrypt } = require('../../server/middleware/secure.js');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'author_id', as: 'posts', onDelete: 'CASCADE' });
      User.hasMany(models.File, { foreignKey: 'author_id', as: 'files', onDelete: 'CASCADE' });
    }

    verifyPassword(password) {
      return encrypt(password) === this.password;
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: true, msg: 'Nickname must be unique.' },
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      set(value) {
        this.setDataValue('password', encrypt(value));
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: true, msg: 'Email must be unique.' },
      validate: {
        notEmpty: true,
        isEmail: { args: true, msg: 'Invalid email address.' },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};
