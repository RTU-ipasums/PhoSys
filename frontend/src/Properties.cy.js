import Properties from './Properties.vue'

describe('Properties', () => {
  it('shows global properties with no objects selected', () => {
    cy.mount(Properties, {
      data() {
        return {
          selectedShapes: []
        }
      }
    })
    cy.contains('Global settings')
  })
})