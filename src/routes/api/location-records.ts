import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/BaseResponse';
import { RET_CODE, RET_MSG } from '@/utils/ReturnCode';

import LocationRecordsService from '@/services/location-records';

const router = Express.Router();

// POST: /api/location-records
// Desc: Create a location record
router.post('/', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await LocationRecordsService.create(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

// GET: /api/location-records?address=...&location=...
// Desc: Find a location record
router.get('/', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await LocationRecordsService.findBySearchParams(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

// GET: /api/location-records/unresolved-list
// Desc: Get all location records without GPS coordinates
router.get('/unresolved-list', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await LocationRecordsService.listUnresolved();
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

// PATCH: /api/location-records/:id
// Desc: Update a location record
router.patch('/:id', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await LocationRecordsService.update(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

// POST: /api/location-records/:id/update-fee
// Desc: Update fee of a booking info which is associated with a location record
router.post('/:id/update-fee', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await LocationRecordsService.updateFee(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

export default router;