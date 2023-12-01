import OpenAI from "openai";
const { REACT_APP_OPEN_AI_KEY } = process.env;

const openai = new OpenAI({
    apiKey: `${REACT_APP_OPEN_AI_KEY}`,
    dangerouslyAllowBrowser: true,
});

export async function generateImage(prompt) {
    const image = await openai.images.generate({
        model: "dall-e-2",
        n: 1,
        prompt: prompt,
    });

    return image.data[0].url;
}

export function isConfigured() {
    return REACT_APP_OPEN_AI_KEY !== undefined;
}
