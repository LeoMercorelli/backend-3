const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        specie: { type: String, required: true },
        adopted: { type: Boolean, default: false },
        birthDate: { type: Date },
        image: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Pet', PetSchema);
