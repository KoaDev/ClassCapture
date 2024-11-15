const express = require('express');
const authRoutes = require('./routes/authRoutes');
const transcriptionRoutes = require('./routes/transcriptionRoutes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/api', transcriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});