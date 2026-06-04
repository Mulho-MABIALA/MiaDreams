const mongoose = require('mongoose');
const slugify = require('slugify');

const moduleSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: String,
}, { _id: false });

const programmeSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    slug:         { type: String, unique: true },
    description:  String,
    image:        String,
    youtube_id:   String,
    duration:     String,   // ex: "6 semaines"
    price:        String,   // ex: "150 000 FCFA"
    format:       { type: String, enum: ['présentiel', 'en ligne', 'hybride'], default: 'présentiel' },
    level:        { type: String, enum: ['débutant', 'intermédiaire', 'avancé', 'tous niveaux'], default: 'tous niveaux' },
    start_date:   String,
    max_places:   { type: Number, default: 0 },  // 0 = illimité
    is_open:      { type: Boolean, default: true },
    modules:      [moduleSchema],
    is_active:    { type: Boolean, default: true },
    order:        { type: Number, default: 0 },
}, { timestamps: true });

programmeSchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Programme', programmeSchema);
