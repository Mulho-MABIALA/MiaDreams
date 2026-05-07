const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/miadreams');
        console.log(`MongoDB connecté : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erreur MongoDB : ${error.message}`);
        console.error('Le serveur continue sans MongoDB — certaines routes seront indisponibles.');
    }
};

module.exports = connectDB;
