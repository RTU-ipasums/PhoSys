import Draw from './Draw.vue'
import VueKonva from 'vue-konva'
import {defaultObject} from './defaultObjects'
import { data } from './data.js'
describe('Canvas', () => {
  beforeEach(()=>{
    cy.viewport(500,500);
  })
  it('changes rectangle coordinates after drag', () => {
    let app;
    let initialCoords;
    const obj = {
      ...defaultObject,
      name:"object_1"
    }
    data.shapes.push(obj);
    
    cy.mount(Draw,{
      global: {
        plugins: [VueKonva]
      }
    }).then(({component})=>{
      app=component;
      app.updateSize(500,500);
      initialCoords={
        x:data.shapes[0].x,
        y:data.shapes[0].y
      }
    });
    cy.get('.konvajs-content')
      .trigger('mousedown',200,200,{button:0})
      .trigger('mousemove',300,300,{force:true})
      .trigger('mouseup').then(()=>{
        expect(data.shapes).have.length(1);
        expect(data.shapes[0].x).to.equal(initialCoords.x+100);
        expect(data.shapes[0].y).to.equal(initialCoords.y+100);
      });
  })
})