const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const { generateToken } = require('../jwt/jwt');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
};

exports.getSearchUser = async (req, res) => {
    const { query } = req.body;
    try {
        var users = [];
        if (query.length == '') {
            return res.status(200).json(users);
        }
        users = await User.find({ name: { $regex: query, $options: 'i' } }).limit(5);
        res.status(200).json(users);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Store the hashed password
        });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed.' });
    }
};

exports.updateuser = async (req, res) => {
    try {

        const { name, email, file, user_id } = req.body;
        var profile = file;
        var _id = user_id;
        const user = await User.findByIdAndUpdate(
            _id,
            { name, email, profile },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json({ message: 'Update successful.', user });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Update failed.' });
    }
};


exports.CreateTempUser = async (req, res) => {
    const usersArray = [
        {
            name: 'Prakash Solanki',
            email: 'prakash@gmail.com',
            password: 'password1',
        },
        {
            name: 'Priyal Jain',
            email: 'priyal@gmail.com',
            password: 'password2',
        },
        {
            name: 'Divya Malviya',
            email: 'divya@gmail.com',
            password: 'password2',
        },
        {
            name: 'Suman Kumawat',
            email: 'suman@gmail.com',
            password: 'password2',
        },
        {
            name: 'Manisha Serrvi',
            email: 'manisha@gmail.com',
            password: 'password2',
        },
    ];

    try {
        for (const userData of usersArray) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                continue;
            }
            const user = new User(userData);
            await user.save();
            console.log(user);
        }
        res.send('Created users from array successfully');
    }
    catch (err) {
        res.status(500).send(err);
    }
}