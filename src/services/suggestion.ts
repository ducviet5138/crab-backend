
import OpenAI from "openai";
import axios from "axios";
import { listType } from "@/utils/ListType";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE } from "@/utils/ReturnCode";
let API_KEY = "sk-proj-cJnOuS8iUhxtlsacSd8dT3BlbkFJSIcfcINYtQl0gP8dGxyg";


const openai = new OpenAI({
apiKey: API_KEY
});


class Suggesstion {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    user_ratings_total: number;
    imageUrl: string;
    
    constructor(name: string, address: string, latitude: number, longitude: number, rating: number, user_ratings_total: number, imageUrl: string) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.user_ratings_total = user_ratings_total;
        this.imageUrl = imageUrl;
    }
}

async function getRecommendations(city: string, type: string) {
    try {
        // geocoding
        //https://maps.googleapis.com/maps/api/geocode/json
        let urlGeo = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.API_KEY}`;
        const responseGeo = await axios.get(urlGeo);
        const dataGeo = responseGeo.data;
        const location = dataGeo.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        
     

        if(!type) type= "point_of_interest"
        
        //https://maps.googleapis.com/maps/api/place/nearbysearch/json
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=${type}&key=${process.env.API_KEY}`;
        
        // use axios
        const response = await axios.get(url);
        const data = response.data;
        const results = data.results;
        const df_url_img = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="
        const recommendations = results.map((result: any) => {
            return new Suggesstion(
                result.name,
                result.vicinity,
                result.geometry.location.lat,
                result.geometry.location.lng,
                result.rating,
                result.user_ratings_total,
                result.photos ? df_url_img +  result.photos[0].photo_reference + `&maxwidth=600&key=${process.env.API_KEY}`:  ""
            )
        });
        return recommendations;
    }
    catch(error) {
        console.log(error);
        return [];
    }
}



// app.post("/apii/chat", async (req, res) => {
//     console.log("Chat");

//     let prompt = req.body.prompt;
//     const value = await chatGPT(prompt)
//     console.log(value);
//     res.status(200).json(new BaseResponse(RET_CODE.SUCCESS, true, "Success", value));
// });


// app.post("/chatt", async (req, res) => {
//     let prommpt = req.body.prompt;
//     const messages = [
//         {"role": "user", "content": prommpt}
//     ];

//     let config : any = {
//         model: "gpt-3.5-turbo",
//         messages: messages,
//         max_tokens: 1000
//     }

//     const response = await openai.chat.completions.create(config);
//     res.json(response);
// });

class SuggestionService {
    async chatGPT(prompt: string) {
        try {
            const messages = JSON.parse(prompt);
        const tools = [
            {
                "type": "function",
                "function": {
                    "name": "getRecommendations",
                    "description": "Get recommendations for places to visit in a specific location",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "address": {
                            "type": "string",
                            "description": "Tên thành phố hoặc địa chỉ bạn muốn tìm kiếm"
                            },
                            "type": {
                            "type": "string",
                            "description": "Chứa các loại địa điểm bạn muốn tìm kiếm",
                            "enum": listType
                            }
                        },
                    },
                    "required": ["address"]
                }
            }
        ];
        
        let config : any = {
            model: "gpt-3.5-turbo",
            messages: messages,
            tools: tools,
            tool_choice: "auto",
            max_tokens: 1000
        }
        
        const response = await openai.chat.completions.create(config);
        let recommendations = [];
    
        if(response.choices[0].finish_reason == "tool_calls") {
            const toolCalls = response.choices[0].message.tool_calls;
            const toolCall = toolCalls[0];
            const arg = JSON.parse(toolCall.function.arguments);
            recommendations = await getRecommendations(arg.address, arg.type);
        }
        const message = await openai.chat.completions.create(
            {
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 1000
            }
        );

        return new BaseResponse(RET_CODE.SUCCESS, true, "Success", {
            message: message.choices[0].message.content,
            sentBy: "assistant",
            listSuggestions: recommendations
        });
        
    }
    catch(error) {
        console.log(error);
        return new BaseResponse(RET_CODE.ERROR, false, "Error");
    }
}
}


export default new SuggestionService();