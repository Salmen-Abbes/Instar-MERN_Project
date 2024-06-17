const User = require("../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const nodemailer = require("nodemailer");

const register = (req, res, next) => {
  const password = req.body.password;
  console.log(req.body)
  bycrypt.hash(password, 10, function (err, hashedPass) {
    if (err) {
      console.log(err)
    }
    let user = new User({
      Firstname: req.body.name,
      email: req.body.email,
      phone: req.body.phoneNumber,
      password: hashedPass,
      role: req.body.role || "user",
    });
    user
      .save()
      .then((user) => {
        console.log(user)
        res.json({
          message: "user Added Successfully",
          uId: user.id,
        });
      })
      .catch((error) => {
       console.error(error)
      });
  });
};

const login = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bycrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign({ name: user.Firstname }, "secretValue", {
              expiresIn: "1h",
            });
            let refreshtoken = jwt.sign(
              { name: user.Firstname },
              "refreshtokensecret",
              { expiresIn: "48h" }
            );

            // Calculate the expiration date of the token
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1);

            res.json({
              message: "login successful",
              token,
              refreshtoken,
              tokenExpiration: moment(expirationDate).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              Uid: user._id,
              role: user.role,
            });
          } else {
            res.json({
              message: "password does not match!",
            });
          }
        });
      } else {
        res.json({
          message: "no user found",
        });
      }
    }
  );
};

const forgetPassword = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var emaill = req.body.email;

  var random = Math.floor(Math.random() * 10000);

  User.findOne({ $or: [{ email: emaill }] }).then(async (user) => {
    if (user) {
      user.code = random;
      const code = await User.findByIdAndUpdate(
        user.id,
        {
          code: user.code,
        },
        { new: true }
      );

      let details = {
        from: "ayed.boukadida@esprit.tn",
        to: emaill,
        subject: "Please reset your password",
        text: `We heard that you lost your application password.\n Sorry about that! But don’t worry!\n You can use the following CODE to reset your password : \n  ${random}`,
      };
      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "ayed.boukadida@esprit.tn", pass: "211JMT3065" },
      });
      mailTransporter.sendMail(details, (err) => {
        if (err) {
          console.log("it has an error", err);
        } else {
          console.log("email has sent!");
        }
      });
      res.json({
        message: `send email  suuccessful `,
      });
    } else {
      res.json({
        message: "no email found",
      });
    }
  });
};
const profilgetById = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var idd = req.body.id;

  User.findOne({ $or: [{ id: idd }] }).then(async (user) => {
    if (user) {
      res.json({
        message: `get user successful  `,
        user,
      });
    } else {
      res.json({
        message: "no user found",
      });
    }
  });
};

const VerifCode = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var codee = req.body.code;
  var emaill = req.body.email;
  User.findOne({ $or: [{ code: codee }] }).then((user) => {
    if (user) {
      res.json({
        message: `code suuccessful`,
      });
    } else {
      return res.json({
        message: "no code  found ",
      });
    }
  });
};

const Resetpassword = (req, res, next) => {
  var username = req.body.username;
  var passwordd = req.body.password;
  var codee = req.body.code;
  var emaill = req.body.email;
  User.findOne({ $or: [{ email: emaill }] }).then(async (user) => {
    if (user) {
      const password = await User.findByIdAndUpdate(
        user.id,
        {
          password: passwordd,
        },
        { new: true }
      );

      res.json({
        message: `password updated suuccessful`,
      });
    } else {
      return res.json({
        message: "no password  found ",
      });
    }
  });
};

const UpdateProfil = (req, res, next) => {
  var usernamee = req.body.Firstname;
  var lastnamee = req.body.Lastname;
  var passwordd = req.body.password;
  var codee = req.body.code;
  var idd = req.body.id;
  var emaill = req.body.email;
  User.findOne({ $or: [{ id: idd }] }).then(async (user) => {
    if (user) {
      const userr = await User.findByIdAndUpdate(
        user.id,
        {
          Firstname: usernamee,
          Lastname: lastnamee,
          email: emaill,
          password: passwordd,
        },
        { new: true }
      );

      res.json({
        message: `profil updated suuccessful`,
        userr,
      });
    } else {
      return res.json({
        message: "profil no update",
      });
    }
  });
};

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "1";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "2";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "3";

Pay = async (req, res) => {
  // console.log(req.body.first_name);
  const body = {
    receiverWalletId: "6398f7a008ec811bcda49054",
    amount: req.body.prix,
    token: "TND",
    type: "immediate",
    description: "payment description",
    lifespan: 10,
    feesIncluded: true,
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    phoneNumber: "27840303",
    email: req.body.email,
    orderId: "1234657",
    webhook: "http://197.134.249.98:9090/payment/webhook",
    silentWebhook: true,
    successUrl: "https://dev.konnect.network/gateway/payment-success",
    failUrl: "https://dev.konnect.network/gateway/payment-failure",
    checkoutForm: true,
    acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
  };

  const response = await fetch(
    "https://api.preprod.konnect.network/api/v2/payments/init-payment",
    {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "6398f7a008ec811bcda49053:9v1o3O7FjyG1KbjfVFw0D",
      },
    }
  );
  const data = await response.json();
  console.log(data);
  res.status(200).json({ message: "payment avec succeés", data });
};

const refreshtoken = (req, res, next) => {
  const refreshtoken = req.body.refreshtoken;
  jwt.verify(refreshtoken, "refreshtokensecret", function (err, decode) {
    if (err) {
      res.status(400).json({
        err,
      });
    } else {
      let token = jwt.sign({ name: decode.Firstname }, "refreshtokensecret", {
        expiresIn: "60s",
      });
      let refreshtoken = req.body.refreshtoken;
      res.status(200).json({
        message: "Token refreshed ",
      });
    }
  });
};

const updateRole = async (req, res, next) => {
  const { id } = req.params;
  const { newRole } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Authorization needed" });
    }

    user.role = newRole;
    await user.save();
    res.json({ message: "updated " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getUserById = async (req,res)=>{
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user)}
    catch(err){
      console.error(err)
    }
}
const banUser = async (req, res, next) => {
  const { id } = req.params;
  const { banned } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Authorization needed" });
    }

    user.ban = banned;
    await user.save();
    res.json({ message: `user ${banned ? "banned" : "débanni"} ` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    console.log("hee");
    const users = await User.find({}, "-password"); // Exclude the password field
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while fetching users" });
  }
};

const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { newUserData } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data here
    user.Firstname = newUserData.Firstname;
    user.Lastname = newUserData.Lastname;
    user.email = newUserData.email;
    user.phone = newUserData.phone;
    user.role = newUserData.role;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while updating user" });
  }
};
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while deleting user" });
  }
};

module.exports = {
  register,
  login,
  forgetPassword,
  Pay,
  profilgetById,
  UpdateProfil,
  Resetpassword,
  VerifCode,
  refreshtoken,
  updateRole,
  banUser,
  getAllUsers,
  editUser,
  deleteUser,
  getUserById
};
