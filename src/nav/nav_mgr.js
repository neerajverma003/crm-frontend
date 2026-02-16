// Manager Navigation Configuration
const navigation = [
  {
    component: 'CNavGroup',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    items: [
      {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/dashboard'
      }
    ]
  },
  {
    component: 'CNavGroup',
    name: 'User Management',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Assigned Roles',
        to: '/assigned-roles'
      }
    ]
  },
  {
    component: 'CNavGroup',
    name: 'Companies',
    icon: 'cil-building',
    items: [
      {
        component: 'CNavItem',
        name: 'All Companies',
        to: '/companies'
      }
    ]
  },
  {
    component: 'CNavGroup',
    name: 'Operations',
    icon: 'cil-cog',
    items: [
      {
        component: 'CNavItem',
        name: 'Create State',
        to: '/createstate'
      },
      {
        component: 'CNavItem',
        name: 'Create Destination',
        to: '/createdestination'
      },
      {
        component: 'CNavItem',
        name: 'Create Hotel',
        to: '/createhotel'
      }
    ]
  },
  {
    component: 'CNavGroup',
    name: 'Account',
    icon: 'cil-lock-locked',
    items: [
      {
        component: 'CNavItem',
        name: 'Change Password',
        to: '/change-password'
      }
    ]
  }
];

export default navigation;