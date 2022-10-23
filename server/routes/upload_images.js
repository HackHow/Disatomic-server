const router = require('express').Router();
// const { mongoDB } = require('../../util/mongodb');
const { uploadS3 } = require('../../utils/util');
const { uploadImageToS3 } = require('../controllers/upload_images');
const { authentication } = require('../../utils/util');

router
  .route('/uploadfiles')
  .post(
    authentication,
    uploadS3.fields([{ name: 'files', maxCount: 5 }]),
    uploadImageToS3
  );

module.exports = router;
