# CRAB BACKEND

Đây là server hỗ trợ cho việc đặt xe của ứng dụng và web app Crab.

## Folder structure

```
.
├── my_bucket
├── src
│ ├── class
│ │ ├── strategy
│ │ │ ├── fees
│ │ │ ├── payments
│ │ │ │ ├── CardStrategy.ts
│ │ │ │ └── CashStrategy.ts
│ │ │ ├── BikeEconomyStrategy.ts
│ │ │ ├── BikeStrategy.ts
│ │ │ ├── CarEconomyStrategy.ts
│ │ │ └── CarStrategy.ts
│ │ ├── FeeDriving.ts
│ │ ├── FeeManager.ts
│ │ ├── IFeeStrategy.ts
│ │ ├── IPaymentStrategy.ts
│ │ └── PaymentFactory.ts
│ ├── entities
│ │ ├── booking_info.ts
│ │ ├── booking.ts
│ │ ├── bucket.ts
│ │ ├── index.ts
│ │ ├── location_record.ts
│ │ ├── notification_token.ts
│ │ ├── payment_method.ts
│ │ ├── rating.ts
│ │ ├── transaction.ts
│ │ ├── user.ts
│ │ ├── vehicle.ts
│ │ └── wallet.ts
│ ├── routes
│ │ ├── api
│ │ │ ├── accounts.ts
│ │ │ ├── booking-infos.ts
│ │ │ ├── bookings.ts
│ │ │ ├── drivers.ts
│ │ │ ├── fee.ts
│ │ │ ├── files.ts
│ │ │ ├── firebase.ts
│ │ │ ├── index.ts
│ │ │ ├── location-records.ts
│ │ │ ├── notification.ts
│ │ │ ├── staff.ts
│ │ │ ├── suggestions.ts
│ │ │ └── wallets.ts
│ │ └── index.ts
│ ├── services
│ │ ├── accounts.ts
│ │ ├── booking-infos.ts
│ │ ├── bookings.ts
│ │ ├── fee.ts
│ │ ├── location-records.ts
│ │ ├── multer.ts
│ │ ├── notification.ts
│ │ ├── suggestion.ts
│ │ └── wallet.ts
│ ├── utils
│ │ ├── BaseResponse.ts
│ │ ├── CoordinateConverter.ts
│ │ ├── GenerateJWTToken.ts
│ │ ├── GenerateTrans.ts
│ │ ├── HashPassword.ts
│ │ ├── ListType.ts
│ │ ├── ObjectIdConverter.ts
│ │ ├── ReturnCode.ts
│ │ └── TripStatus.ts
│ ├── app-data-src.ts
│ └── app.ts
├── firebase-config.json
├── nodemon.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Yêu cầu môi trường

-   Node.JS: 21.6.2
-   **.env**:

```
JWT_SECRET=AAA
API_KEY=BBB
API_AI_KEY=CCC
```

AAA là JWT_SECRET tự chọn \
BBB là Google Map API key \
CCC là ChatGPT API Key

-   **firebase-config.json**: File config được lấy từ Firebase.
-   Database:
    -   Tạo database có tên **crab** ở máy chủ hiện tại.
    -   Hoặc có thể đổi uri connection string ở **/src/app-data-src.ts**.

## Chạy server:

```bash
npm start
```
