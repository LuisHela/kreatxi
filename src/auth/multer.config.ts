// Create a multer configuration file (multer.config.ts) in your project.
import { diskStorage } from 'multer';

export const multerConfig = {
  dest: './uploads/', // Specify the destination directory for uploaded files
  storage: diskStorage({
    destination: './uploads/', // Specify the destination directory for uploaded files
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
    },
  }),
};
