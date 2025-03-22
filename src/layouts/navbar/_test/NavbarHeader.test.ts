import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import NavbarHeader from '@/layouts/navbar/NavbarHeader.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: {} }],
})

describe('NavbarHeader', () => {
  const vuetify = createVuetify()
  const toggleMock = vi.fn()

  function createWrapper() {
    return mount(NavbarHeader, {
      props: {
        toggleIsOverlayNavActive: toggleMock,
      },
      global: {
        plugins: [router, vuetify],
        stubs: {
          IconBtn: {
            template: '<button class="icon-btn-stub" @click="$emit(\'click\')"><slot /></button>',
            emits: ['click'],
          },
          VIcon: {
            template: '<i class="v-icon-stub">icon</i>',
          },
          RouterLink: {
            template: '<a :href="to" class="router-link-stub"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })
  }

  it('renders the app title correctly', () => {
    const wrapper = createWrapper()
    const title = wrapper.find('h1')

    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Materio')
  })

  it('renders RouterLink pointing to home route', () => {
    const wrapper = createWrapper()
    const routerLink = wrapper.find('.router-link-stub')

    expect(routerLink.exists()).toBe(true)
    expect(routerLink.attributes('href')).toBe('/')
  })

  it('calls toggleIsOverlayNavActive with false when IconBtn is clicked', async () => {
    const wrapper = createWrapper()
    const IconBtn = wrapper.find('.icon-btn-stub')

    expect(IconBtn.exists()).toBe(true)

    await IconBtn.trigger('click')

    expect(toggleMock).toHaveBeenCalledTimes(1)
    expect(toggleMock).toHaveBeenCalledWith(false)
  })

  it('renders an icon inside the IconBtn', () => {
    const wrapper = createWrapper()
    const IconBtn = wrapper.find('.icon-btn-stub')
    const icon = wrapper.find('.v-icon-stub')

    expect(IconBtn.exists()).toBe(true)
    expect(icon.exists()).toBe(true)
  })
})
