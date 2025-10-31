export const config = {
    matcher: "/:path*"
  };
  
  export function middleware(req) {
    const res = new Response(null, {
      headers: {
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *;"
      }
    });
    return res;
  }
  