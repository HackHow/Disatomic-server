require('dotenv').config();
const { DNS } = process.env;

const uploadImages = async (req, res) => {
  const { files } = req.files;
  const filesPath = files[0].path;

  const filesName = filesPath.split('\\').slice(-3);
  const filesUrl = DNS + '/' + filesName.join('/');

  return res.status(200).send({ pictureURL: filesUrl });
};

module.exports = { uploadImages };
