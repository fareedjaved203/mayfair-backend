const sendToken = async (user, statusCode, res) => {
  const token = await user.getJWTToken();

  user.password = null;

  res
    .status(statusCode)
    .cookie("token", token, { maxAge: 900000, httpOnly: true })
    .json({
      success: true,
      message: "Welcome To MayFair",
      user,
      token,
    });
};

module.exports = sendToken;
