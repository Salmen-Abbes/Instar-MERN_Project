const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const AuthRoute = require("./routes/Auth");
const ReviewRoute = require("./routes/Review");
const PromotionRoutes = require("./routes/Promotion");
const SalesRoutes = require("./routes/Sales");
const FournisseurRoutes = require("./routes/FournisseurRoutes");
const DRoutes = require("./routes/Product3D");
const cartRoute = require("./routes/cart");
const listRoute = require("./routes/wishlist");
const RatingRoutes = require("./routes/RatingRoutes");
const RecRoutes = require("./routes/ReclamationRoutes");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public/images", express.static("public/images"));

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));
//::::::::::
mongoose
  .connect("mongodb+srv://dottaabbes3344:AnsEU9m3hYQnddV9@cluster0.wekf0d3.mongodb.net/instar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});

app.use("/api", AuthRoute);
app.use("/api", ReviewRoute);
app.use("/api", PromotionRoutes);
app.use("/api", SalesRoutes);
app.use("/api", FournisseurRoutes);
app.use("/api", DRoutes);
app.use("/api/carts", cartRoute);
app.use("/api/wishlist", listRoute);
app.use("/api", RatingRoutes);
app.use("/api", RecRoutes);
