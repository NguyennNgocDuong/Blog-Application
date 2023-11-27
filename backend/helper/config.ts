// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-var-requires */
// import multer from 'multer';
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//   cloud_name: process.env.CLOUNDINARY_NAME,
//   api_key: process.env.CLOUNDINARY_KEY,
//   api_secret: process.env.CLOUNDINARY_SECRET,
// });

// export const storage = new CloudinaryStorage({
//   cloudinary,
//   // allowedFormats: ['jpg', 'png'],
//   params: {
//     folder: 'MaasEduTech',
//   },
// });

// export const upload = multer({ storage: storage });
// // export const upload = multer({ storage: storage, fileFilter: isImage })
