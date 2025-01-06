// import type { NextApiRequest, NextResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";




const data = {
    contents: [{
        parts: [{ text: "give me a finance quote in 1 line" }]
    }]
};

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const apiKey = process.env.GEMINI_API;
        const url = process.env.GEMINI_URL;
        // console.log(apiKey);
        if (!url) {
            throw new Error('GEMINI_URL is not defined');
        }
        const finalurl = url + apiKey;

        const response = await fetch(finalurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const quote = result.candidates[0].content.parts[0].text;
        return NextResponse.json({ status: 200, body: quote });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ status: 500, error: 'Failed to fetch quote' });
    }
}