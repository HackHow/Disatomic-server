const router = require('express').Router();
// const { mongoDB } = require('../../util/mongodb');
const { upload } = require('../../utils/util');
const { uploadImages } = require('../controllers/upload_images');
const { authentication } = require('../../utils/util');

router
  .route('/uploadfiles')
  .post(
    authentication,
    upload.fields([{ name: 'files', maxCount: 5 }]),
    uploadImages
  );

module.exports = router;
