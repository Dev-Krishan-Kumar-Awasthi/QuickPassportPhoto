import { NextResponse } from 'next/server';

/**
 * SERVER-SIDE Background Removal API 
 * This route acts as a proxy to keep API keys hidden.
 * Note: Photoroom API key required in .env.local
 */
export async function POST(req: Request) {
  try {
    const { image } = await req.json(); // dataURL
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.PHOTOROOM_API_KEY;
    
    // FALLBACK: If no API key is provided, we return an error or log it.
    // In production, users should provide a key.
    if (!apiKey) {
      console.warn('PHOTOROOM_API_KEY is missing. Background removal will fail.');
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    // Convert dataURL to Buffer/Blob for API
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    formData.append('image_file', new Blob([buffer], { type: 'image/png' }));
    
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Photoroom API error: ${errorText}` }, { status: response.status });
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    
    return NextResponse.json({ 
      image: `data:image/png;base64,${resultBase64}` 
    });

  } catch (error: any) {
    console.error('Background removal route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
