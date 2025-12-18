const jwt = require('jsonwebtoken');
const NGO = require('../models/NGO');
const Restaurant = require('../models/Restaurant');
const sendEmail = require('../utils/sendEmails');
const Admin = require('../models/Admin');

const getModel = role => {
  if (role === 'admin') return Admin;
  if (role === 'ngo') return NGO;
  return Restaurant;
};

const generateToken = u =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET);

exports.signup = async (req, res) => {
  const { name, email, password, role, address, coordinates } = req.body;
  const Model = getModel(role);

  if (await Model.findOne({ email }))
    return res.status(400).json({ message: 'Exists' });

  await new Model({
    name, email, password, role,
    address,
    location: { type: 'Point', coordinates }
  }).save();

  res.json({ success: true });
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  const Model = getModel(role);
  const user = await Model.findOne({ email });

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid' });

  res.json({ token: generateToken(user) });
};

exports.generateOTP = async (req, res) => {
  const { email, role } = req.body;
  const Model = getModel(role);
  const user = await Model.findOne({ email });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 300000;
  await user.save();

  await sendEmail(email, 'Password OTP', `Your OTP is ${otp}`);
  res.json({ message: 'OTP sent' });
};

exports.resetPassword = async (req, res) => {
  const { email, role, otp, newPassword } = req.body;
  const Model = getModel(role);
  const user = await Model.findOne({ email });

  if (user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ message: 'Invalid OTP' });

  user.password = newPassword;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  await sendEmail(email, 'Password Reset', 'Password updated successfully');
  res.json({ success: true });
};