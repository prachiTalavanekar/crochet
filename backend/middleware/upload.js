const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store files in memory, then stream to Cloudinary
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(file.mimetype);
    cb(ok ? null : new Error('Only images allowed'), ok);
  },
});

// Upload a single buffer to Cloudinary, returns secure_url
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'crochet-store', transformation: [{ width: 800, crop: 'limit' }] },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    Readable.from(buffer).pipe(stream);
  });

module.exports = { multerUpload, uploadToCloudinary };
