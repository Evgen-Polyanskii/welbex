require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const models = require('../db/models');
const addRoutes = require('./routes/index.js');
const webpack = require('webpack');
const methodOverride = require('method-override');
const webpackDevMiddleware = require('webpack-dev-middleware');


module.exports = () => {
  const app = express();
  const config = require('../webpack.config.js');
  const compiler = webpack(config);
  app.set('models', models);
  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'pug');
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );
  app.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
  }));
  app.use(bodyParser.urlencoded({
    extended: false,
  }));
  app.use(express.static('files'));
  app.use(methodOverride('_method'));
  addRoutes(app);
  return app;
};
