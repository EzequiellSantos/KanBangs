const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.use(auth);

router.get('/me', (req, res) => {
  const { _id, firstName, lastName, email } = req.user;
  res.json({ _id, firstName, lastName, email });
});

router.put('/me', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
  res.json(user);
});

router.delete('/me', async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.sendStatus(204);
});

module.exports = router;
