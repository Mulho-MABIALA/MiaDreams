const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
    title:          { type: String, required: true },
    episode_number: Number,
    season:         Number,
    description:    String,
    thumbnail:      String,
    duration:       String,
    audio_url:      String,
    spotify_url:    String,
    apple_url:      String,
    youtube_url:    String,
    guest:          String,
    is_published:   { type: Boolean, default: true },
    published_at:   Date,
}, { timestamps: true });

module.exports = mongoose.model('Podcast', podcastSchema);
