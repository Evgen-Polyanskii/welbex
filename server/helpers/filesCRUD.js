const _ = require('lodash');
const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

const createDirPost = async (postId) => {
  const dirPath = path.resolve(__dirname, '../..', 'files', String(postId));
  if (!fs.existsSync(dirPath)) {
    await fsp.mkdir(dirPath);
  }
  return dirPath;
}

const saveFiles = async (files, postId) => {
  const fileList = _.isArray(files) ? files : [files];
  const dirPath = await createDirPost(postId);
  const writeFiles = fileList.map((file) => {
    const filePath = path.resolve(dirPath, file.name);
    return file.mv(filePath).then(() => filePath);
  });
  return await Promise.allSettled(writeFiles);
};

const deleteDirPost = async (postId) => {
  const dirPath = path.resolve(__dirname, '../..', 'files', String(postId));
  if (fs.existsSync(dirPath)) {
    return await fsp.rm(dirPath, { recursive: true });
  }
};

const deleteFiles = async (files) => {
  const fileList = _.isArray(files) ? files : [files];
  const promiseFileList = fileList.map(({ tempFilePath }) => fsp.rm(tempFilePath, { force: true }));
  return await Promise.all(promiseFileList);
};

const deleteLoadFiles = async (postId, files) => {
  await deleteDirPost(postId);
  await deleteFiles(files);
}


module.exports = {
  saveFiles,
  deleteLoadFiles,
  deleteFiles,
  deleteDirPost,
};
