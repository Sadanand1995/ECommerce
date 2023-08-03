const Users = require("../model/userModel");
const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const user = await Users.create({
    ...req.body,
    avatar: {
      public_id: "this is sample public id",
      url: "this is sample url",
    },
  });
  sendToken(user, 201, res);
});

//user login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given email & passwoed both
  if (!email || !password) {
    return next(
      new errorHandler("Please enter required information to login", 400)
    );
  }
  const user = await Users.findOne({ email }).select("+password");

  //if user not found
  if (!user) {
    return next(new errorHandler("Invalid Credentials", 401));
  }
  //checking password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new errorHandler("Invalid Credentials", 401));
  }

  sendToken(user, 200, res);
});

// user logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// forgot password
exports.forgorPassword = catchAsyncError(async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return next(new errorHandler("User not found!", 404));
  }

  //get resetPasswordToken
  const resetToken = user.getResetPasswordToken();
  await user.updateOne(user);

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your reset password token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ECommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email with reset password link sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.updateOne(user);
    console.log(message);
    return next(new errorHandler(error.message), 500);
  }
});

//Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Users.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new errorHandler("Reset Password Token is Invalid", 400));
  }

  if (req.body.password == !req.body.confirmPassword) {
    return next(new errorHandler("Confirm Password Does Not Match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id).select("+password");

  if (req.body.newPassword == !req.body.confirmPassword) {
    return next(new errorHandler("Invalid Credentials", 400));
  }

  //checking password
  const isPasswordMatch = await user.comparePassword(req.body.prevPassword);
  if (!isPasswordMatch) {
    return next(new errorHandler("Invalid Credentials", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//update user profile
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //we will add cloudnary later for avatar update
  const user = await Users.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//get all users -Admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//get single users details -Admin
exports.getSingleUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(
      new errorHandler(`user does not exist with ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//update user role -admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(
      new errorHandler(`User does not exist with id: ${req.params.id}`, 400)
    );
  }

  await user.updateOne(newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Delete user -admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(
      new errorHandler(`User does not exist with id: ${req.params.id}`, 400)
    );
  }
  await user.deleteOne();
  //we will remove coudnary later

  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
    user,
  });
});
