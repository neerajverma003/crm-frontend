import accountNavGroup from './accountNav';

// Employee Navigation Configuration
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
    name: 'Lead Management',
    icon: 'cil-briefcase',
    items: [
      {
        component: 'CNavItem',
        name: 'My Leads',
        to: '/myleads'
      },
      {
        component: 'CNavItem',
        name: 'My Assigned Lead',
        to: '/myleads?tab=assigned'
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
  accountNavGroup,
];

export default navigation;