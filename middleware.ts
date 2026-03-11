import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
  '/categories(.*)',
  '/search(.*)',
  '/api/webhooks/clerk(.*)', // Allow Clerk webhooks
])

// Public API routes (GET only)
const isPublicApiRoute = createRouteMatcher([
  '/api/products(.*)',
  '/api/reviews(.*)',
  '/api/search(.*)',
  '/api/users/[userId]', // GET user profile is public
])

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return
  }
  
  // Allow GET requests to public API routes
  if (isPublicApiRoute(request) && request.method === 'GET') {
    return
  }
  
  // Protect all other routes
  await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
