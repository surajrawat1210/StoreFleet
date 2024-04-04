// Import the necessary modules here
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: "surajrawat9817@gmail.com",
    pass: "faludlsrlhgevzmo"
  }
});
console.log("mail"+process.env.STORFLEET_MAIL);
console.log("pass"+process.env.STORFLEET_SMPT_MAIL_PASSWORD);
export const sendWelcomeEmail = async (user) => {
  console.log(user);
  console.log("activation"+user.activationkey);
  // Write your code here
  try {
    // Send email using transporter
    const info = await transporter.sendMail({
      from: `StoreFleet <surajrawat9817@gmail.com>`,
      to: user.email,
      subject: "Welcome to Our Website!",
      html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Add your custom CSS styles here */
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                }
                .logo {
                    max-width: 150px;
                }
                .content {
                    margin-top: 20px;
                }
                .activate
                {
                  color:red;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #20d49a;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .activateAccount
                {
                  displaoy:block;
                  border:1px solid black;
                  background:red;
                  color:white;
                  marging: 0px auto;
                  padding:5px 5px;
                  
                }
                /* Mobile Responsive Styles */
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .logo {
                        max-width: 100px;
                    }
                    .button {
                        display: block;
                        margin-top: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://files.codingninjas.in/logo1-32230.png" alt="Storefleet Logo">
                    <h1 class ="activate" >Activate Your Account</h1>
                </div>
                <div class="content">
                  <h3>Welcome to Our Website, ${user.name}!</h3>
                  <p>Thank you for registering on our site. We're excited to have you as a member of our community.</p>
                  <p>Feel free to explore our website and make the most of our services. If you have any questions or need assistance, don't hesitate to contact us.</p>
                  <p>Best regards,<br>StoreFleet</p> 
                  <a class ="activateAccount" href ="http://localhost:3000/activationLink/${user.activationkey}">Click To Activate</a>
                </div>
            </div>
        </body>
        </html>
        
      `,
    });
    console.log("Welcome email sent successfully:", info.messageId);
  } 
  catch (error) {
    console.log("Error sending welcome email:", error);
  }
};

// app.get('/activate/:activationToken', async (req, res) => {
//   const activationToken = req.params.activationToken;
//   const user = await User.findOne({ activationToken: activationToken });

//   if (!user) {
//     return res.status(400).send('Invalid activation token.');
//   }

//   // Step 5: Verify Token and Activate Account
//   user.isActive = true;
//   user.activationToken = '';
//   await user.save();

//   res.send('Your account has been activated successfully!');
// });