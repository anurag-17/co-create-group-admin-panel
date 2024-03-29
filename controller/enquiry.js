const Enquiry = require("../models/Enquiry");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const sendEmail = require("../utils/sendEmail");
const emailValidator = require('deep-email-validator');
const dns = require('dns');
// const fetch = require('node-fetch');
const axios = require('axios');
const CsvParser = require("json2csv").Parser;
// Basic email format validation using regex
function isEmailFormatValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if the email domain exists using DNS lookup
async function doesEmailDomainExist(email) {
  const domain = email.split('@')[1];

  return new Promise((resolve) => {
    dns.resolveMx(domain, (error, addresses) => {
      resolve(!error && addresses && addresses.length > 0);
    });
  });
}


// async function isEmailValid(email) {
//   try {
//     const { valid, reason, validators } = await emailValidator.validate(email, {
//       timeout: 100000, // Set a timeout value in milliseconds (adjust as needed)
//     });

//     console.log(validators);

//     if (!valid) {
//       return {
//         valid: false,
//         reason: validators[reason].reason,
//       };
//     }

//     // Check SMTP validation results
//     if (!validators.smtp || !validators.smtp.valid) {
//       return {
//         valid: false,
//         reason: "SMTP validation failed",
//       };
//     }

//     return {
//       valid: true,
//     };
//   } catch (error) {
//     console.error(error);

//     // Handle timeout without exposing specific details
//     if (error.code === "ETIMEDOUT") {
//       return {
//         valid: false,
//         reason: "SMTP validation timed out",
//       };
//     }

//     // Handle other errors without exposing details
//     return {
//       valid: false,
//       reason: "Email validation error",
//     };
//   }
// }

// Create a new enquiry
exports.createEnquiry = asyncHandler(async (req, res) => {
  try {
    // Your existing code for creating an enquiry
    const { email } = req.body;

    // Validate the email address
    const isFormatValid = isEmailFormatValid(email);
    const doesDomainExist = await doesEmailDomainExist(email);

    if (!isFormatValid || !doesDomainExist) {
      return res.status(403).json({
        message: "Please provide a valid email address.",
        reason: "Invalid email format or non-existent domain",
      });
    }

    const newEnquiry = await Enquiry.create(req.body);
    const userEmail = newEnquiry.email;
    const adminEmail = 'mikepricharda@gmail.com';

    // Send confirmation email to the user
    const userMailOptions = {
      from: 'mikepricharda@gmail.com',
      to: userEmail,
      subject: 'Enquiry Confirmation',
      text: 'Thank you for filling out the enquiry form. We will get back to you soon!',
    };
    await sendEmail(userMailOptions);

    // Send notification email to the admin
    const adminMailOptions = {
      from: 'mikepricharda@gmail.com',
      to: adminEmail,
      subject: 'New Enquiry Notification',
      text: `New enquiry received from ${userEmail}. Please check the admin panel for details.`,
    };
    await sendEmail(adminMailOptions);

    // Mailchimp integration
    const mailchimpUrl = 'https://thecocreategroup.us21.list-manage.com/subscribe/post?u=6c603f25a9c0afd6338056f72&id=9c33e76f8a&f_id=00aefbe6f0';

    try {
      const mailchimpResponse = await fetch(mailchimpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          EMAIL: userEmail,
        }),
      });
    
      console.log(mailchimpResponse);
    
      if (!mailchimpResponse.ok) {
        throw new Error(`Mailchimp API request failed with status ${mailchimpResponse.status}`);
      }

      // if (mailchimpResponse.ok) {
        // Send a success response
        res.status(201).json({
          message: 'Enquiry created successfully',
          status: 'success',
        });
      // } else {
      //   throw new Error(`Mailchimp API request failed with status ${mailchimpResponse.status}`);
      // }

    } catch (error) {
      console.error('Mailchimp Error:', error.message);
      res.status(401).json({ error: 'Internal Server Error' });
    }
    
      // Check if the response is in JSON format
      // const contentType = mailchimpResponse.headers.get('content-type');
      // if (contentType && contentType.includes('application/json')) {
      //   const responseData = await mailchimpResponse.json();
        
      //   // Extract the redirect URL from the response headers
      //   const redirectUrl = mailchimpResponse.headers.get('location');
    
      //   // Log the response and redirect URL
      //   console.log('Mailchimp Response:', responseData);
      //   console.log('Mailchimp Redirect URL:', redirectUrl);
        
      // } else {
      //   // Handle non-JSON response (e.g., HTML error page) appropriately
      //   const nonJsonResponse = await mailchimpResponse.text();
      //   console.error('Mailchimp Error:', nonJsonResponse);
      //   res.status(403).json({ error: 'Unexpected response from Mailchimp' });
      // }
    // } catch (error) {
    //   console.error('Mailchimp Error:', error.message);
    //   // Handle other Mailchimp errors appropriately
    //   res.status(500).json({ error: 'Internal Server Error' });
    // }

    res.status(201).json(newEnquiry);
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing enquiry
exports.updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedEnquiry);
});

// Delete an enquiry
exports.deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
  res.json(deletedEnquiry);
});

// Get a single enquiry by ID
exports.getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }

  res.json(enquiry);
});

// Get all enquiries with pagination
exports.getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchQuery = req.query.search;

    const enquiriesQuery = Enquiry.find();

    if (searchQuery) {
      enquiriesQuery.regex("email", new RegExp(searchQuery, "i"));
    }

    const total = await Enquiry.countDocuments(enquiriesQuery);

    const enquiries = await enquiriesQuery.skip(skip).limit(limit).exec();

    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      totalPages,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.enquiryData = async (req, res, next) => {
  try {
    let users = [];

    var invitationData = await Enquiry.find({});

    invitationData.forEach((user) => {
      const { email } = user;
      users.push({ email });
    });
    const fields = [ "email" ];
    const csvParser = new CsvParser({ fields });
    const data = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment: filename=EnquirieData.csv");

    res.status(200).end(data);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};