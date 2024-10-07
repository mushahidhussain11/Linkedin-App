import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
export const signup  = async (req,res)=>{
    try {
        const {name,username,email,password} = req.body;

        if(!name || !username || !email || !password){
            res.status(400).json({message:"All fields are required"})
        }
        const existingEmail  = await User.findOne({email})

        if(existingEmail){
            return res.status(400).json({message:"Email already exists"});
        }

        const exisitngUsername = await User.findOne({username});

        if(exisitngUsername){
            return res.status(400).json({message:"Username already exists"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User ({
            name,
            email,
            password:hashedPassword,
            username
        })

        await user.save();

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

        res.cookie("jwt-linkedin",token,{
            httpOnly:true,
            maxAge:3 * 24 * 60 * 60,
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production"
        })

        res.status(201).json({message:"User created successfully"})

        // sending welcome email
        const profileUrl = process.env.CLIENT_URL+"/profile/"+user.username;

        try {

            await sendWelcomeEmail(user.email,user.name,profileUrl)

        }catch (emailError){
            console.error("Error sending welcome email", emailError)
        }

    }catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log("Error in signup controller ",error.message)
    }
}

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Create and send token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		await res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	res.clearCookie("jwt-linkedin");
	res.json({ message: "Logged out successfully" });
};







 