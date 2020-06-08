class Login {
    username = 'test@mailinator.com';
    password = 'asdf';
    //locators
    registerName = '#name';
    registerPass1 = '#userPass1'
    registerPass2 = '#userPass2'
    loginInput = '#email';
    passwordInput = '#password'
    loginBtn = '#loginBtn'
    login =() =>{
        cy.visit('/login');
        cy.get(this.loginInput).type(this.username);
        cy.get(this.passwordInput).type(this.password);
        cy.get(this.loginBtn).click();
    }
}
export default new Login();