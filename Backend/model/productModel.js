const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
      maxLength: [8, "Price cannot exceed 8 character Amount"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, "Please Enter Product Image Public Id"],
          trim: true,
        },
        url: {
          type: String,
          required: [true, "Please Enter Product Image url"],
          trim: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Product Quantity"],
      maxLength: [4, "Price cannot exceed 4 character Number"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
      { timestamps: true },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

let Products;
try {
  Products = mongoose.model("Products");
} catch (error) {
  Products = new mongoose.model("Products", productSchema);
}

module.exports = Products;
