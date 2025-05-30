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
                        path: '',
                        name: 'major.detail.study-program.detail.class',
                        children: [
                          {
                            path: 'class',
                            name: 'major.detail.study-program.detail.class.index',
                            component: () => import('@/pages/class/IndexClass.vue'),
                            meta: {
                              roles: ['admin', 'superadmin'],
                              title: 'Kelas',
                            },
                          },
                          {
                            path: 'class/:classId',
                            name: 'major.detail.study-program.detail.class.detail',
                            children: [
                              {
                                path: 'student',
                                name: 'major.detail.study-program.detail.class.detail.student.index',
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
            },
          },
        ],
      },
      {
        path: '/class',
        name: 'class',
        children: [
          {
            path: '',
            name: 'class.index',
            component: () => import('@/pages/class/IndexClass.vue'),
            meta: {
              roles: ['admin', 'superadmin'],
              title: 'Kelas',
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
      },
      // {
      //   path: '/:pathMatch(.*)*',
      //   component: () => import('@/pages/[...error].vue'),
      // },
    ],
  },
]
