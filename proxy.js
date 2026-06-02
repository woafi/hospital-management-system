import { NextResponse } from 'next/server';
import { jwtVerify } from "jose";
import { getRoleHome } from "@/lib/getRoleHome" 

const publicPaths = ['/'];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
    const { pathname } = req.nextUrl;

    // ✅ Allow static files & public APIs
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/public') ||
        pathname.includes('.') // static files
    ) {
        return NextResponse.next();
    }

    // ✅ Check if public path
    const isPublicPath = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    // ✅ Get token
    const token = req.cookies.get('accessToken')?.value;

    // =========================
    // 🔓 PUBLIC PATH HANDLING
    // =========================
    if (isPublicPath) {
        if (!token) return NextResponse.next();

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            const redirectUrl = getRoleHome(payload);
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        } catch {
            return NextResponse.next();
        }
    }

    // =========================
    // 🔒 PROTECTED ROUTES
    // =========================
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // =========================
        // 🎯 RBAC CONFIG
        // =========================
        const roleRoutes = {
            '/dashboard': ['SUPER_ADMIN', 'ADMIN'],
            '/doctor': ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'],
            '/receptionist': ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'],
            '/api/receptiondashboard': ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'],
        };

        // =========================
        // ✅ RBAC CHECK
        // =========================
        for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
            if (pathname.startsWith(route)) {
                if (!allowedRoles.includes(payload.role)) {
                    return NextResponse.redirect(
                        new URL(getRoleHome(payload), req.url)
                    );
                }
                break;
            }
        }

        // =========================
        // 🔐 OWNERSHIP CHECK
        // =========================

        const pathParts = pathname.split('/');
        
        // Doctor route protection
        if (pathname.startsWith('/doctor')) {
            const doctorId = pathParts[2];

            if (
                payload.role === 'DOCTOR' &&
                payload.userid !== doctorId
            ) {
                return NextResponse.redirect(
                    new URL(`/doctor/${payload.userid}/dashboard`, req.url)
                );
            }
        }

        // Receptionist route protection
        if (pathname.startsWith('/receptionist')) {
            const receptionistId = pathParts[2];

            if (
                payload.role === 'RECEPTIONIST' &&
                payload.userid !== receptionistId
            ) {
                return NextResponse.redirect(
                    new URL(`/receptionist/${payload.userid}/dashboard`, req.url)
                );
            }
        }

        return NextResponse.next();

    } catch (error) {
        // ❌ Invalid token
        return NextResponse.redirect(new URL('/', req.url));
    }
}

// =========================
// ⚙️ MATCHER CONFIG
// =========================
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};