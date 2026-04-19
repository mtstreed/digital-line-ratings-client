import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.TRANSMISSION_LINES_BASE_URL as string;

const ALLOWED_PARAMS = ['where', 'outFields', 'outSR', 'f', 'resultOffset', 'resultRecordCount', 'geometryType', 'geometry'];

// This GET request takes dynamic query params to allow for pagination, geographic bounds, etc.
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const upstream = new URLSearchParams();
    for (const key of ALLOWED_PARAMS) {
        const val = searchParams.get(key);
        if (val !== null) upstream.set(key, val);
    }
    const reqUrl = `${baseUrl}?${upstream.toString()}`;

    try {
        const res = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'HTTP error from API.');
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('api/lines/route | GET | Error fetching line data from API: ', error);
        return NextResponse.json({ message: `Error fetching line data from API: ${error}` }, { status: 500 });
    }
}
