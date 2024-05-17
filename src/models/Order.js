const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema(
  {
    userEmail: String,
    phone: String,
    street: String,
    postalCode: String,
    city: String,
    country: String,
    cartProducts: Object,
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);
