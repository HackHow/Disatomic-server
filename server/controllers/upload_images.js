require('dotenv').config();
const { DNS, SYSTEM, AWS_BUCKET_REGION, AWS_CLOUD_FRONT } = process.env;

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
  // const pictureURL = `https://disatomic.s3.${AWS_BUCKET_REGION}.amazonaws.com/${files[0].key}`;
  const pictureURL = `https://${AWS_CLOUD_FRONT}/${files[0].key}`;
  res.status(200).send({ pictureURL });
  return;
};

module.exports = { uploadImagesToLocal, uploadImageToS3 };
