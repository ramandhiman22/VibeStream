const User = require('../models/user');
const OTP = require('../models/otp');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const axios = require('axios');
require('dotenv').config();
class AuthController {
    static async showLoginForm(req, res) {
        return res.render('auth/login', { message: req.flash('info'), error: req.flash('error') });
    }

    static async showSignupForm(req, res) {
        return res.render('auth/signup', { message: req.flash('error'), error: req.flash('error') });
    }

    static async login(req, res) {
        
        try {
            // Capture the CAPTCHA response token
            const captchaResponse = req.body['g-recaptcha-response'];

            // Verify the CAPTCHA
            const secretKey = '6LdKeDAqAAAAAKJw8ZMGqvsEoeNNd4iiE-oxz1LT';
            const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
            const captchaVerification = await axios.post(verificationUrl);

            // Check if CAPTCHA was successful
            if (!captchaVerification.data.success) {
                console.log("CAPTCHA verification failed");
                return res.redirect('/auth/login');
            }
            const email = req.body.email;
            const user = await User.findOne({ where: { email: email } });
            

            if (user) {
                const otp = Math.floor((Math.random() * 9000) + 1000);
                await OTP.update(
                    { otp: otp.toString() },
                    { where: { user_id: user.id } }
                );
               
    
                const accountSid = 'AC1c62bd09bb75fb3951b399363c1c2c80'; // Your Account SID from www.twilio.com/console
                const authToken = 'e8288bc529e685f938165c015ef883bd';  // Your Auth Token from www.twilio.com/console
                const client = new twilio(accountSid, authToken);

                await client.messages.create({
                    body: `Your OTP is ${otp}`,
                    to: '+919149392594',  // Text this number
                    from: '+16464612484'
                });
                // req.session.userId = user.id;
                // return res.redirect('/');
                req.session.email = email;
                // req.flash('info', 'OTP sent successfully! Please verify.');
                return res.redirect('/auth/verifySms');
            } else {
                console.log("User not found during login");
                return res.redirect('/auth/login');
            }
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong, please try again!');
            return res.redirect('/auth/login');
        }
    }

