require('dotenv').config();
const Upload = require('../models/upload');
const { jwtSign } = require('../../utils/util');
const { DNS, SYSTEM, AWS_CLOUD_FRONT, SECRET, EXPIRED } = process.env;

const uploadImagesToLocal = async (req, res) => {
  const { files } = req.files;
  const filesPath = files[0].path;

  let filesURL;

  if (SYSTEM === 'windows') {
    filesURL = DNS + '/' + filesPath.split('\\').slice(-3).join('/');
  }

  if (SYSTEM === 'linux') {
    filesURL = DNS + '/' + filesPath.split('/').slice(-3).join('/');
  }

  res.status(200).send({ pictureURL: filesURL });
  return;
};

const uploadImageToS3 = async (req, res) => {
  const { files } = req.files;
  const pictureURL = `https://${AWS_CLOUD_FRONT}/${files[0].key}`;
  res.status(200).send({ pictureURL });
  return;
};

const uploadAvatarToS3 = async (req, res) => {
  const { userId } = req.user;
  const { key } = req.file;
  const avatarURL = `https://${AWS_CLOUD_FRONT}/${key}`;

  const result = await Upload.saveAvatarURL(userId, avatarURL);
  const jwtToken = await jwtSign(
    {
      userId: result.user._id,
      userAvatar: result.user.avatarURL,
      userName: result.user.name,
    },
    SECRET,
    EXPIRED
  );
  res
    .status(200)
    .send({
      accessToken: jwtToken,
      expired: EXPIRED,
      avatarURL: result.user.avatarURL,
      msg: result.msg,
    });
  return;
};

module.exports = { uploadImagesToLocal, uploadImageToS3, uploadAvatarToS3 };
