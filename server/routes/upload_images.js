const router = require('express').Router();
// const { mongoDB } = require('../../util/mongodb');
const { upload } = require('../../utils/util');
const { uploadImages } = require('../controllers/upload_images');

router
  .route('/uploadfiles')
  .post(upload.fields([{ name: 'files', maxCount: 5 }]), uploadImages);

module.exports = router;
