import { NextResponse } from 'next/server';
import { revokeSessionToken } from '@/lib/security/auth-service';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('pvip_admin_session='));

    if (sessionCookie) {
      const token = sessionCookie.split('=')[1]?.trim();
      if (token) {
        revokeSessionToken(token);
      }
    }

    const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente.' });
    response.cookies.delete('pvip_admin_session');
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('pvip_admin_session');
    return response;
  }
}
