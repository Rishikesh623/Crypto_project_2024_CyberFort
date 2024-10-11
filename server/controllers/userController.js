const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); // user modal 

// secret key for JWT
const JWT_SECRET = 'your_jwt_secret';

const register = async (req, res) => {
    

    try {
        const { name, email, password } = req.body;
        //check if the user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // create a new user
        user = new userModel({ name, email, password });
        await user.save();

        // generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // send the token back as an HttpOnly cookie (secure for production)
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req,res)=>{
    const { email, password } = req.body;

    try {
        //find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // send the token back as an HttpOnly cookie (secure for production)
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Profile fetch API
const getProfile = async (req, res) => {
    try {
        const _id = req.user._id; //get email from the authenticated user
        const user = await userModel.findOne({_id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return user profile details without the password
        const { password, ...profile } = user.toObject();
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Profile edit API using PATCH
const editProfile = async (req, res) => {
    try {
        const _id = req.user._id; //get email from the authenticated user
        
        //directly use req.body for update while ensuring to omit sensitive fields
        const updateData = req.body;
        
        // update user profile details
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id },
            { $set: updateData }, // Use req.body directly
            { new: true } // Return the updated document
        );
        console.log(updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return updated user profile details without the password
        const { password, ...profile } = updatedUser.toObject();
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {login,register,getProfile,editProfile};