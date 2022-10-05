require('dotenv').config();
const { DNS, SYSTEM } = process.env;

const uploadImages = async (req, res) => {
  const { files } = req.files;
  const filesPath = files[0].path;

  let filesURL;

  if (SYSTEM === 'windows') {
    filesURL = DNS + '/' + filesPath.split('\\').slice(-3).join('/');
  }

  if (SYSTEM === 'linux') {
    filesURL = DNS + '/' + filesPath.split('/').slice(-3).join('/');
  }

  // const filesName = filesPath.split('\\').slice(-3);
  // const filesUrl = DNS + '/' + filesName.join('/');

  return res.status(200).send({ pictureURL: filesURL });
};

module.exports = { uploadImages };
