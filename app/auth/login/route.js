import { sql } from "@vercel/postgres"
import { verifyPassword } from "@/utils/bcrypt"; 
import { generateJWT } from "@/utils/jwt"; 
// import { cookies } from "next/headers";





// route to login an user
// GOAL: http://localhost:3000/auth/login?email=ekaterina.tranchand@gmail.com&password=mama
export async function POST(request){
    // create a cookie store
    // const cookieStore = await cookies();

    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");


    if (!email || !password){
        //return new Response("Authentification failed! Please check your email and/or password", { status: 400 });
        return Response.json({data: null, error: "Authentification failed! Please check your email and/or password"});
    }

    const { rows: users } = await sql`SELECT * FROM Users WHERE email = ${email}`;



    if (users.length === 0){
        return Response.json({data: null, error: "User does not exist"});
    }
    

    const user = users[0];
    const hashedPassword = user.password;

    const passwordVerified = await verifyPassword(password, hashedPassword);

    if (!passwordVerified) {
        return Response.json({data: null, error: "Your email or password incorrect"});
    }




    const token = generateJWT(email, hashedPassword);

    const data = {
        ...user,
        password: "@@@",
        token, 
    }

    // store the token in a cookie
    // cookieStore.set("token", token);

    return Response.json({data, error: null});

}
