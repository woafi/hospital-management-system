import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const TOKEN_EXPIRY = '30d';

// Hash a password using bcrypt
export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

// Verify a password against a hash
export async function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

// Generate an access token
export async function generateAccessToken(user) {

    const userObject = {
        userid: user.id,
        username: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phone,
    };

    return new SignJWT(userObject)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(JWT_SECRET);
}


// Verify an access token
export async function verifyAccessToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}


// Set auth cookies (HttpOnly, Secure, SameSite)
export async function setAuthCookies(accessToken) {
    const cookieStore = await cookies();

    const baseOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    };

    cookieStore.set('accessToken', accessToken, {
        ...baseOptions,
        maxAge: 604800000,
    });

}

// Clear auth cookies (logout)
export async function clearAuthCookies() {
    const cookieStore = await cookies();
    // console.log("woafi")
    cookieStore.delete('accessToken');
}

// Get current user from cookies
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return null;
    }

    const payload = await verifyAccessToken(accessToken);
    return payload;
}


// Get auth tokens from cookies
export async function getAuthTokens() {
    const cookieStore = await cookies();
    return {
        accessToken: cookieStore.get('accessToken')?.value,
    };
}
