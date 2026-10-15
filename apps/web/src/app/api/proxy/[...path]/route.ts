import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api/v1';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const endpoint = path.join('/');
  const search = req.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/${endpoint}${search}`;

  const forwardHeaders = new Headers();
  forwardHeaders.set('Content-Type', req.headers.get('content-type') || 'application/json');

  // Read httpOnly cookie or incoming Authorization header
  const authCookie = req.cookies.get('pc_at')?.value;
  const incomingAuth = req.headers.get('authorization');
  if (authCookie) {
    forwardHeaders.set('Authorization', `Bearer ${authCookie}`);
  } else if (incomingAuth) {
    forwardHeaders.set('Authorization', incomingAuth);
  }

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      cache: 'no-store',
    });

    const data = await backendRes.text();
    const clientRes = new NextResponse(data, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('content-type') || 'application/json',
      },
    });

    // Handle Auth Endpoints: set httpOnly session cookies
    if (backendRes.ok && (endpoint.includes('auth/login') || endpoint.includes('auth/google') || endpoint.includes('auth/register'))) {
      try {
        const parsed = JSON.parse(data);
        const tokens = parsed.data || parsed;
        if (tokens.accessToken) {
          clientRes.cookies.set('pc_at', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60, // 15 mins
          });
        }
        if (tokens.refreshToken) {
          clientRes.cookies.set('pc_rt', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });
        }
      } catch (parseErr: any) {
        console.warn('[BFF Proxy] Non-JSON auth response from backend:', parseErr.message);
      }
    }

    // Handle Logout
    if (endpoint.includes('auth/logout')) {
      clientRes.cookies.delete('pc_at');
      clientRes.cookies.delete('pc_rt');
    }

    return clientRes;
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'BFF Gateway: Backend service unreachable',
        error: err.message,
      },
      { status: 502 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
