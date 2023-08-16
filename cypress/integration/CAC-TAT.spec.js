// CAC-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    this.beforeEach(function(){
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })
    it('Preenche os campos obrigatórios e envia o formulário', function() {
        const longText= 'Teste, teste, teste, Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,Teste, teste, teste,'
        
        cy.clock() // Congelar o relogio do navegador
        cy.get('#firstName').type('Dieine')
        cy.get('#lastName').type('Tacao')
        cy.get('#email').type('dieine.tacao@csgi.com')
        //cy.get('#open-text-area').type('Hello World')
        cy.get('#open-text-area').type(longText, {delay: 0})
        //cy.get('button[type="submit"]').click()
        cy.contains('button','Enviar').click()
        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Dieine')
        cy.get('#lastName').type('Tacao')
        cy.get('#email').type('dieine.tacao@csgi,com')
        //cy.get('#open-text-area').type('Hello World')
        cy.get('#open-text-area').type('Hello World')
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', function(){
        cy.get('#phone')
        .type('abcdefghij')
        .should('have.value','')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        //usuario marcou o checkbox de telefone obrigatorio, mas não digitou o telefone. Deve aparecer mensagem de erro.
        cy.get('#firstName').type('Dieine')
        cy.get('#lastName').type('Tacao')
        cy.get('#email').type('dieine.tacao@csgi.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Hello World')
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
        .type('Dieine')
        .should('have.value', 'Dieine')
        .clear()
        .should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.DieineFillMandatoryFieldsandSubmit()
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product')
        .select('YouTube')
        .should('have.value','youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        //<option value="mentoria"> Mentoria </option>
        cy.get('#product')
        .select('mentoria')
        .should('have.value','mentoria')

    })

    it('seleciona um produto (Blog) por seu índice', function(){
        //Javascript começa como referência do 0.
        cy.get('#product')
        .select(1)
        .should('have.value','blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
        //<input type="radio" name="atendimento-tat" value="feedback">
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value','feedback')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]') //Verificação para validar quantos elementos 
        .should('have.length',3) //contar quantos elementos tem
        .each(function($radio){ //para passar por cada um dos elementos
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures',function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                //console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop',function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action:'drag-drop'})
            .should(function($input){
                //console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]#file-upload')
        .selectFile('@sampleFile') //@para chamar o aliás 
        .should(function($input){
            //console.log($input)
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        //Quando o elemento tem o target=_blank significa que ele tem que abrir em outra página
        //<a href="privacy.html" target="_blank">Política de Privacidade</a> 
        cy.get('#privacy a').should('have.attr','target','_blank')

    })

   it('acessa a página da política de privacidade removendo o target e então clicando no link',function(){
    //Cypress só consegue fazer as validações na página atual e não na nova página, por isso tem que abrir na própria página de execução
    cy.get('#privacy a')
        .invoke('removeAttr','target')
        .click()

    cy.contains('Talking About Testing').should('be.visible')
   })

   it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a area de texto usando o comando invoke', function(){
    //Executa mais rápido que se se estivesse digitando com o type()
    const longText = Cypress._.repeat('0123456789', 20)
    cy.get('#open-text-area')
    .invoke('val', longText)
    .should('have.value', longText)
  })

  it('faz uma requisição HTTP', function(){
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should(function(response) {
           //console.log(response) 
           //Para desestruturar opacote que traz todas as info 
           const {status, statusText, body} = response
           expect(status).to.equal(200)
           expect(statusText).to.equal('OK')
           expect(body).to.include('CAC TAT')


        })
  })

  it('encontra o gato escondido', function(){
    cy.get('#cat')
    .invoke('show')
      .should('be.visible')

    //Para mudar o texto dentro da aplicação durante a execução de testes
    cy.get('#title')
    .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
        .invoke('text', 'Eu 💚 gatos !')
  })

   
  })