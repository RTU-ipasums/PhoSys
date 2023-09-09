import App from './App.vue'
import VueKonva from 'vue-konva'
describe('shape tests', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })
  it('checks if rectangle coordinates change after drag', () => {
    let app;
    let initialCoords;
    cy.mount(App,{
      global: {
        plugins: [VueKonva]
      }
    }).then(({component})=>{app=component});
    cy.get('#object-button').click().then(()=>{
      expect(app.data.shapes).have.length(1)
      initialCoords={
        x:app.data.shapes[0].x,
        y:app.data.shapes[0].y
      }
    });
    cy.get('.konvajs-content')
      .trigger('mousedown',200,200,{button:0})
      .trigger('mousemove',300,300,{force:true})
      .trigger('mouseup').then(()=>{
        expect(app.data.shapes).have.length(1);
        expect(app.data.shapes[0].x).to.equal(initialCoords.x+100);
        expect(app.data.shapes[0].y).to.equal(initialCoords.y+100);
      });
  })
})