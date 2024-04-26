import { RET_CODE, RET_MSG } from './ReturnCode';

export default class BaseResponse {
    retCode: number;
    success: boolean;
    message: string;
    data: any;

    constructor(newRetCode: number, newSuccess: boolean, newMessage: string, newData: any = {}) {
        this.retCode = newRetCode || RET_CODE.ERROR;
        this.success = newSuccess;
        this.message = newMessage || RET_MSG.ERROR;
        this.data = newData || {};
    }

    getRetCode() {
        return this.retCode;
    }

    getResponse() {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
        };
    }
}
