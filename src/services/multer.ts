import * as multer from 'multer';
import { Bucket } from '../entities';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './my_bucket/');
    },
    filename: async (req, file, cb) => {
        const bucket = new Bucket({
            fileName: file.originalname,
        });

        const entity = await bucket.save();

        cb(null, entity._id.toHexString());

        // Rename the file
        file.filename = entity._id.toHexString();
    },
});

const upload = multer({ storage: storage });

export default upload;
