
import { User } from "../models/User";
import {hashPassword, randomToken, verifyPassword} from "../utils/crypto"
import { generateJWT } from "../utils/jwt";
import { ServerError } from "../utils/response";



export const register = async (email: string, password: string, confirmpassword: string, name?: string) => {
    
    // check email exists 
    const exists = await User.findOne({ email });
    if (exists) throw new ServerError(400, "email already exists");

    // check password match
    if (password !== confirmpassword) throw new ServerError(400, "passwords not match");
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = new User({
        email,
        password: hashedPassword,
        name: name || email.split('@')[0]
    });
    
    await user.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateJWT(user._id, email)
    
    return { user, accessToken, refreshToken };
};


export const login = async (email: string, password: string) => {
    // check email exists 
    const foundUser = await User.findOne({email});
    if (!foundUser) throw new ServerError(404, 'email not found');

    // check exists founded users password 
    if (!foundUser.password) {
        throw new ServerError(500, 'user password is missing');
    }
    // check password is correct
    const isPasswordValid = await verifyPassword(foundUser.password, password);
    if (!isPasswordValid) {
        throw new ServerError(401, 'invalid password');
    }

    return await generateJWT(foundUser._id, foundUser.email)
}