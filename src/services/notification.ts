import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { NotificationToken } from "@/entities";
import { getMessaging } from "firebase-admin/messaging";


class NotificationService {
    async updateToken(req: Request) {
        const { user, token } = req.body;
        // update token
        const notiToken = await NotificationToken.findOne({ user: user });
        if (notiToken) {
            notiToken.token = token;
            await notiToken.save();
        } else {
            await NotificationToken.create({ user, token });
        }

        return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
            token,
        });
    }

    sendNotification(token: string, stripStatus: { title: string, body: string }, bookingId: string, driverLat?: number , driverLng?: number ) {
        // send notification
        let data = null
        if (driverLat && driverLng) {
            data = {
                booking_id: bookingId,
                driver_lat: driverLat.toString(),
                driver_lng: driverLng.toString()
            }
        }
        else {
            data = {booking_id: bookingId}
        }
        getMessaging().send({
            notification: {
                title: stripStatus.title,
                body: stripStatus.body,
            },
            data: data,
            token: token,
        })
        .then((response) => {
            // console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            // console.log("Error sending message:", error);
        });

        
    }
}

export default new NotificationService();
