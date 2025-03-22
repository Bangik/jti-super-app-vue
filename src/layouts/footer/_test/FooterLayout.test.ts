import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FooterComponent from '@/layouts/footer/FooterLayout.vue' // Adjust path accordingly
import { createVuetify } from 'vuetify'
import { VIcon } from 'vuetify/components/VIcon'

const vuetify = createVuetify()

describe('FooterComponent', () => {
  it('renders the current year correctly', () => {
    const wrapper = mount(FooterComponent, {
      global: {
        plugins: [vuetify],
      },
    })
    const currentYear = new Date().getFullYear()
    expect(wrapper.text()).toContain(currentYear.toString())
  })

  it('renders the heart icon', () => {
    const wrapper = mount(FooterComponent, {
      global: {
        plugins: [vuetify],
        components: { VIcon },
      },
    })
    const icon = wrapper.find('i.ri-heart-line')
    expect(icon.exists()).toBe(true)
  })

  it('renders the correct link to Bangik', () => {
    const wrapper = mount(FooterComponent, {
      global: {
        plugins: [vuetify],
      },
    })
    const link = wrapper.find('a[href="https://bangik.github.io"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Bangik')
  })
})
