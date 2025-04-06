import { sql } from "@vercel/postgres";





/**
 * Route used to search for territories using the `name_id` by default
 * example: https://clickunap-api.vercel.app/territories/search?name_id=hq
 */
export async function GET(request) {
  // get the `name_id` query params as `nameId`
  const { searchParams } = new URL(request.url);
  const nameId = searchParams.get("name_id");
  

  // try finding all territories with this `nameId`
  try {

    const { rows: foundTerritories } = await sql`SELECT * FROM Territories WHERE name_id = ${nameId}`;
    
    // get the total number of territories
    const { rows: totalTerritories } = await sql`SELECT COUNT(*) FROM Territories`;


    return Response.json({data: foundTerritories, count: foundTerritories.length, total: totalTerritories[0].count, error: null});
    
  } catch(error) {

    return Response.json({data: null, error: error.message});
  }
}




