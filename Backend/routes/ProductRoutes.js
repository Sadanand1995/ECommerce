const { getAllProduct } = require("../controller/productController");
const express = require("express");

const router = express.Router();
router.route("/products").get(getAllProduct);

module.exports = router;
