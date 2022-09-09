const router = require('express').Router();
// const { mongoDB } = require('../../util/mongodb');
const { upload } = require('../../utils/util');
const { uploadImages } = require('../controllers/upload_images');

router
  .route('/channels/uploadfiles')
  .post(upload.single('images'), uploadImages);

module.exports = router;
