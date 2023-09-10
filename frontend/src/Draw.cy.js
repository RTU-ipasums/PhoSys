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
      const startX=initialCoords.x+data.shapes[0].width/2;
      const startY=initialCoords.y+data.shapes[0].height/2;
      const moveAmountX=100;
      const moveAmountY=200;
      cy.get('.konvajs-content')
      .trigger('mousedown',startX,startY)
      .trigger('mousemove',startX+moveAmountX,startY+moveAmountY)
      .trigger('mouseup').then(()=>{
        expect(data.shapes).have.length(1);
        expect(data.shapes[0].x).to.equal(initialCoords.x+moveAmountX);
        expect(data.shapes[0].y).to.equal(initialCoords.y+moveAmountY);
      });
    });
  })
})