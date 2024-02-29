import jwt from "jsonwebtoken";

export const generateJWT = (email, password, expiresIn = "30 days") => {

    const payload = {email, password};

    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretKey, {expiresIn});

    return token;

}
