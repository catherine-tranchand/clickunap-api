import { sql } from "@vercel/postgres";
import { recoverEmailPassword } from "@/utils/jwt"; 



// Handling the OPTIONS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,

    headers: {
      "Access-Control-Allow-Origin": "*", // TEMP: allow all
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Content-Type
      // "Access-Control-Max-Age": "3600", // Temp: 1 hour
    },

  });
}






// route to find the user with an id
/*
export async function POST(request){
    const formData = await request.formData();

    const userId = formData.get("user_id");

    if (!userId){
        return new Response("Error: user not found!", { status: 400 });
    }

    const { rows: me } = await sql`SELECT user_id, first_name, last_name, email, created_at FROM Users WHERE user_id = ${userId}`;
    

    return Response.json({data: me});

}
*/



/**
 * Route to get all the user info using a token
 */
export async function POST(request) {
    
    // Extracting token from Bearer <token> as userToken
    const authHeader = request.headers.get("authorization");
    const userToken = authHeader ? authHeader.split(" ")[1] : "";

    // TEMP: getting the token from the request's form data
    // const formData = await request.formData();
    // const userToken = formData.get("token");

    // const tokenData = request.cookies.get("token");
    // const userToken = tokenData ? tokenData.value : "";

    let payload = {};

    if (userToken.length > 0) {
        // recover the payload (i.e. email and hashed password)
        const { email, password } = recoverEmailPassword(userToken); // <- NOTE: password is hashed

        // get all the user info/data from the database using the email and password
        const { rows: users } = await sql`SELECT * FROM Users WHERE email = ${email} AND password = ${password}`;

        

        if (users.length === 0) {/* TODO: do something if there's no user with this email and password */}
        else {
            const userData = users[0];

            // first_name, last_name, email, password, is_admin, is_manager) VALUES (${first_name}, ${last_name}, ${email}, ${hashedPassword}, ${is_admin}, ${is_manager}) RETURNING *
            payload = {
              user_id: userData.user_id, 
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              is_admin: userData.is_admin,
              is_manager: userData.is_manager
            }
        }
    }

    // GEt the user's email and password from the token #tokenDecryption


    return Response.json({...payload, token: userToken});
}
