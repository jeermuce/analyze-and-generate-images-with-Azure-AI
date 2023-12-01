/*Add the code to call the Azure AI Vision service Image Analysis 4.0 API to 
your React application as a function 'analyzeImage' in a new separate module, 
that you can name 'azure-image-analysis.js'. Note that you can customize the 
visual features to be returned by the API, by embedding them in the 'features'
query parameter. The function should receive as input the image URL and return 
the JSON response of the API. */
import axios from "axios";

const { REACT_APP_VISION_KEY, REACT_APP_VISION_ENDPOINT } = process.env;

export async function analyzeImage(imageUrl) {
    const features = `read,caption`;
    const population = `computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=${features}`;
    //axios post to endpoint/population with imageUrl and key
    const response = await axios.post(
        `${REACT_APP_VISION_ENDPOINT}/${population}`,
        {
            url: imageUrl,
        },
        {
            headers: {
                "Ocp-Apim-Subscription-Key": REACT_APP_VISION_KEY,
            },
        }
    );
    return response.data;
}
export function isConfigured() {
    return (
        REACT_APP_VISION_KEY !== undefined &&
        REACT_APP_VISION_ENDPOINT !== undefined
    );
}
