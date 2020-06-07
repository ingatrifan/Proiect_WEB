const nodemailer = require('nodemailer');
const mailTypes = require('./mailTypes')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'proiect.web2020@gmail.com',
      pass: 'proiect2020' 
    }
  });

exports.sendMail = async(type,user,token = null) =>{
    try {
        let mailOptions;
        if (type == 'hello'){
            mailOptions = mailTypes.welcomeMail(user,token)
        } else
        if (type == 'forgot'){
            mailOptions = mailTypes.forgetMail(user,token);
        }
        transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error)
    }
}