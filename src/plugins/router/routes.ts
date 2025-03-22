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
            path: 'detail/:majorId',
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
                    path: 'study-program/detail/:studyProgramId',
                    name: 'major.detail.study-program.detail',
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
