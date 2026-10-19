import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export interface GoogleProfile {
  email: string;
  name?: string;
  googleId: string;
  avatarUrl?: string;
}

export async function fetchGoogleProfile(dto: {
  credential?: string;
  code?: string;
  redirectUri?: string;
}): Promise<GoogleProfile> {
  if (dto.credential) {
    const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${dto.credential}`);
    if (!resp.ok) {
      throw new UnauthorizedException('Invalid or expired Google credential');
    }
    const data = await resp.json();
    return {
      email: data.email,
      name: data.name,
      googleId: data.sub,
      avatarUrl: data.picture,
    };
  }

  if (dto.code) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = dto.redirectUri || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/login';

    if (!clientId || !clientSecret) {
      throw new BadRequestException('Google OAuth is not configured on the server');
    }

    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: dto.code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      throw new UnauthorizedException(tokenJson.error_description || tokenJson.error || 'Failed to verify Google code');
    }

    const userResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });

    if (!userResp.ok) {
      throw new UnauthorizedException('Failed to retrieve user profile from Google');
    }

    const userData = await userResp.json();
    return {
      email: userData.email,
      name: userData.name,
      googleId: userData.sub,
      avatarUrl: userData.picture,
    };
  }

  throw new BadRequestException('Google authentication requires a valid Google credential or authorization code');
}
