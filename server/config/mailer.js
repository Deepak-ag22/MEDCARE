const nodemailer = require('nodemailer');

const { mailuser, mailpass } = process.env;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailuser,
        pass: mailpass,
    },
});

// Verify connection
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email server is ready to send messages.');
    } catch (error) {
        console.error('Error connecting to email server:', error);
    }
};

verifyConnection();

const sendApprovalEmail = async (userEmail, userName) => {
    const mailOptions = {
        from: mailuser,
        to: userEmail,
        subject: 'Appointment Approved',
        text: `Dear ${userName}, your appointment request has been approved.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", userEmail);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendApprovalEmail;