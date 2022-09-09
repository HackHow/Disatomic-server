require('dotenv').config();
const { DNS } = process.env;

const uploadImages = async (req, res) => {
  //   console.log('controller req.file', req.file);
  //   console.log('controllers req.body', req.body);
  const filePath = req.file.path;
  const fileName = filePath.split('\\').slice(-3);
  const fileUrl = DNS + '/' + fileName.join('/');

  return res.status(200).send({ pictureUrl: fileUrl });
};

module.exports = { uploadImages };
