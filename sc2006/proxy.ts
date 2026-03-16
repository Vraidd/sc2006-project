import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/utils';

// Public routes that don't need authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/',
  '/login',
  '/register',
  '/about',
  '/pricing',
  '/signin',
  '/signup'
];

// Role-based route protection
const roleRoutes: Record<string, string[]> = {
  '/api/admin': ['ADMIN'],
  '/api/caregiver': ['CAREGIVER', 'ADMIN'],
  '/admin': ['ADMIN'],
  '/caregiver': ['CAREGIVER', 'ADMIN'],
  '/owner': ['PET_OWNER'],
};

export async function proxy(request: NextRequest) {  // ← Make async!
  const pathname = request.nextUrl.pathname;
  console.log('pathname:', pathname);           // ← Add this
  // Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  // No access token - handle as before
  if (!accessToken) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify access token
  let payload;
  try {
    payload = verifyToken(accessToken, process.env.JWT_SECRET!);
  } catch (error: any) {
    // Token expired or invalid → Try refresh
    if (refreshToken && (error.name === 'TokenExpiredError' || !payload)) {
      try {
        // Call your refresh endpoint
        const origin = request.nextUrl.origin;
        const refreshResponse = await fetch(`${origin}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Cookie': `refresh_token=${refreshToken}`
          }
        });
        
        if (refreshResponse.ok) {
          // Refresh successful → Forward new cookies + continue
          const response = NextResponse.next();
          
          // Copy refreshed cookies from refresh response
          const newCookies = refreshResponse.headers.get('set-cookie');
          if (newCookies) {
            const cookiePairs = newCookies.split(',');
            cookiePairs.forEach(cookie => {
              const [name] = cookie.trim().split('=');
              if (name === 'access_token' || name === 'refresh_token') {
                response.cookies.set(name.trim(), '', { path: '/' });
              }
            });
          }
          
          return response;
        }
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
      }
    }
    
    // Refresh failed or no refresh token → Clear and redirect
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user');
    return response;
  }
  
  if (!payload || typeof payload === 'string') {
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user');
    return response;
  }
  
  // Check role-based access (unchanged)
  for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(payload.role)) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        
        const dashboardUrl = new URL(
          payload.role === 'CAREGIVER' ? '/caregiver' : '/owner',
          request.url
        );
        return NextResponse.redirect(dashboardUrl);
      }
      break;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|/).*)',
    '/owner/:path*',
    '/caregiver/:path*'
  ],
};

