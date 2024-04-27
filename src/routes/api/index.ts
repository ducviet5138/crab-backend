import * as Express from 'express';
import filesRoute from './files';
import accountRoute from './accounts';
import locationRecordRoute from './location-records';
import staffRoute from './staff';

const router = Express.Router();

router.use('/files', filesRoute);
router.use('/accounts', accountRoute);
router.use('/location-records', locationRecordRoute);
router.use('/staff', staffRoute);

export default router;
