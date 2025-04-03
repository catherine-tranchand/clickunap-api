import { sql } from "@vercel/postgres"
import { hashPassword } from "@/utils/bcrypt"; 



/**
 * Route used to get all managers 
 */
export async function GET(request){
  // get the `limit` & `offset` query params
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  
  
  // get all the managers
  // create the query
  let query = `SELECT * FROM Users WHERE is_manager = true`;
  // if `limit` is provided 
  if (limit > 0) { query += ` LIMIT ${limit}` };
  // if `limit` & `offset` are provided 
  if (offset > 0) { query += ` OFFSET ${offset}`};
  

  // get all the managers
  const { rows: allManagers } = await sql`${query}`;
  
  // get the total number of managers
  const { rows: totalManagers } = await sql`SELECT COUNT(*) FROM Users WHERE is_manager = true`;


  return Response.json({data: allManagers, count: allManagers.length, total: totalManagers[0].count, error: null});
}











/**
 * Route used to delete a manager using its id
 */
export async function DELETE(request){
  const formData = await request.formData();
  const userId = formData.get("user_id");

  if (!userId){
      return new Response("Please provide a valid manager id", { status : 400});
  }

  const { rows: deletedManager } = await sql`DELETE FROM Users WHERE user_id = ${userId}`

  return Response.json({data: deletedUser, error: null});
}










/**
 * Route used to create a new manager
 */
export async function POST(request){
    const formData = await request.formData();

    const first_name = formData.get("firstName");
    const last_name = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    
    // const role = formData.get("role");
    const is_admin = false;
    const is_manager = true;

    if (password !== confirmPassword) {
        return Response.json({data: null, error: "Your password do not match"});
    }


    if (!email || !password){
        return Response.json({data: null, error: "Your email or password invalid"});
    }

    const hashedPassword = await hashPassword(password);


    const { rows: newManager } = await sql`INSERT INTO Users (first_name, last_name, email, password, is_admin, is_manager) VALUES (${first_name}, ${last_name}, ${email}, ${hashedPassword}, ${is_admin}, ${is_manager}) RETURNING *`;
    
    return Response.json({data: newManager, error: null});

}
