// app.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const transcriptionRoutes = require('./routes/transcriptionRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes d'authentification
app.use('/auth', authRoutes);

// Routes des transcriptions (protégées par le middleware d'authentification)
app.use('/api', transcriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});