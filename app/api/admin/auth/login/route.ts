import { NextResponse } from 'next/server';
import { authenticateUser, createSessionToken } from '@/lib/security/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa tu email y contraseña.' },
        { status: 400 }
      );
    }

    // 1. Authenticate user against SQLite database
    const user = authenticateUser(email, password);

    // 2. Create 24h session token in SQLite database
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const session = createSessionToken(user.id, ipAddress, userAgent);

    // 3. Prepare response with Secure HTTP-Only Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: 'pvip_admin_session',
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error al iniciar sesión.' },
      { status: 401 }
    );
  }
}
