import loginPage from '../../support/pages/loginPage'
import mainPage from '../../support/pages/mainPage'

describe('STOL project tests', () => {
    it('Check error message on login page',()=>{
        cy.visit('/login');
        cy.get(loginPage.loginInput).type("error");
        cy.get(loginPage.passwordInput).type("error");
        cy.get(loginPage.loginBtn).click(); 
        cy.contains('Wrong email or passsword, or account is not confirmed').should('be.visible')
    });
    it('Check that error message appears on register page when passwords dont match',()=>{
        cy.visit('/register');
        cy.get(loginPage.loginInput).type("user123@mailinator.com");
        cy.get(loginPage.registerPass1).type("user123");
        cy.get(loginPage.registerName).type("user123");
        cy.get(loginPage.registerPass2).type("user121");
        cy.get("[type='submit']").click(); 
        cy.contains("Passwords doesn't match").should('be.visible')
    })
    it('Check that register takes you to the login page',()=>{
        cy.visit('/register');
        cy.get(loginPage.loginInput).type("user123@mailinator.com");
        cy.get(loginPage.registerName).type("user123");
        cy.get(loginPage.registerPass1).type("user123");
        cy.get(loginPage.registerPass2).type("user123");
        cy.get("[type='submit']").click(); 
        cy.contains("Forgot password?").should('be.visible')
    });
    it('Check that register you cannot register with the same email',()=>{
        cy.visit('/register');
        cy.get(loginPage.loginInput).type("user123@mailinator.com");
        cy.get(loginPage.registerName).type("user123");
        cy.get(loginPage.registerPass1).type("user123");
        cy.get(loginPage.registerPass2).type("user123");
        cy.get("[type='submit']").click(); 
        cy.contains("There already exists an user with this email").should('be.visible')
    });
    describe('Tests that need login',()=>{
        beforeEach(() => {
            loginPage.login();
        });
        it('Check that login page redirects to mainPage', () =>{
            cy.get('#modal-btn').should('be.visible')
        });
        it('Check that modal appears when add button is clicked', ()=>{
            cy.get('#modal-btn').click();
            cy.contains("Upload some files!").should('be.visible');
        })
        it('Check upload a file works',()=>{
            mainPage.addFile()
            cy.wait(2000)
            cy.contains('example.txt').should('be.visible');
        })
        it('Check that downloaded file is the same',()=>{
            mainPage.downloadFile();
            cy.wait(5000);
            cy.readFile('/home/batman/Descărcări/example.txt').then((str)=>{
                console.log(str)
                cy.fixture('example.txt').then((str2)=>{
                    console.log(str2)
                    expect(str2).to.eq(str)
                })
            })
        })
        it('Check delete modal opens',()=>{
            cy.get('.button-delete').eq(0).click({force:true});
            cy.contains('Are you sure you want to delete this file?').should('be.visible');
        })
        it('Check that file can be deleted',()=>{
            cy.get('.button-delete').eq(0).click({force:true});
            cy.get('#deleteFileBtn').click();
            cy.contains('example.txt').should('not.be.visible')
        })
    })
})