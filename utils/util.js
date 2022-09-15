require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { SECRET } = process.env;
const { USER_ROLE } = require('../server/models/server');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log('multer req.body', req.body);
      // const pictureName = req.body.images;
      const imagesPath = path.join(
        process.cwd(),
        `/public/assets/`,
        dayjs(Date.now()).format('YYYYMMDD')
      );
      if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath, { recursive: true });
      }
      cb(null, imagesPath);
    },
    filename: (req, file, cb) => {
      // const fileExtension = file.mimetype.split('/')[1];
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

const jwtSign = async (payload, secret, expiresIn) => {
  return await promisify(jwt.sign)(payload, secret, {
    expiresIn: expiresIn,
  });
};

const jwtVerify = async (token, secret) => {
  return await promisify(jwt.verify)(token, secret);
};

const authorization = async (req, res, next) => {
  let accessToken = req.get('Authorization');
  if (!accessToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  accessToken = accessToken.split(' ')[1];
  if (accessToken === null) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const user = await jwtVerify(accessToken, SECRET);
    req.user = user;
    next();
    return;
  } catch (error) {
    res.status(403).send({ error: 'Forbidden' });
    return;
  }
};

module.exports = { upload, jwtSign, jwtVerify, authorization };
