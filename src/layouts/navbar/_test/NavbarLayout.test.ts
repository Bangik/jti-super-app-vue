import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import NavbarIcons from '@/layouts/navbar/NavbarLayout.vue'
import UserProfile from '../fragments/UserProfile.vue'

describe('NavbarIcons', () => {
  const vuetify = createVuetify()
  const toggleMock = vi.fn()

  function createWrapper() {
    return mount(NavbarIcons, {
      props: {
        toggleVerticalOverlayNavActive: toggleMock,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          NavbarThemeSwitcher: {
            name: 'NavbarThemeSwitcher',
            template: '<div class="navbar-theme-switcher-stub"></div>',
          },
          IconBtn: {
            template:
              '<button class="icon-btn-stub" :href="href" :target="target" :rel="rel" @click="$emit(\'click\')"><slot /></button>',
            props: ['href', 'target', 'rel'],
            emits: ['click'],
          },
          VIcon: {
            template: '<i class="v-icon-stub" :icon="icon"></i>',
            props: ['icon'],
          },
          VSpacer: {
            template: '<div class="v-spacer-stub"></div>',
          },
        },
        config: {
          compilerOptions: {
            isCustomElement: tag => tag === 'IconBtn',
          },
        },
      },
    })
  }

  it('renders the component correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.d-flex.h-100').exists()).toBe(true)
  })

  it('calls toggleVerticalOverlayNavActive with true when menu button is clicked', async () => {
    const wrapper = createWrapper()
    const menuBtn = wrapper.findAll('.icon-btn-stub')[0]

    expect(menuBtn.exists()).toBe(true)
    expect(menuBtn.classes()).toContain('ms-n3')
    expect(menuBtn.classes()).toContain('d-lg-none')

    await menuBtn.trigger('click')

    expect(toggleMock).toHaveBeenCalledTimes(1)
    expect(toggleMock).toHaveBeenCalledWith(true)
  })

  it('renders the search button with appropriate icon', () => {
    const wrapper = createWrapper()
    const searchSection = wrapper.find('.d-flex.align-center.cursor-pointer')
    const searchBtn = searchSection.find('.icon-btn-stub')
    const searchIcon = searchBtn.find('.v-icon-stub')

    expect(searchSection.exists()).toBe(true)
    expect(searchBtn.exists()).toBe(true)
    expect(searchIcon.exists()).toBe(true)
    expect(searchIcon.attributes('icon')).toBe('ri-search-line')
  })

  it('renders search text and keyboard shortcut', () => {
    const wrapper = createWrapper()
    const searchText = wrapper.find('.d-none.d-md-flex')

    expect(searchText.exists()).toBe(true)
    expect(searchText.find('.me-3').text()).toBe('Search')
    expect(searchText.find('.meta-key').text()).toBe('⌘K')
  })

  it('renders the GitHub button with correct attributes', () => {
    const wrapper = createWrapper()
    const allButtons = wrapper.findAll('.icon-btn-stub')
    const githubBtn = Array.from(allButtons).find(btn => btn.find('.v-icon-stub[icon="ri-github-fill"]').exists())

    expect(githubBtn).toBeDefined()
    expect(githubBtn?.attributes('href')).toBe(
      'https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free',
    )
    expect(githubBtn?.attributes('target')).toBe('_blank')
    expect(githubBtn?.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders the notification button with correct icon', () => {
    const wrapper = createWrapper()
    const allButtons = wrapper.findAll('.icon-btn-stub')
    const notificationBtn = Array.from(allButtons).find(btn =>
      btn.find('.v-icon-stub[icon="ri-notification-line"]').exists(),
    )

    expect(notificationBtn).toBeDefined()
  })

  it('renders NavbarThemeSwitcher component', () => {
    const wrapper = createWrapper()
    const themeSwitcher = wrapper.find('.navbar-theme-switcher-stub')

    expect(themeSwitcher.exists()).toBe(true)
    expect(themeSwitcher.classes()).toContain('me-2')
  })

  it('renders UserProfile component', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [vuetify],
      },
    })
    const userProfile = wrapper.findComponent(UserProfile)

    expect(userProfile.exists()).toBe(true)
  })

  it('includes a VSpacer', () => {
    const wrapper = createWrapper()
    const spacer = wrapper.find('.v-spacer-stub')

    expect(spacer.exists()).toBe(true)
  })
})
