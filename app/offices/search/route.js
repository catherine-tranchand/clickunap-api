import { sql } from "@vercel/postgres";





/**
 * Route used to search for offices using the `address` by default
 * example: https://clickunap-api.vercel.app/offices/search?address=marseille
 */
export async function GET(request) {
  // get the `address` query params as `address`
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address") ?? "";
  const offset = searchParams.get("offset") ?? 0;
  const limit = searchParams.get("limit") ?? 50;
  const orderBy = searchParams.get("order_by") ?? "desc";

  const complexId = searchParams.get("complex_id") ?? null;
  const territoryId = searchParams.get("territory_id") ?? null;

  
  let responseData = {};

  if (territoryId && complexId && address) {
    responseData = await search("territory_complex_address");
    
  }else if (territoryId && complexId) {
    responseData = await search("territory_complex");

  }else if (territoryId) {
    responseData = await search("territory");

  } else if (complexId) {
    responseData = await search("complex");

  } else {
    responseData = await search("address");
  }
  
  
  

  return Response.json(responseData);


  







  async function search(type) {

    // try finding all offices that have all or part of the `type` given 
    try {

      const { rows: foundOffices } = await getSqlQuery(type); 

      // get the total number of offices
      const { rows: totalOffices } = await getSqlCountQuery(type);

      return { data: foundOffices, count: foundOffices.length, total: totalOffices[0].count, error: null };
      
    } catch(error) {

      return { data: null, error: error.message };
    }

  }

  
  


  function getSqlCountQuery(type) {
    switch (type) {
      case "territory":
        return sql`SELECT COUNT(*) FROM Offices WHERE territory_id = ${territoryId}`;

      case "complex":
        return sql`SELECT COUNT(*) FROM Offices WHERE complex_id = ${complexId}`;

      case "territory_complex":
        return sql`SELECT COUNT(*) FROM Offices WHERE territory_id = ${territoryId} AND complex_id = ${complexId}`;

      case "territory_complex_address":
        return sql`SELECT COUNT(*) FROM Offices WHERE territory_id = ${territoryId} AND complex_id = ${complexId} AND address ILIKE ${address}`;

      default:
        return sql`SELECT COUNT(*) FROM Offices WHERE address ILIKE ${address}`;

    }
  }



  function getSqlQuery(type) {

    switch (type) {
      case "territory":
        return sql`
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
        WHERE o.territory_id = ${territoryId} 
        GROUP BY o.id, o.address, o.created_at, t.id, c.id
        ORDER BY o.created_at ${orderBy}
        LIMIT ${limit} OFFSET ${offset}`;

      case "complex":
        return sql`
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
        WHERE o.complex_id = ${complexId} 
        GROUP BY o.id, o.address, o.created_at, t.id, c.id
        ORDER BY o.created_at ${orderBy}
        LIMIT ${limit} OFFSET ${offset}`;

      case "territory_complex":
        return sql`
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
        WHERE o.territory_id = ${territoryId} AND o.complex_id = ${complexId} 
        GROUP BY o.id, o.address, o.created_at, t.id, c.id
        ORDER BY o.created_at ${orderBy}
        LIMIT ${limit} OFFSET ${offset}`;

      case "territory_complex_address":
        return sql`
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
        WHERE o.territory_id = ${territoryId} AND o.complex_id = ${complexId} AND o.address ILIKE ${address}
        GROUP BY o.id, o.address, o.created_at, t.id, c.id
        ORDER BY o.created_at ${orderBy}
        LIMIT ${limit} OFFSET ${offset}`;

      default:
        return sql`
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
        WHERE address ILIKE ${address}
        GROUP BY o.id, o.address, o.created_at, t.id, c.id
        ORDER BY o.created_at DESC
        LIMIT ${limit} OFFSET ${offset}`;
    }

  }




}




