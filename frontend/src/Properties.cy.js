import Properties from './Properties.vue'

describe('Properties', () => {
  it('shows global properties with no objects selected', () => {
    cy.mount(Properties, {
      props: {
          selectedShapes: []
      }
    })
    cy.contains('Global settings')
  })
})