import App from './App.vue'
import VueKonva from 'vue-konva'
describe('shape tests', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })
  it('adds shape on button click', () => {
    let app;
    cy.mount(App,{
      global: {
        plugins: [VueKonva]
      }
    }).then(({component})=>{app=component});
    cy.get('#object-button').click().then(()=>{
      expect(app.data.shapes).have.length(1)
    });
  })
})