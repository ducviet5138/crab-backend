// ========================================================
// Set up database and express server
import * as express from 'express';
import 'reflect-metadata';
import databaseInitialize from './app-data-src';
import 'module-alias/register';
import * as cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        await databaseInitialize();

        app.listen(port, () => {
            console.log(`[Server] Server is running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('[Database] Error: ', err);
    }
};

startServer();

// ========================================================
// Set up routes
import router from './routes';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/BaseResponse';
import { RET_CODE } from '@/utils/ReturnCode';
import * as jwt from 'jsonwebtoken';

// Whitelist all as default
// const whitelist = [
//     '/'
// ];

// Middleware to check JWT token
app.use((req: Request, res: Response, next) => {
    // Check if route is in whitelist
    // if (whitelist.find((path) => req.originalUrl.includes(path))) {
    //     next();
    //     return;
    // }

    next();
    return;

    const token = req.headers['x-access-token'];
    
    // Check if token is provided
    if (!token) {
        const response = new BaseResponse(RET_CODE.UNAUTHORIZED, false, 'No token provided');
        res.status(response.getRetCode()).json(response.getResponse());
        return;
    }

    // Check if token is invalid or not
    jwt.verify(token as string, process.env.JWT_SECRET, (err: any) => {
        if (err) {
            const response = new BaseResponse(RET_CODE.UNAUTHORIZED, false, 'Token is invalid');
            res.status(response.getRetCode()).json(response.getResponse());
        } else {
            next();
        }
    });
});

app.use('/', router);
