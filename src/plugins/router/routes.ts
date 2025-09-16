export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/layouts/IndexLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard.index',
        component: () => import('@/pages/home/IndexHome.vue'),
        meta: {
          title: 'Dashboard',
          back: false,
        },
      },
      {
        path: '/employee',
        name: 'employee',
        children: [
          {
            path: '',
            name: 'employee.index',
            component: () => import('@/pages/employee/IndexEmployee.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Pegawai',
              back: false,
            },
          },
          {
            path: 'create',
            name: 'employee.create',
            component: () => import('@/pages/employee/IndexCreateDetailEmployee.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Tambah Pegawai',
            },
          },
          {
            path: ':employeeId',
            name: 'employee.detail',
            component: () => import('@/pages/employee/IndexCreateDetailEmployee.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Detail Pegawai',
            },
          },
        ],
      },
      {
        path: '/major',
        name: 'major',
        children: [
          {
            path: '',
            name: 'major.index',
            component: () => import('@/pages/major/IndexMajor.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Jurusan',
              back: false,
            },
          },
          {
            path: ':majorId',
            name: 'major.detail',
            children: [
              {
                path: '',
                name: 'major.detail.study-program',
                children: [
                  {
                    path: 'study-program',
                    name: 'major.detail.study-program.index',
                    component: () => import('@/pages/study-program/IndexStudyProgram.vue'),
                    meta: {
                      roles: ['admin', 'superadmin'],
                      title: 'Program Studi',
                    },
                  },
                  {
                    path: 'study-program/:studyProgramId',
                    name: 'major.detail.study-program.detail',
                    children: [
                      {
                        path: 'student',
                        name: 'major.detail.study-program.detail.student.index',
                        component: () => import('@/pages/student/IndexStudent.vue'),
                        meta: {
                          roles: ['admin', 'superadmin'],
                          title: 'Mahasiswa',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/study-program',
        name: 'study-program',
        children: [
          {
            path: '',
            name: 'study-program.index',
            component: () => import('@/pages/study-program/IndexStudyProgram.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Program Studi',
              back: false,
            },
          },
        ],
      },
      {
        path: '/laboratory',
        name: 'laboratory',
        children: [
          {
            path: '',
            name: 'laboratory.index',
            component: () => import('@/pages/lab/IndexLaboratory.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Laboratorium',
              back: false,
            },
          },
          {
            path: 'create',
            name: 'laboratory.create',
            component: () => import('@/pages/lab/IndexCreate.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Tambah Laboratorium',
              back: true,
            },
          },
        ],
      },
      {
        path: '/session',
        name: 'session',
        children: [
          {
            path: '',
            name: 'session.index',
            component: () => import('@/pages/session/IndexSession.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Tahun Ajaran',
              back: false,
            },
          },
        ],
      },
      {
        path: '/semester',
        name: 'semester',
        children: [
          {
            path: '',
            name: 'semester.index',
            component: () => import('@/pages/semester/IndexSemester.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Semester',
              back: false,
            },
          },
        ],
      },
      {
        path: '/student',
        name: 'student',
        children: [
          {
            path: '',
            name: 'student.index',
            component: () => import('@/pages/student/IndexStudent.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Mahasiswa',
              back: false,
            },
          },
          {
            path: 'create',
            name: 'student.create',
            component: () => import('@/pages/student/CreateDetailStudent.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Tambah Mahasiswa',
              back: true,
            },
          },
          {
            path: ':studentId',
            name: 'student.detail',
            component: () => import('@/pages/student/CreateDetailStudent.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Detail Mahasiswa',
              back: true,
            },
          },
        ],
      },
      {
        path: '/subject',
        name: 'subject',
        children: [
          {
            path: '',
            name: 'subject.index',
            component: () => import('@/pages/subject/IndexSubject.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Mata Kuliah',
              back: false,
            },
          },
          {
            path: 'setting',
            name: 'subject.setting',
            component: () => import('@/pages/subject/SettingSubject.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Pengaturan Mata Kuliah',
              back: false,
            },
          },
          {
            path: 'lecture',
            name: 'subject.lecture',
            component: () => import('@/pages/subject/SettingLecture.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Pengaturan Pengampu Matkul',
              back: false,
            },
          },
        ],
      },
      {
        path: '/oauth-client',
        name: 'oauth-client',
        children: [
          {
            path: '',
            name: 'oauth-client.index',
            component: () => import('@/pages/oauth/IndexOauth.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'List Oauth Client',
              back: false,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
          public: true,
          title: 'Login',
        },
      },
      {
        path: 'auth/callback',
        name: 'auth.callback',
        component: () => import('@/pages/auth/AuthCallback.vue'),
        meta: {
          public: true,
          title: 'Login Sukses',
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
        meta: {
          public: true,
          title: 'Forgot Password',
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        meta: {
          public: true,
          title: 'Reset Password',
        },
      },
      // {
      //   path: '/:pathMatch(.*)*',
      //   component: () => import('@/pages/[...error].vue'),
      // },
    ],
  },
]
