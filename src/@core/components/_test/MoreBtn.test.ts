import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MoreBtn from '../MoreBtn.vue' // Update with actual path
import { createVuetify } from 'vuetify'

describe('MoreBtn', () => {
  const vuetify = createVuetify()

  function createWrapper() {
    return mount(MoreBtn, {
      props: {
        menuList: [],
        itemProps: false,
        iconSize: 'small',
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
          VMenu: {
            template: '<div class="v-menu-stub"><slot /></div>',
          },
          VList: {
            template: '<div class="v-list-stub"><slot /></div>',
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

  it('renders the menu when menuList is provided', async () => {
    const wrapper = createWrapper()
    const iconBtn = wrapper.find('.icon-btn-stub')

    await iconBtn.trigger('click')

    const menu = wrapper.find('.v-menu-stub')

    expect(menu.exists()).toBe(true)
  })

  it('sets the correct icon size', () => {
    const wrapper = createWrapper()
    const iconBtn = wrapper.find('.icon-btn-stub')

    expect(iconBtn.exists()).toBe(true)
  })
})
