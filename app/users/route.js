import { sql } from "@vercel/postgres"
import { hashPassword } from "@/utils/bcrypt"; 

// Route to get all users
export async function GET(request){
 const { rows: allUsers } = await sql`SELECT * FROM Users`;
 return Response.json({data: allUsers});
}


export async function DELETE(request){
    const formData = await request.formData();
    const user_id = formData.get("user_id");

    if (!user_id){
        return new Response("User doesn't exist", { status : 400});
    }

    const { rows: deletedUser } = await sql`DELETE user FROM Users WHERE user_id = ${user_id}`

    return Response.json({data: deletedUser});
}




// route to create a new user
export async function POST(request){
    const formData = await request.formData();

    const first_name = formData.get("firstName");
    const last_name = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const role = formData.get("role");

    const is_admin = (role === "admin");
    const is_manager = (role === "manager");

    if (!email || !password){
        return new Response("Your email or password invalid", { status: 400 });
    }

    const passwordHash = hashPassword(password);


    const { rows: newUser } = await sql`INSERT INTO Users (first_name, last_name, email, password, is_admin, is_manager) VALUES (${first_name}, ${last_name}, ${email}, ${passwordHash}, ${is_admin}, ${is_manager}) RETURNING *`;

    return Response.json({data: newUser});

}