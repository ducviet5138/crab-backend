export default function coordinateConverter(location: { lat: number, long: number }): { type: "Point"; coordinates: number[] }{
    return {
        type: "Point",
        coordinates: [location.long, location.lat]
    };
}