const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const productController = require("../controllers/ProductController");
const authenticate = require("../middleware/authenticate");

//user route

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/ForgetPassword", AuthController.forgetPassword);
router.post("/VerifCode", AuthController.VerifCode);
router.post("/Resetpassword", AuthController.Resetpassword);
router.post("/payment", AuthController.Pay);
router.post("/profilgetById", AuthController.profilgetById);
router.post("/UpdateProfil", AuthController.UpdateProfil);
router.post("/refreshtoken", AuthController.refreshtoken);
router.patch("/users/:id/role", authenticate, AuthController.updateRole);
router.patch("/users/:id/ban", authenticate, AuthController.banUser);
router.get("/users", AuthController.getAllUsers);
router.get("/users/:id",AuthController.getUserById)
// router.patch('/users/:id/edit', AuthController.editUser);
router.delete("/users/:id/delete", AuthController.deleteUser);

//products routes
router.post("/products", productController.createProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.get(
  "/products/category/:category",
  productController.getProductsByCategory
);
router.get(
  "/products/category/:category/subcategory/:subCategory",
  productController.getProductsByCategoryAndSubcategory
);
router.get("/categories", productController.getAllCategories);

module.exports = router;
