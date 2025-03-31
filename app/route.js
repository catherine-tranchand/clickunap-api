
export async function GET(request) {
  return new Response("Welcome to Clickunap API 0.1.2 - Copyright (c) 2025");

  /*
    return new Response("welcome to clickunap API", {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
    })
  */
}
