import dotenv from 'dotenv';
import { NextRequest, NextResponse } from 'next/server';


dotenv.config();
const baseUrl = process.env.DJANGO_SERVER_URL as string;


export async function GET(req: NextRequest, context: { params: Promise<{ objectid: string }> }) {
    const { objectid } = await context.params;
    const reqUrl = `${baseUrl}lines/${objectid}`;

    try {
        const res = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            // Attempt to parse the error response
            const errorData = await res.json();
            throw new Error(errorData.message || 'HTTP error from django server.');
        }

        const data = await res.json()
        return NextResponse.json(data)
    
    } catch (error) {
        console.error('api/lines/route | GET | Error fetching line data from django server: ', error);
        throw new Error(`api/lines/route | GET | Error fetching line data from django server: ${error}`);
    }
}