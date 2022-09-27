const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        trackingCount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);