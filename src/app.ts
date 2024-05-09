// ========================================================
// Set up database and express server
import * as express from "express";
import "reflect-metadata";
import databaseInitialize from "./app-data-src";
import "module-alias/register";
import * as cors from "cors";

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

        const pendingBookings = await Booking.find({ status: "pending" });

        for (const booking of pendingBookings) {
            if (booking.info instanceof BookingInfo) {
                if (booking.info.pickup instanceof LocationRecord) {
                    bookingQueue.push(
                        new BookingWS(
                            booking._id.toString(),
                            booking.info.pickup.location?.coordinates[1],
                            booking.info.pickup.location?.coordinates[0],
                            booking.orderedBy?.toString(),
                            booking.vehicle
                        )
                    );
                }
            } else {
                bookingQueue.push(
                    new BookingWS(booking._id.toString(), 0, 0, booking.orderedBy.toString(), booking.vehicle)
                );
            }
        }
        reassignBookingToOtherDrivers();
    } catch (err) {
        console.error("[Database] Error: ", err);
    }
};

startServer();

// ========================================================
// Set up routes
import router from "./routes";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE } from "@/utils/ReturnCode";
import * as jwt from "jsonwebtoken";

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

    const token = req.headers["x-access-token"];

    // Check if token is provided
    if (!token) {
        const response = new BaseResponse(RET_CODE.UNAUTHORIZED, false, "No token provided");
        res.status(response.getRetCode()).json(response.getResponse());
        return;
    }

    // Check if token is invalid or not
    jwt.verify(token as string, process.env.JWT_SECRET, (err: any) => {
        if (err) {
            const response = new BaseResponse(RET_CODE.UNAUTHORIZED, false, "Token is invalid");
            res.status(response.getRetCode()).json(response.getResponse());
        } else {
            next();
        }
    });
});


app.use('/', router);

// ========================================================
// firebase admin
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseConfig from "./../firebase-config.json";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: firebaseConfig.project_id,
        clientEmail: firebaseConfig.client_email,
        privateKey: firebaseConfig.private_key.replace(/\\n/g, '\n')
    }),
});


// ========================================================
// Websocket handle
import * as WebSocket from "ws";
import { Booking, BookingInfo, LocationRecord } from "./entities";

const wss = new WebSocket.Server({ port: 8080 });

class Driver {
    ws: WebSocket;
    status: string;
    vehicle: string;
    lat: number | null;
    lng: number | null;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.status = "online";
        this.vehicle = "";
        this.lat = null;
        this.lng = null;
    }
}

class Customer {
    ws: WebSocket;
    userUid: string | null;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.userUid = null;
    }
}

class BookingWS {
    bookingId: string;
    lat: number;
    lng: number;
    vehicle: string;
    userUid: string;
    status: string;
    assignedDriver: Driver | null;
    timeout: NodeJS.Timeout | null;
    listDeny: WebSocket[];

    constructor(bookingId: string, lat: number, lng: number, userUid: string, vehicle: string) {
        this.bookingId = bookingId;
        this.lat = lat;
        this.lng = lng;
        this.vehicle = vehicle;
        this.userUid = userUid;
        this.status = "pending";
        this.assignedDriver = null;
        this.listDeny = [];
        this.timeout = null;
    }
}

let onlineDrivers: Driver[] = [];
let onlineCustomers: Customer[] = [];
let bookingQueue: BookingWS[] = [];

// const bookingMutex = {
//     isLocked: false,
//     queue: [],
//     lock: function (): Promise<void> {
//         return new Promise(resolve => {
//             if (!this.isLocked) {
//                 this.isLocked = true;
//                 resolve();
//             } else {
//                 this.queue.push(resolve);
//             }
//         });
//     },
//     unlock: function (): void {
//         if (this.queue.length > 0) {
//             const nextResolve = this.queue.shift();
//             if (nextResolve) {
//                 nextResolve();
//             }
//         } else {
//             this.isLocked = false;
//         }
//     }
// };

const TIMEOUT_DURATION = 10000; // 10 seconds

wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
        const data = JSON.parse(message) as {
            role: string;
            event: string;
            lat?: number;
            lng?: number;
            userUid?: string;
            booking?: any;
        };
        handleDriverMessage(ws, data);
    });

    ws.on("close", () => {
        handleClientDisconnect(ws);
    });
});

async function handleDriverMessage(
    ws: WebSocket,
    data: { event: string; lat?: number; lng?: number; booking?: any; vehicle?: string }
) {
    if (data.event === "driverOnline") {
        const driver = new Driver(ws);
        onlineDrivers.push(driver);
        reassignBookingToOtherDrivers();
    } else if (data.event === "driverOffline") {
        onlineDrivers = onlineDrivers.filter((driver) => driver.ws !== ws);
        ws.close();
    } else if (data.event === "locationUpdate") {
        const driver = onlineDrivers.find((driver) => driver.ws === ws);
        if (driver) {
            driver.lat = data.lat || null;
            driver.lng = data.lng || null;
        }
        reassignBookingToOtherDrivers();
    } else if (data.event === "bookingResponse") {
        handleBookingResponse(data.booking, ws);
    } else if (data.event === "updateVehicle") {
        const driver = onlineDrivers.find((driver) => driver.ws === ws);
        if (driver) {
            driver.vehicle = data.vehicle;
        }
    }
}

