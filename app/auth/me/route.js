

// route to find the user with an id
export async function POST(request){
    const formData = await request.formData();

    const userId = formData.get("user_id");

    if (!userId){
        return new Response("Error: user not found!", { status: 400 });
    }

    const { rows: me } = await sql`SELECT user_id, first_name, last_name, email, created_at FROM Users WHERE user_id = ${userId}`;
    

    return Response.json({data: me});

}