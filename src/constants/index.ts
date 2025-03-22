const sidebarMaster = computed(() => {
  return [
    {
      id: 1,
      title: 'Data Jurusan',
      icon: '',
      badgeContent: '',
      badgeClass: '',
      disable: false,
      hidden: false,
      to: '/major',
      href: '',
      target: '',
      rel: '',
      action: '',
      subject: '',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 2,
      title: 'Data Program Studi',
      disable: false,
      hidden: false,
      to: '/study-program',
      roles: ['superadmin', 'admin'] as string[],
    },
  ]
})

export { sidebarMaster }
