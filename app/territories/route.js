import { sql } from "@vercel/postgres";





/**
 * Route used to get all territories
 * NOTE: This route returns the first 10 territories by default.
 */
export async function GET(request) {
  // get the `limit` & `offset` query params
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ?? 10;
  const offset = searchParams.get("offset") ?? 0;

  // try getting all territories
  try {

    const { rows: allTerritories } = await sql`SELECT * FROM Territories LIMIT ${limit} OFFSET ${offset}`;
    
    // get the total number of territories
    const { rows: totalTerritories } = await sql`SELECT COUNT(*) FROM Territories`;


    return Response.json({data: allTerritories, count: allTerritories.length, total: parseInt(totalTerritories[0].count), error: null});
    
  } catch(error) {

    return Response.json({data: null, error: error.message});
  }
}





/**
 * Route used to create a new territory
 */
export async function POST(request) {
  const formData = await request.formData();
  
  // get the territory name id and name as `nameId` and `name` respectively
  const nameId = formData.get("name_id");
  const name = formData.get("name");

  // try to add this new territory 
  try {

    const { rows: newTerritory } = await sql`INSERT INTO Territories (name_id, name) VALUES (${nameId}, ${name}) RETURNING *`;
    
    return Response.json({data: newTerritory[0], error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }

  
}




/**
 * Route used to update a territory
 */
export async function PUT(request) {
  const formData = await request.formData();
  // get the id of the territory
  const territoryId = formData.get("territory_id");
  // get the territory nameId and name
  const nameId = formData.get("name_id");
  const name = formData.get("name");

  // try to update this territory
  try {

    const { rows: updatedTerritory } = await sql`UPDATE Territories SET name = ${name}, name_id = ${nameId} WHERE id = ${territoryId} RETURNING *`;
    return Response.json({data: updatedTerritory, error: null});  

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }

}




/**
 * Route used to delete a territory
 */
export async function DELETE(request) {
  const formData = await request.formData();
  const territoryId = formData.get("territory_id");

  // try to delete this territory
  try {

    const { rows: deletedTerritory } = await sql`DELETE FROM Territories WHERE id = ${territoryId}`;
    return Response.json({data: deletedTerritory, error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }
}

