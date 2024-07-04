import multer from 'multer';
import { TMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const suffix = Date.now();
    cb(null, `${file.originalname}_${suffix}`);
  },
});

export const upload = multer({ storage });