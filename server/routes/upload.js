const router = require('express').Router();
// const { mongoDB } = require('../../util/mongodb');
const { uploadS3 } = require('../../utils/util');
const { uploadImageToS3, uploadAvatarToS3 } = require('../controllers/upload');
const { authentication } = require('../../utils/util');

router
  .route('/uploadfiles')
  .post(
    authentication,
    uploadS3.fields([{ name: 'files', maxCount: 5 }]),
    uploadImageToS3
  );

router
  .route('/uploadAvatar')
  .post(authentication, uploadS3.single('avatar'), uploadAvatarToS3);

module.exports = router;
