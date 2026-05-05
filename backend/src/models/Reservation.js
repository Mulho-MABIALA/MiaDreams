const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name:           { type: String, required: true },
    email:          { type: String, required: true },
    phone:          String,
    service:        { type: String, required: true },
    preferred_date: Date,
    preferred_time: String,
    message:        String,
    status:         { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    is_read:        { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
