

// route to login an user
// GOAL: http://localhost:3000/auth/login?email=ekaterina.tranchand@gmail.com&password=mama
export async function GET(request){
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");


    if (!email || !password){
        return new Response("Authentification failed! Please check your email and/or password", { status: 400 });
    }

    const { rows: user } = await sql`SELECT user_id, first_name, last_name, email, created_at FROM Users WHERE email = '${email}' AND password = '${password}'`;
    

    return Response.json({data: user});

}