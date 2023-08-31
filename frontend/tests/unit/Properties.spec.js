import { mount } from '@vue/test-utils'
import Properties from '../../src/Properties.vue'

test('Checks global properties', () => {
    const wrapper = mount(Properties, {
        props: {
            selectedShapes: []
        }
    })
  
    expect(wrapper.text()).toContain('Global settings')
})