const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    product_id: String,
    name:       { type: String, required: true },
    image:      String,
    price:      { type: Number, required: true },
    quantity:   { type: Number, required: true, min: 1 },
    size:       String,
    color:      String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
    order_number:   { type: String, unique: true },
    items:          { type: [itemSchema], required: true },
    customer: {
        name:    { type: String, required: true },
        email:   { type: String, required: true },
        phone:   { type: String, required: true },
        address: String,
        city:    String,
        country: { type: String, default: "Côte d'Ivoire" },
    },
    subtotal:       { type: Number, required: true },
    shipping_fee:   { type: Number, default: 0 },
    total:          { type: Number, required: true },
    payment_method: { type: String, enum: ['wave', 'orange_money', 'free_money', 'cinetpay', 'cash'], required: true },
    payment_status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    payment_ref:    String,
    order_status:   { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    notes:          String,
}, { timestamps: true });

orderSchema.pre('validate', function(next) {
    if (!this.order_number) {
        this.order_number = 'MIA-' + Date.now().toString(36).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
