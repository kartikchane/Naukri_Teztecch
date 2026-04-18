require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 Testing Email Configuration...\n');
console.log('Email Config:');
console.log('- HOST:', process.env.EMAIL_HOST);
console.log('- PORT:', process.env.EMAIL_PORT);
console.log('- USER:', process.env.EMAIL_USER);
console.log('- FROM:', process.env.EMAIL_FROM);
console.log('');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email Transporter Error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to email server!');
      console.error('- Check if SMTP host is correct');
      console.error('- Check if port 587 is open');
    }
    process.exit(1);
  } else {
    console.log('✅ Email service connected successfully!\n');
    
    // Test send
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: '📧 Test Email - Naukri Platform',
      html: '<h1>✅ Your email system is working!</h1>'
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Error sending test email:', err.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.response);
        process.exit(0);
      }
    });
  }
});
