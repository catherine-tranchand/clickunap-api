import jwt from "jsonwebtoken";

export const generateJWT = (email, password, expiresIn = "30 days") => {

    const payload = {email, password};

    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretKey, {expiresIn});

    return token;

}


// TODO: Create a checkJWT function


// Function to recover the user's email and password from the given token
export const recoverEmailPassword = (token) => {
    const decodedPaylod = jwt.decode(token);

    const { email, password } = decodedPaylod;

    return {email, password};
}