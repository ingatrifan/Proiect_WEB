exports.welcomeMail = (user,token) =>{
    let html=`<h2>Hello ${user.name}</h2>`+
    `<p>We are happy you joined our community! <br> Here you will find a lot of new possibilities, if you need our help please feel free to contact us on this email.</p>`+
    `Please let us know what you think about our application, your reviews will help us to make our services better.`+
    `<p>Please hit the button above to confirm your account</p>`+
    `<button style="width:30px;padding:10px;background-color:green;border:none;text-decoration"><a href="http://localhost/confirm?token=${token}">Confirm<a></button>`

    return  {
        from: '"STOL" <proiect.web2020@gmail.com>',
        to: `${user.email}`,
        subject: 'Welcome',
        html
    };
}
exports.forgetMail = (user, token) =>{
    let html = `<h2>Hello, ${user.name}</h2>`+
        '<p>If you want to change your password please hit the bellow button, if not then ignore this email.</p>'+
        `<button style="width:30px;padding:10px;background-color:green;border:none;text-decoration"><a href="http://localhost/reset?token=${token}">Change password<a></button>`
        return  {
            from: '"STOL" <proiect.web2020@gmail.com>',
            to: `${user.email}`,
            subject: 'STOL forgot password',
            html
        };
}