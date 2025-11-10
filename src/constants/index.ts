const sidebarAccount = computed(() => {
  return [
    {
      id: 1,
      title: 'User',
      disable: false,
      hidden: false,
      to: '/user',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 2,
      title: 'Role',
      disable: false,
      hidden: false,
      to: '/role',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 3,
      title: 'Permission',
      disable: false,
      hidden: false,
      to: '/permission',
      roles: ['superadmin', 'admin'] as string[],
    },
  ]
})

const sidebarMaster = computed(() => {
  return [
    {
      id: 0,
      title: 'Data Organisasi',
      disable: false,
      hidden: false,
      to: '/org-unit',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 1,
      title: 'Data Pegawai',
      disable: false,
      hidden: false,
      to: '/employee',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 2,
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
      id: 3,
      title: 'Data Program Studi',
      disable: false,
      hidden: false,
      to: '/study-program',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 4,
      title: 'Data Laboratorium',
      disable: false,
      hidden: false,
      to: '/laboratory',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 5,
      title: 'Data Mahasiswa',
      disable: false,
      hidden: false,
      to: '/student',
      roles: ['superadmin', 'admin'] as string[],
    },
  ]
})

const sidebarAcademic = computed(() => {
  return [
    {
      id: 1,
      title: 'Data Tahun Ajaran',
      disable: false,
      hidden: false,
      to: '/session',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 2,
      title: 'Data Semester',
      disable: false,
      hidden: false,
      to: '/semester',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 3,
      title: 'Data Mata Kuliah',
      disable: false,
      hidden: false,
      to: '/subject',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 4,
      title: 'Setting Mata Kuliah',
      disable: false,
      hidden: false,
      to: '/subject/setting',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 5,
      title: 'Setting Pengampu Mata Kuliah',
      disable: false,
      hidden: false,
      to: '/subject/lecture',
      roles: ['superadmin', 'admin'] as string[],
    },
  ]
})

const sidebarAPI = computed(() => {
  return [
    {
      id: 1,
      title: 'Oauth Client',
      disable: false,
      hidden: false,
      to: '/oauth-client',
      roles: ['superadmin', 'admin'] as string[],
    },
    {
      id: 2,
      title: 'Dokumentasi API',
      disable: false,
      hidden: false,
      to: null,
      href: 'https://vw4ns0iwjp.apidog.io',
      roles: ['superadmin', 'admin'] as string[],
      target: '_blank',
    },
  ]
})

export { sidebarMaster, sidebarAcademic, sidebarAPI, sidebarAccount }
