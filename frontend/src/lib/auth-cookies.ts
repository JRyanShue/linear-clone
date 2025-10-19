/**
 * Sets the authentication session cookie with the Firebase ID token
 * Call this after successful Firebase authentication
 */
export async function setAuthCookie(idToken: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      console.error('Failed to set auth cookie:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return false;
  }
}

/**
 * Clears the authentication session cookie
 * Call this when the user signs out
 */
export async function clearAuthCookie(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Failed to clear auth cookie:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
    return false;
  }
}
