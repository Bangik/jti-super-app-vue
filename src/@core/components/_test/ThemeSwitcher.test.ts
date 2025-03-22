import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeSwitcher from '../ThemeSwitcher.vue'
import { createVuetify } from 'vuetify'

describe('ThemeSwitcher', () => {
  const vuetify = createVuetify()

  function createWrapper() {
    return mount(ThemeSwitcher, {
      props: {
        themes: [
          { name: 'light', icon: 'mdi-white-balance-sunny' },
          { name: 'dark', icon: 'mdi-weather-night' },
        ],
      },
      global: {
        plugins: [vuetify],
        stubs: {
          IconBtn: {
            template: '<button class="icon-btn-stub" @click="$emit(\'click\')"><slot /></button>',
            emits: ['click'],
          },
          VIcon: {
            template: '<i class="v-icon-stub">icon</i>',
          },
          VTooltip: {
            template: '<div class="v-tooltip-stub"><slot /></div>',
          },
        },
      },
    })
  }

  it('renders correctly with default props', () => {
    const wrapper = createWrapper()
    const iconBtn = wrapper.find('.icon-btn-stub')

    expect(iconBtn.exists()).toBe(true)
    expect(iconBtn.find('.v-icon-stub').exists()).toBe(true)
  })
})
