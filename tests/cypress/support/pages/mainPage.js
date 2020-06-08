import 'cypress-file-upload';

class Main{
    addBtn ='#modal-btn';
    fileInput = '#file';

    addFile = () =>{
        cy.get(this.addBtn).click();
        let pathToFile = '/example.txt'
        cy.get(this.fileInput).attachFile(pathToFile);
    }
    downloadFile = ()=>{
        cy.get('.button-download').eq(0).click({force:true});
    }
}
export default new Main();