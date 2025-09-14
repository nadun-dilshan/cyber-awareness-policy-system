const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('username role department')
      .skip(skip)
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, role, department } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role,
      department,
      onboardingCompleted: false
    });

    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    await user.deleteOne();
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};