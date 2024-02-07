const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
    {
        name: {
           type: String,
           required: true 
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        heading: {
            type: Number,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);