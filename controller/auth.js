const User = require("../models/User");
const Newletter = require("../models/Newsletter");
const ErrorResponse = require("../utils/errorRes");
const sendEmail = require("../utils/sendEmail");
const validateMongoDbId = require("../utils/validateMongodbId");
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");
// const uniqid = require('uniqid');
// const { generateToken } = require("../config/jwtToken");
const sendToken = require("../utils/jwtToken");
const uploadOnS3 = require("../utils/uploadOnS3");
const AWS = require('aws-sdk');
const axios = require('axios');
const { OpenAI } = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const s3 = new AWS.S3({
  accessKeyId: process.env.awsAccessKey,
  secretAccessKey: process.env.awsSecretkey,
  region: process.env.region,
});

exports.register = async (req, res, next) => {
  const { email, mobile } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    return res
      .status(203)
      .json({ error: "User with this email or mobile number already exists." });
  }

  try {
    const newUser = await User.create(req.body);
    sendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.signUp = async (req, res, next) => {
  const { email } = req.body;

  try {
    const newUser = await Newletter.create({ email });
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};

exports.getNewsletter = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchQuery = req.query.search;

    const newsletterQuery = Newletter.find();

    if (searchQuery) {
      newsletterQuery.regex("email", new RegExp(searchQuery, "i"));
    }

    const total = await Newletter.countDocuments(newsletterQuery);

    const newsletter = await newsletterQuery.skip(skip).limit(limit).exec();
  
    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      totalPages,
      newsletter,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteNewsletter = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedNewsletter = await Newletter.findByIdAndDelete(id);
  res.json(deletedNewsletter);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide Email and Password", 400));
  }

  try {
    const findUser = await User.findOne({ email }).select("+password");
    // const isPasswordMatch = await bcrypt.compare(password, findUser.password);

    if (findUser && (await findUser.matchPasswords(password))) {
      sendToken(findUser, 201, res);
    } else {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const findAdmin = await User.findOne({ email }).select("+password");
    
    if (!findAdmin) {
      throw new Error("Admin not found");
    }

    if (findAdmin.role !== "admin") {
      throw new Error("Not Authorized");
    }

    if (await findAdmin.matchPasswords(password)) {
      sendToken(findAdmin, 201, res);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');

  res.status(200).json({ success: true, message: 'Logout successful' });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(`${email} this email is not registered`);
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://18.213.58.52:5000/user-password-reset/${resetToken}`;

    const message = `
    <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .header {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 10px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Hello ${user.firstname},</h2>
        </div>
        <div class="content">
            <p>We have received a request to reset your password for your account on <strong>E-Commerce</strong>. If you did not request this change, you can ignore this email and your password will not be changed.</p>
            
            <p>To reset your password, please click on the following link and follow the instructions:</p>
            
            <p><a class="button" href="${resetUrl}">Reset Password</a></p>
            
            <p>This link will expire in <strong>15 minutes</strong> for security reasons. If you need to reset your password after this time, please make another request.</p>
        </div>
        <div class="footer">
            <h3>Thank you,</h3>
            <h3>E-Commerce Team</h3>
        </div>
    </div>
</body>
</html>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Account Password Reset Link",
        text: message,
      });
      res.status(200).json({
        success: true,
        data: "Password Reset Email Sent Successfully",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      return res.status(500).json("Email could not be sent");
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user._id;

    const user = await User.findById(_id).select("+password");
    // Verify the current password
    const isPasswordMatch = await user.matchPasswords(oldPassword);
    if (!isPasswordMatch) {
      return res.status(403).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Password change failed" });
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let fileName = req.file.originalname;

    let url = await uploadOnS3(req.file.buffer, fileName);

    return res.status(200).json({ status: true, url: url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteData = async (req, res, next) => {
    try {
        // Extract the key from the URL
        const url = decodeURIComponent(req.body.url);
        const key = url.substring(url.lastIndexOf('/') + 1);

        // Specify the parameters for S3 deletion
        const params = {
            Bucket: process.env.bucket,
            Key: key,
        };

        // Delete the object from S3
        await s3.deleteObject(params).promise();

        return res.status(200).json({ status: true, message: 'Data removed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.chatApi = async (req, res) => {
  try {
    const  apiRequestBody  = req.body;

    // Construct the request body for communicating with OpenAI
    // const requestBody = {
    //   model: 'gpt-3.5-turbo',
    //   messages: [
    //     { role: 'system', content: chatLike },
    //     ...messages.map(message => ({ role: 'user', content: message }))
    //   ]
    // };

    // Make a request to OpenAI's API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', apiRequestBody, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract the response from OpenAI and send it back to the frontend
    const responseData = response.data.choices[0].message.content;
    res.json({ message: responseData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createThread = async (req, res) => {
  try {
    const emptyThread = await openai.beta.threads.create();
    res.status(201).json(emptyThread);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const ASSISTANTID = process.env.ASS_ID;

const getAnswer = async (threadId, runId) => {
  try {
    const getRun = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (getRun.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      const botResponse = messages.data[0].content[0].text.value;
      return botResponse;
    } else {
      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await getAnswer(threadId, runId));
        }, 2000);
      });
    }
  } catch (error) {
    console.error("Error retrieving answer:", error);
    throw error;
  }
};

exports.sendMessage = async (req, res) => {
  const { threadId, message } = req.body;
  try {
    const send = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    });
      const getRun =  await openai.beta.threads.runs.create(threadId, { assistant_id: ASSISTANTID });
      const runId = getRun.id;
      const botResponse = await getAnswer(threadId, runId);
      
      if (botResponse) {
        const messagesResponse = await openai.beta.threads.messages.list(threadId);
        const messages = messagesResponse.body.data.map(message => ({
          role: message.role,
          message: message.content[0].text.value
        }));
        messages.reverse();
        res.status(200).json({messages}); 
      } else {
        res.status(500).json({ error: 'Bot response not available yet' });
      }

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getMessage = async (req, res) => {
  const { threadId } = req.params;
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}