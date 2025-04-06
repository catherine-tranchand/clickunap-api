import { sql } from "@vercel/postgres";





/**
 * Route used to search for complexes using the `name_id` by default
 * example: https://clickunap-api.vercel.app/complexes/search?name_id=hq
 */
export async function GET(request) {
  // get the `name_id` query params as `nameId`
  const { searchParams } = new URL(request.url);
  const nameId = searchParams.get("name_id");
  

  // try finding all complexes with this `nameId`
  try {

    const { rows: foundComplexes } = await sql`SELECT * FROM Complexes WHERE name_id = ${nameId}`;
    
    // get the total number of complexes
    const { rows: totalComplexes } = await sql`SELECT COUNT(*) FROM Complexes`;


    return Response.json({data: foundComplexes, count: foundComplexes.length, total: totalComplexes[0].count, error: null});
    
  } catch(error) {

    return Response.json({data: null, error: error.message});
  }
}




