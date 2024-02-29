// import { sql } from '@vercel/postgres';
// import { decodeJWT } from '@/utils/jwt';

// route to return all the info of the user with a token (aka. moi)
export async function GET(request){
    //const formData = //await request.formData();

    // const userToken = formData.get("userToken");

    const userToken = request.nextUrl.searchParams.get('userToken');
    /*
    const { email, password } = decodeJWT(userToken);

    if (!email || !password){
        return Response.json({data: null, error: "User does not exist!"});
    }

    const { rows: users } = await sql`SELECT * FROM Users WHERE email = ${email}`;

    if (rows.length === 0) {
        return Response.json({data: null, error: "User does not exist!"});
    }


    const meData = {
        ...users[0],
        password: '***',
    }
    
    return Response.json({data: meData, error: null});
    */

    return Response.json({userToken});


}