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
        res.status(201).json({ name, email });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credendtials' });
        }

        // set the token expiration based on "Remember Me"
        const tokenExpiry = rememberMe ? '7d' : '1h'; // 7 days if "Remember Me" is checked, 1 hour if not

        // generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: tokenExpiry });

        // send the token as an HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000 // 7 days or 1 hour in milliseconds
        });

        res.status(200).json({ name: user.name, email: user.email });
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
        // console.log(updatedUser);
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
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    
    try {
        const _id = req.user._id;  // get the user ID from the authenticated user
        // find the user by ID
        const user = await userModel.findById(_id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // check if the old password is correct
        // console.log(oldPassword);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        
        // hash the new password and update it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // save the updated user
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// logout function
const logout = async (req, res) => {
    res.clearCookie('token'); //clears the cookie
    return res.status(200).json({ message: "Logged out successfully" });
}


module.exports = {login,register,logout,getProfile,editProfile,logout,changePassword};