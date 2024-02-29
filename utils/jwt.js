import jwt from "jsonwebtoken";

export const generateJWT = (email, password, expiresIn = "30 days") => {

    const payload = {email, password};

    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretKey, {expiresIn});

    return token;

}

// function to decode the given user token ('skflskfjslfkl34543434rsefs$')
// returns eg. { email: 'kdsjfl', password: '...'}
export const decodeJWT = (userToken) => {
    return jwt.decode(userToken);
}
