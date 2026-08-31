import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // 1. Extract uploaded file from the incoming client request
    const clientFormData = await request.formData();
    const uploadedFile = clientFormData.get('file') || clientFormData.get('image');

    if (!uploadedFile || !(uploadedFile instanceof File)) {
      return NextResponse.json(
        { error: 'No image file found in payload. Please upload a valid image file.' },
        { status: 400 }
      );
    }

    // 2. Fetch configured backend link from environmental settings
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
    console.log(`[API PROXY] Routing leaf diagnosis request to backend: ${backendUrl}/predict`);

    // 3. Assemble server-side FormData for Flask
    const backendFormData = new FormData();
    // Convert client File to Blob to feed native Node-fetch
    const fileBuffer = await uploadedFile.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: uploadedFile.type });
    backendFormData.append('file', fileBlob, uploadedFile.name);

    // 4. Extract authorization header to pass user credentials down to Flask
    const authHeader = request.headers.get('Authorization') || '';

    // 5. Send request to Flask engine
    const backendResponse = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      // Increase timeout bounds for larger image processing
      signal: AbortSignal.timeout(15000), 
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('[API PROXY] Backend responded with error:', errorText);
      return NextResponse.json(
        { error: `Inference model returned an operational error: ${backendResponse.status} ${backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    // 5. Parse and post-process Flask response
    const data = await backendResponse.json();

    // Smart URL Refactor: Replace hardcoded 127.0.0.1 link with configured BACKEND_URL
    if (data.gradcam_image && typeof data.gradcam_image === 'string' && data.gradcam_image.includes('127.0.0.1:5000')) {
      data.gradcam_image = data.gradcam_image.replace('http://127.0.0.1:5000', backendUrl);
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[API PROXY] Critical error during bridge query:', error);

    // Provide a premium, clear developer-level helper in case backend is offline
    if (error.name === 'TimeoutError' || error.message?.includes('fetch failed')) {
      return NextResponse.json(
        { 
          error: 'The Tea Disease AI Backend is currently unreachable.', 
          details: 'Please ensure that your Flask backend server is active by running "python app.py" inside your backend directory, and check that the ".env" file is referencing the correct port address (Default: http://127.0.0.1:5000).'
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected internal gateway exception occurred.', details: error.message },
      { status: 500 }
    );
  }
}
