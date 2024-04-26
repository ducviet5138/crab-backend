import * as Express from 'express';
import filesRoute from './files';

const router = Express.Router();

router.use('/files', filesRoute);

export default router;
