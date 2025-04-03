import { sql } from "@vercel/postgres";





/**
 * Route used to get all territories
 */
export async function GET(request) {
  // try getting all territories
  try {

    const { rows: allTerritories } = await sql`SELECT * FROM Territories`;

    return Response.json({data: allTerritories, error: null});
    
  } catch(error) {

    return Response.json({data: null, error: error.message});
  }
}





/**
 * Route used to create a new territory
 */
export async function POST(request) {
  const formData = await request.formData();
  
  // get the territory name as `name`
  const name = formData.get("name");

  // try to add this new territory 
  try {

    const { rows: newTerritory } = await sql`INSERT INTO Territories (name) VALUES (${name}) RETURNING *`;
    
    return Response.json({data: newTerritory, error: null});

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
  // get the territory name as `name`
  const name = formData.get("name");

  // try to update this territory
  try {

    const { rows: updatedTerritory } = await sql`UPDATE Territories SET name = ${name} WHERE territory_id = ${territoryId} RETURNING *`;
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

    const { rows: deletedTerritory } = await sql`DELETE FROM Territories WHERE territory_id = ${territoryId}`;
    return Response.json({data: deletedTerritory, error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }
}

