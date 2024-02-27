import bcrypt from "bcrypt";


const SALT_ROUNDS = 12; //For security reasons we hash the password in 12 rounds.

export const hashPassword = async (password) => {

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const result = await bcrypt.hash(password, salt);

    return result;
}


export const verifyPassword = async (password, hashedPassword) => {

    const result = await bcrypt.compare(password, hashedPassword);

    return result;
}
