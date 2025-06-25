const sidebarMaster = computed(() => {
  return [
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
export { sidebarMaster, sidebarAcademic }
