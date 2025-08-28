const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password, role, department } = req.body;
  try {
    const user = new User({ username, password, role, department });
    await user.save();
    await new AuditLog({ userId: user._id, action: 'user_registered', details: `Role: ${role}` }).save();
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  await new AuditLog({ userId: user._id, action: 'login' }).save();
  res.json({ token, user: { id: user._id, role: user.role, onboardingCompleted: user.onboardingCompleted, department: user.department } });
};

const completeOnboarding = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.onboardingCompleted = true;
  await user.save();
  await new AuditLog({ userId: user._id, action: 'onboarding_completed' }).save();
  res.json({ msg: 'Onboarding completed' });
};

module.exports = { register, login, completeOnboarding };