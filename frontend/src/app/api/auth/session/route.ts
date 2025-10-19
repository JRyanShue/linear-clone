import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Set the session cookie
    // Using httpOnly for security, secure in production
    const cookieStore = await cookies();
    cookieStore.set('__session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: '/',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error setting session cookie:', error);
    return NextResponse.json(
      { error: 'Failed to set session cookie' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete('__session');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session cookie:', error);
    return NextResponse.json(
      { error: 'Failed to delete session cookie' },
      { status: 500 }
    );
  }
}
