const express = require('express');
const authRoutes = require('./authRoutes');
const transcriptionRoutes = require('./transcriptionRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

router.use('', transcriptionRoutes);

module.exports = router;
