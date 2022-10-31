require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const {
  SECRET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
} = process.env;
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  }),
});

const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const filesPath = path.join(
        process.cwd(),
        `/public/assets/`,
        dayjs(Date.now()).format('YYYYMMDD')
      );
      if (!fs.existsSync(filesPath)) {
        fs.mkdirSync(filesPath, { recursive: true });
      }
      cb(null, filesPath);
    },
    filename: (req, file, cb) => {
      // const fileExtension = file.mimetype.split('/')[1]; // png
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

const authentication = async (req, res, next) => {
  // let accessToken = req.get('Authorization');
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  accessToken = accessToken.split(' ')[1];
  if (accessToken === 'null') {
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

const socketJwtVerify = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        reject(new Error('Verify error!'));
      } else {
        resolve(payload);
      }
    });
  });
};

const socketAuth = async (token) => {
  token = token.replace('Bearer ', '');
  if (token === 'null') {
    throw new Error('Not authorized');
  }

  try {
    return await socketJwtVerify(token, SECRET);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadS3,
  uploadLocal,
  jwtSign,
  jwtVerify,
  authentication,
  socketAuth,
};
