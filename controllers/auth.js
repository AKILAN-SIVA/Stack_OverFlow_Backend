import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../models/auth.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User already exist..." });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.status(200).json({ result: newUser, token });
    } catch (error) {
        res.status(500).json("Something went wrong...");
    }
};

export const login = async (req, res) => {
    const { id: _id } = req.params;
    const { email, password, ipAddress, devices } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "No User found..." });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        try {
            const updateLoginDetails = await users.findByIdAndUpdate(_id, {
                $addToSet: { 'loginDetails': [{ ipAddress, devices }] },
            });
            res.status(200).json(updateLoginDetails);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong..." });
    }
};

const updateNoOfLogin = async (_id, noOfLogin) => {
    try {
        await users.findByIdAndUpdate(_id, {
            $set: { 'noOfLogin': noOfLogin },
        });
    } catch (error) {
        console.log(error);
    }
}