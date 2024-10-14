import {
  checkHashPassword,
  createHashPassword,
} from "../helpers/authHelper.js";
import userModels from "../models/userModels.js";
import oredrModels from "../models/orderModels.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // Validatio
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    // check user
    const exsitingUser = await userModels.findOne({ email });

    //{email:email} -- check in the basis of email. here key value pair is same, so we can only type email.

    // existing user
    if (exsitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered. Please login",
      });
    }

    // Register User
    const hashedPassword = await createHashPassword(password);
    // save user details
    const user = await new userModels({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Please Register",
      });
    }
    const match = await checkHashPassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // create token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "Login successfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forget Password controller
export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    // check
    const user = await userModels.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    const hashed = await createHashPassword(newPassword);
    await userModels.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// update profile controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModels.findById(req.user._id);
    // password check
    if (password && password.length < 6) {
      return res.json({ message: "Password is required and 6 character long" });
    }
    const hashedPassword = password
      ? await createHashPassword(password)
      : undefined;
    const updatedUser = await userModels.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating the profile",
      error,
    });
  }
};

export const testController = (req, res) => {
  try {
    res.send("Protected routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// Orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await oredrModels
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// Order show at admin side

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await oredrModels
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all orders",
      error,
    });
  }
};

// Order status update
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await oredrModels.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating the order status",
      error,
    });
  }
};
