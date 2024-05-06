import mongoose, { Schema, model, models } from "mongoose";

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
    // category: { type: Schema.Types.ObjectId, ref: "Category" },
    image: { type: String },
    description: { type: String },
    category: { type: mongoose.Types.ObjectId },
    sizes: { type: [ExtraPriceSchema] },
    extraIngredientPrices: { type: [ExtraPriceSchema] },
  },
  { timestamps: true }
);

export const MenuItem = models?.MenuItem || model("MenuItem", MenuItemSchema);
