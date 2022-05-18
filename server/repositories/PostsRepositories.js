const _ = require('lodash');
const {
  saveFiles,
  deleteLoadFiles,
  deleteFiles,
  deleteDirPost,
} = require('../helpers/filesCRUD.js');

class PostsRepositories {
  constructor(app) {
    this.context = {};
    this.models = app.get('models');
  }

  initialize(config) {
    this.context = config;
  }

  async findAll () {
    return await this.models.Post.findAll({
      attributes: ['id', 'message', 'published_at'],
      include: [
        {
          model: this.models.User,
          as: 'author',
          attributes: ['nickname'],
        },
        {
          model: this.models.File,
          as: 'files',
          attributes: ['file_path'],
        }
      ]
    });
  }

  async findPost (id) {
    return await this.models.Post.findByPk(id, {
      attributes: ['id', 'message', 'author_id', 'published_at'],
      include: {
        model: this.models.File,
        as: 'files',
        attributes: ['file_path'],
      }
    });
  }

  async createPost (data, files) {
    let postId;
    const t = await this.models.sequelize.transaction();
    try {
      const postData = _.pickBy(data, (val) => val !== '');
      const post = await this.models.Post.create({
        ...postData, author_id: this.context.id
      }, { transaction: t });
      if (!_.isEmpty(files)) {
        postId = post.id;
        const filePaths = await saveFiles(files, postId);
        const fileData = filePaths.map(({ value }) => ({
          file_path: value,
          post_id: post.id,
          author_id: this.context.id
        }));

        await this.models.File.bulkCreate(fileData, { transaction: t });
      }
      await t.commit();
      return post;
    } catch (err) {
      if (!_.isEmpty(files)) await deleteLoadFiles(postId, files);
      await t.rollback();
    }
  }

  async updatePost (post, newData) {
    const t = await this.models.sequelize.transaction();
    const { files, ...data } = newData;
    const postData = _.pickBy(data, (val) => val !== '');
    try {
      await deleteDirPost(post.id);
      await this.models.Post.update(postData, {
        where: {
          id: post.id
        },
      }, { transaction: t } );
      await this.models.File.destroy({
        where: {
          post_id: post.id
        }
      }, { transaction: t });
      if (!_.isUndefined(files)) {
        const filePaths = await saveFiles(files, post.id);
        const fileData = filePaths.map(({ value }) => ({
          file_path: value,
          post_id: post.id,
          author_id: this.context.id
        }));

        await this.models.File.bulkCreate(fileData, { transaction: t });
      }
      await t.commit();
    } catch (err) {
      if (!_.isUndefined(files)) await deleteFiles(files);
      await t.rollback();
    }
  }

  async deletePost (id) {
    await this.models.Post.destroy({
      where: {
        id
      }
    });
    await deleteDirPost(id);
  }
}

module.exports = PostsRepositories;
