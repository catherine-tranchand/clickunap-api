import { sql } from "@vercel/postgres";





/**
 * Route used to get all complexes
 */
export async function GET(request) {
  // try getting all complexes
  try {

    const { rows: allComplexes } = await sql`SELECT * FROM Complexes`;

    return Response.json({data: allComplexes, error: null});
    
  } catch(error) {

    return Response.json({data: null, error: error.message});
  }
}





/**
 * Route used to create a new complex
 */
export async function POST(request) {
  const formData = await request.formData();
  
  // get the complex name as `name`
  const name = formData.get("name");
  const nameId = formData.get("name_id");

  // try to add this new complex 
  try {

    const { rows: newTerritory } = await sql`INSERT INTO Complexes (name, name_id) VALUES (${name}, ${nameId}) RETURNING *`;
    
    return Response.json({data: newTerritory, error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }

  
}




/**
 * Route used to update a complex
 */
export async function PUT(request) {
  const formData = await request.formData();
  // get the id of the complex
  const complexId = formData.get("complex_id");
  // get the complex name as `name`
  const name = formData.get("name");
  // get the complexe nameId
  const nameId = formData.get("name_id");

  // try to update this complex
  try {

    const { rows: updatedTerritory } = await sql`UPDATE Complexes SET name = ${name}, name_id = ${nameId} WHERE complex_id = ${complexId} RETURNING *`;
    return Response.json({data: updatedTerritory, error: null});  

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }

}




/**
 * Route used to delete a complex
 */
export async function DELETE(request) {
  const formData = await request.formData();
  const complexId = formData.get("complex_id");

  // try to delete this complex
  try {

    const { rows: deletedTerritory } = await sql`DELETE FROM Complexes WHERE complex_id = ${complexId}`;
    return Response.json({data: deletedTerritory, error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }
}

