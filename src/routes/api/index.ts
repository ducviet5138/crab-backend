import * as Express from "express";
import filesRoute from "./files";
import accountRoute from "./accounts";
import locationRecordRoute from "./location-records";
import staffRoute from "./staff";
import bookingsRoute from "./bookings";
import feeRoute from "./fee";
import firebaseRoute from "./firebase";
import driverRoute from "./drivers";
import notificationRoute from './notification';

const router = Express.Router();

router.use("/files", filesRoute);
router.use("/accounts", accountRoute);
router.use("/location-records", locationRecordRoute);
router.use("/staff", staffRoute);
router.use("/bookings", bookingsRoute);
router.use("/fee", feeRoute);
router.use("/firebase", firebaseRoute);
router.use("/drivers", driverRoute);
router.use('/notification', notificationRoute)

export default router;