// function handleCustomerMessage(ws: WebSocket, data: { event: string, userUid?: string }) {
//     if (data.event === 'updateCustomer') {
//         const customer = new Customer(ws);
//         customer.userUid = data.userUid || null;
//         onlineCustomers.push(customer);
//     }
// }

function handleClientDisconnect(ws: WebSocket) {
    onlineDrivers = onlineDrivers.filter((driver) => driver.ws !== ws);
    onlineCustomers = onlineCustomers.filter((customer) => customer.ws !== ws);
}

function handleBookingResponse(data: { bookingId: string; response: string }, ws: WebSocket) {
    const booking = bookingQueue.find((booking) => booking.bookingId === data.bookingId);
    if (booking) {
        if (booking.timeout) {
            clearTimeout(booking.timeout); // Clear the timeout
        }

        if (data.response === "accept") {
            booking.status = "accepted";

            // clear driver
            onlineDrivers = onlineDrivers.filter((driver) => driver !== booking.assignedDriver);
            // clear booking
            bookingQueue = bookingQueue.filter((book) => book !== booking);
            // clear timeout
            booking.timeout = null;
        } else {
            booking.status = "pending";
            const driver = onlineDrivers.find((driver) => driver.ws === ws);
            if (driver) {
                driver.status = "online";
            }
            booking.listDeny.push(ws);
            reassignBookingToOtherDrivers();
        }
    }
}

function handleDriverTimeout(booking: BookingWS) {
    if (booking.status === "assigned") {
        // If the booking is still assigned (driver did not respond within the timeout)
        booking.status = "pending"; // Update booking status
        booking.assignedDriver.ws.send(JSON.stringify({ event: "bookingTimeout", bookingId: booking.bookingId }));
        booking.assignedDriver.ws.close();

        // Reassign the booking to other available drivers
        onlineDrivers = onlineDrivers.filter((driver) => driver !== booking.assignedDriver);
        reassignBookingToOtherDrivers();
    }
}
async function checkDatabase() {
    try {
        const pendingBookings = await Booking.find({ status: "pending" });
        for (const booking of pendingBookings) {
            if (booking.info instanceof BookingInfo) {
                if (booking.info.pickup instanceof LocationRecord) {
                    const find = bookingQueue.find((book) => book.bookingId === booking._id.toString());
                    if (!find) {
                        bookingQueue.push(
                            new BookingWS(
                                booking._id.toString(),
                                booking.info.pickup.location?.coordinates[1],
                                booking.info.pickup.location?.coordinates[0],
                                booking.orderedBy?.toString(),
                                booking.vehicle
                            )
                        );
                    }
                }
            }
        }
    } catch (err) {
        // console.log(err);
    }
}
async function reassignBookingToOtherDrivers() {
    // await checkDatabase();
    for (let i = 0; i < bookingQueue.length; i++) {
        const booking = bookingQueue[i];
        if (booking.status === "pending") {
            const suitableDriver = findSuitableDriver(booking);
            if (suitableDriver) {
                booking.status = "assigned";
                booking.assignedDriver = suitableDriver;
                suitableDriver.status = "assigned";
                suitableDriver.ws.send(JSON.stringify({ event: "newBooking", bookingId: booking.bookingId }));

                booking.timeout = setTimeout(() => {
                    handleDriverTimeout(booking);
                }, TIMEOUT_DURATION);
            }
        }
    }
}



function findSuitableDriver(booking: BookingWS): Driver | null {
    let minDistance = Number.MAX_VALUE;
    let suitableDriver = null;
    for (const driver of onlineDrivers) {
        // if driver in deny list of booking
        if (!booking.listDeny.includes(driver.ws)) {
            if (
                driver.status === "online" &&
                driver.lat &&
                driver.lng &&
                booking.lat &&
                booking.lng &&
                driver.vehicle === booking.vehicle
            ) {
                const distance = Math.sqrt(
                    Math.pow(booking.lat - driver.lat, 2) + Math.pow(booking.lng - driver.lng, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    suitableDriver = driver;
                }
            }
        }
    }
    return suitableDriver;
}

function addBookingToQueue(booking: BookingWS) {
    bookingQueue.push(booking);
    reassignBookingToOtherDrivers();
}

function updateBookingWS(bookingId: string, lat: number, lng: number) {
    for (let i = 0; i < bookingQueue.length; i++) {
        const booking = bookingQueue[i];
        if (booking.bookingId === bookingId) {
            if (!booking.lat) {
                booking.lat = lat;
            }

            if (!booking.lng) {
                booking.lng = lng;
            }
        }
    }
    reassignBookingToOtherDrivers();
}

export { wss, BookingWS, addBookingToQueue, updateBookingWS };
