import { sql } from "@vercel/postgres";





/**
 * Route used to get all offices
 */
export async function GET(request) {
  // get the `limit` and `offset` query params
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ?? 100;
  const offset = searchParams.get("offset") ?? 0;
  
  // IDEA: get offices object array like this:
  /* [ {
    territory: {id: 2, name_id: "hq", name: "HeadQuaters"},
    complex: {id: 3, name_id: "complex1", name: "Complex 01", director_name: "Mark"},
    id: 1,
    address: "33 Rue Lautard, 13003, Marseille",
    names: ["Office Name 1", "Office Name 2"],
    emails: ["office@email.com", "work@email.com"],
    phonenumbers: ["07070707", "08080808"],
  }, {...}]
  */


  // try getting all offices
  try {

    const { rows: allOffices } = await sql`
    SELECT 
      o.id,
      o.address,
      o.created_at,
      json_build_object('id', t.id, 'name_id', t.name_id, 'name', t.name) as territory,
      json_build_object('id', c.id, 'name_id', c.name_id, 'name', c.name, 'director_name', c.director_name) as complex,
      COALESCE(array_agg(DISTINCT oname.name) FILTER (WHERE oname.name IS NOT NULL), '{}') as names,
      COALESCE(array_agg(DISTINCT oemail.email) FILTER (WHERE oemail.email IS NOT NULL), '{}') as emails,
      COALESCE(array_agg(DISTINCT ophone.phonenumber) FILTER (WHERE ophone.phonenumber IS NOT NULL), '{}') as phonenumbers
    FROM Offices o
    LEFT JOIN Territories t ON o.territory_id = t.id
    LEFT JOIN Complexes c ON o.complex_id = c.id
    LEFT JOIN Offices_names oname ON oname.office_id = o.id
    LEFT JOIN Offices_emails oemail ON oemail.office_id = o.id
    LEFT JOIN Offices_phonenumbers ophone ON ophone.office_id = o.id
    GROUP BY o.id, o.address, o.created_at, t.id, c.id
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
    `;

    // get a total number of offices
    const { rows: totalOffices } = await sql`SELECT COUNT(*) FROM Offices`;
    
    return Response.json({data: allOffices, count: allOffices.length, total: totalOffices[0].count, error: null});
    
  } catch(error) {

    return Response.json({data: null, count: 0, total: 0, error: error.message});
  }
}





/**
 * Route used to create a new office
 */
export async function POST(request) {
  const formData = await request.formData();
  
  const territoryId = formData.get("territory_id");
  const complexId = formData.get("complex_id");
  const address = formData.get("address");

  const names = formData.get("names");
  const emails = formData.get("emails");
  const phonenumbers = formData.get("phonenumbers");


  // lets add the new office to the database ;)

  try {

    const { rows: newOffice } = await sql`
    INSERT INTO Offices (territory_id, complex_id, address) 
    VALUES (${territoryId}, ${complexId}, ${address}) 
    RETURNING *`;

    // get the office id
    const officeId = newOffice[0].id;
    // add the names
    if (names) {
      for (const name of names.split(",")) {
        await sql`INSERT INTO Offices_names (office_id, name) VALUES (${officeId}, ${name})`;
      }
    }
    // add the emails
    if (emails) {
      for (const email of emails.split(",")) {
        await sql`INSERT INTO Offices_emails (office_id, email) VALUES (${officeId}, ${email})`;
      }
    }
    // add the phonenumbers
    if (phonenumbers) {
      for (const phonenumber of phonenumbers.split(",")) {
        await sql`INSERT INTO Offices_phonenumbers (office_id, phone) VALUES (${officeId}, ${phonenumber})`;
      }
    }
    
    return Response.json({data: newOffice, error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }

  
}




/**
 * Route used to update a office
 */
export async function PUT(request) {
  const formData = await request.formData();
  const officeId = formData.get("office_id");
  const address = formData.get("address");
  const territoryId = formData.get("territory_id");
  const complexId = formData.get("complex_id");
  const names = formData.get("names");
  const emails = formData.get("emails");
  const phonenumbers = formData.get("phonenumbers");

  // try to update this office
  try {

    const { rows: updatedOffice } = await sql`
    UPDATE Offices SET address = ${address}, territory_id = ${territoryId}, complex_id = ${complexId}
    WHERE office_id = ${officeId} RETURNING *`;

    if (names) {
      await sql`DELETE FROM Offices_names WHERE office_id = ${officeId}`;
      for (const name of names.split(",")) {
        await sql`INSERT INTO Offices_names (office_id, name) VALUES (${officeId}, ${name})`;
      }
    }
    if (emails) {
      await sql`DELETE FROM Offices_emails WHERE office_id = ${officeId}`;
      for (const email of emails.split(",")) {
        await sql`INSERT INTO Offices_emails (office_id, email) VALUES (${officeId}, ${email})`;
      }
    }
    if (phonenumbers) {
      await sql`DELETE FROM Offices_phonenumbers WHERE office_id = ${officeId}`;
      for (const phonenumber of phonenumbers.split(",")) {
        await sql`INSERT INTO Offices_phonenumbers (office_id, phone) VALUES (${officeId}, ${phonenumber})`;
      }
    }

    return Response.json({data: updatedOffice, error: null});  

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }

}




/**
 * Route used to delete an office using the office id
 */
export async function DELETE(request) {
  const formData = await request.formData();
  const officeId = formData.get("office_id");

  // try to delete this office
  try {

    const { rows: deletedOffice } = await sql`DELETE FROM Offices WHERE id = ${officeId}`;
    return Response.json({data: deletedOffice, error: null});

  } catch (error) {
    return Response.json({data: null, error: error.message});
  }
}

