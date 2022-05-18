const { auth } = require('../middleware/secure.js');
const PostsRepositories = require('../repositories/PostsRepositories.js');
const _ = require('lodash');

const resource = '/posts';

module.exports = (app) => {
  const postsRepositories = new PostsRepositories(app);
  app
    .get(resource, async (req, res) => {
      try {
        const posts = await postsRepositories.findAll();
        res.render('posts/index', { posts });
      } catch (err) {
        res.send(500, 'Something went wrong, please try again');
      }
    })
    .get(`${resource}/new`, auth, (req, res) => {
      try {
        const post = {};
        res.render('posts/new', { post });
      } catch (err) {
        res.send(500, 'Something went wrong, please try again');
      }
    })
    .get(`${resource}/:id/edit`, auth, async (req, res) => {
      const postId = req.params.id;
      const post = await postsRepositories.findPost(postId);
      if (_.isNull(post)) res.send(404, `Post not found`);
      if (req.user.id === post.author_id) {
        res.render('posts/edit', { post });
      } else {
        res.send(403, 'You cannot edit this post.');
      }
    })
    .post(resource, auth, async (req, res) => {
      try {
        postsRepositories.initialize(req.user);
        const post = await postsRepositories.createPost(req.body, req.files?.files);
        res
          .location(`${resource}/${post.id}`)
          .send(201, 'Post create');
      } catch (err) {
        res.send(400, err.message);
      }
    })
    .put(`${resource}/:id`, auth, async (req, res) => {
      try {
        const postId = req.params.id;
        postsRepositories.initialize(req.user);
        const post = await postsRepositories.findPost(postId);
        if (_.isNull(post)) res.send(404, `Post not found`);
        if (req.user.id === post.author_id) {
          const newData = req.files ? { ...req.body, files: req.files.files } : req.body;
          await postsRepositories.updatePost(post, newData);
          res
            .send(200, 'Post update');
        } else {
          res.send(403, 'You cannot edit this post.');
        }
      } catch (err) {
        console.log(err)
        res.send(500, 'Something went wrong, please try again');
      }
    })
    .delete(`${resource}/:id`, auth, async (req, res) => {
      try {
        const postId = req.params.id;
        const post = await postsRepositories.findPost(postId);
        if (_.isNull(post)) res.send(404, `Post not found`);
        if (req.user.id === post.author_id) {
          await postsRepositories.deletePost(postId);
          res.send(200, `Post was deleted`);
        } else {
          res.send(403, 'You cannot delete this post.');
        }
      } catch (err) {
        res.send(500, 'Something went wrong, please try again');
      }
    })
};