    static async signup(req, res) {
        try {
            const data = req.body;

            // Check if the email already exists
            const existingUser = await User.findOne({ where: { email: data.email } });
            if (existingUser) {
                req.flash('error', 'Email already exists. Please use a different email.');
                return res.redirect('/auth/signup'); // Redirect back to signup form with error
            }

            // If email doesn't exist, proceed with user creation
            const user = new User();
            user.name = data.name;
            user.email = data.email;
            user.password = await bcrypt.hash(data.password, 10);
            user.number = data.phone;
            user.status = false;
            await user.save();

            // Generate OTP
            const otp = Math.floor((Math.random() * 9000) + 1000);
            await OTP.create({
                otp: otp.toString(),
                user_id: user.id // Link OTP to user_id
            });

            // Save email in session
            req.session.email = data.email;

            // Send OTP via email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dhimangraman@gmail.com',
                    pass: 'wtka ucht txfn yycl'
                }
            });

            await transporter.sendMail({
                from: 'dhimangraman@gmail.com',
                to: data.email,
                subject: 'Your OTP Code',
                text: `Your OTP code is ${otp}`
            });

            req.flash('success', 'You have registered successfully! Please verify your email.');
            return res.redirect('/auth/verify'); // Redirect to verification page
        } catch (error) {
            console.log(error);
            req.flash('error', 'Something went wrong, please try again!');
            return res.redirect('/auth/signup'); // Redirect back to signup form with error
        }
    }


    static async showVerifyPage(req, res) {
        return res.render('auth/verify', { message: req.flash('error'), error: req.flash('error') });
    }
    static async Verify(req, res) {
        try {
            const data = req.body;
            const email = req.session.email;

            // Find the user by email
            const user = await User.findOne({ where: { email: email } });

            if (user) {
                // Find the OTP associated with the user's ID
                const otpRecord = await OTP.findOne({ where: { user_id: user.id } });

                if (otpRecord) {
                    const otp = data.otp;

                    // Compare the OTP entered by the user with the one in the database
                    if (otp == otpRecord.otp) {
                        // Mark the user as verified
                        user.status = true;
                        await user.save();

                        // Optionally, delete the OTP record after successful verification

                        return res.redirect('/auth/login');
                    } else {
                        // req.flash('error', 'Invalid OTP!');
                        return res.redirect('/auth/verify');
                    }
                } else {
                    // req.flash('error', 'No OTP found for this user!');
                    return res.redirect('/auth/verify');
                }
            } else {
                req.flash('error', 'Invalid email!');
                return res.redirect('/auth/verify');
            }
        } catch (error) {
            console.log(error);
            // req.flash('error', 'Something went wrong, please try again!');
            return res.redirect('/auth/verify');
        }
    }


    static async showSmsVerifyPage(req, res) {
        return res.render('auth/verifySms', { message: req.flash('error'), error: req.flash('error') });
    }
    static async verifySms(req, res) {
        console.log(req.body);
        console.log(req.session.email);
        try {
            const email = req.session.email;
            const user = await User.findOne({ where: { email: email } });
            if (user) {
                const otp = await OTP.findOne({ where: { user_id: user.id } });
                if (otp && otp.otp === req.body.otp) {
                    // Mark the user as verified, or proceed with login
                    user.status = true;
                    // await otp.destroy();
                    await user.save();

                    return res.redirect('/');
                } else {
                    // req.flash('error', 'Invalid OTP!');
                    return res.redirect('/auth/verifySms');
                }
            } else {
                // req.flash('error', 'User not found!');
                return res.redirect('/auth/verifySms');
            }
        } catch (error) {
            console.log(error);
            return res.redirect('/auth/verifySms');
        }
    }
    // Render the "Forgot Password" page
    static async showForgotPassword(req, res) {
        res.render('auth/forgot-password', { errors: req.flash('errors'), success: req.flash('success') });
    }

    // Handle "Forgot Password" form submission
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Find the user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                req.flash('errors', ['Email address not found.']);
                return res.redirect('/auth/forgot-password');
            }

            // Generate OTP
            const otp = Math.floor((Math.random() * 9000) + 1000);
            await OTP.create({
                otp: otp.toString(),
                user_id: user.id
            });

            // Send OTP to the user's email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dhimangraman@gmail.com',
                    pass: 'wtka ucht txfn yycl'
                }
            });

            await transporter.sendMail({
                from: 'dhimangraman@gmail.com',
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is ${otp}`
            });


            req.session.email = email;
            req.flash('success', ['OTP sent to your email. Please check your inbox.']);
            return res.redirect('/auth/reset-password');
        } catch (error) {
            console.log("Forgot Password Error:", error);
            req.flash('errors', ['An error occurred while processing your request.']);
            return res.redirect('/auth/forgot-password');
        }
    }

    // Render the OTP verification and password reset page
    static async showResetPassword(req, res) {
        res.render('auth/reset-password', { errors: req.flash('errors'), success: req.flash('success') });
    }

    // Handle OTP verification and password reset
    static async resetPassword(req, res) {
        try {
            const { otp, password } = req.body;

            // Find the OTP record
            const otpRecord = await OTP.findOne({ where: { otp: otp.toString() } });
            if (!otpRecord) {
                req.flash('errors', ['Invalid OTP.']);
                return res.redirect('/auth/reset-password');
            }

            // Find the user associated with the OTP
            const user = await User.findOne({ where: { id: otpRecord.user_id } });
            if (!user) {
                req.flash('errors', ['User not found.']);
                return res.redirect('/auth/reset-password');
            }

            // Update the user's password
            user.password = await bcrypt.hash(password, 10);
            await user.save();

            // Delete the OTP record after successful reset
            await otpRecord.destroy();

            req.flash('success', ['Password reset successful! You can now log in with your new password.']);
            return res.redirect('/auth/login');
        } catch (error) {
            console.log("Reset Password Error:", error);
            req.flash('errors', ['An error occurred while resetting your password.']);
            return res.redirect('/auth/reset-password');
        }
    }
}



module.exports = AuthController;
