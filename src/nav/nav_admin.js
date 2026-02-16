// import accountNavGroup from './accountNav';

// // Admin Navigation Configuration
// const navigation = [
//   {
//     component: 'CNavGroup',
//     name: 'Dashboard',
//     to: '/dashboard',
//     icon: 'cil-speedometer',
//     items: [
//       {
//         component: 'CNavItem',
//         name: 'Dashboard',
//         to: '/dashboard',
//       },
//     ],
//   },
//   {
//     component: 'CNavGroup',
//     name: 'User Management',
//     icon: 'cil-user',
//     items: [
//       {
//         component: 'CNavItem',
//         name: 'Add Admin',
//         to: '/add-admin',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Assign Role',
//         to: '/assignrole',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Assign Company',
//         to: '/assigncompany',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Assigned Roles',
//         to: '/assigned-roles',
//       },
//     ],
//   },
//   {
//     component: 'CNavGroup',
//     name: 'Companies',
//     icon: 'cil-building',
//     items: [
//       {
//         component: 'CNavItem',
//         name: 'All Companies',
//         to: '/companies',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Department',
//         to: '/department',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Designation',
//         to: '/designation',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Add Role',
//         to: '/addrole',
//       },
//     ],
//   },
//   {
//     component: 'CNavGroup',
//     name: 'Operations',
//     icon: 'cil-cog',
//     items: [
//       {
//         component: 'CNavItem',
//         name: 'Create State',
//         to: '/createstate',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Create Destination',
//         to: '/createdestination',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Create Hotel',
//         to: '/createhotel',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Invoice Creation',
//         to: '/createinvoice',
//       },
//       {
//         component: 'CNavItem',
//         name: 'Invoice List',
//         to: '/invoicelist',
//       },
//     ],
//   },
//   accountNavGroup,
// ];

// export default navigation;


import accountNavGroup from './accountNav';

// Admin Navigation Configuration
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
        to: '/dashboard',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'User Management',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Add Admin',
        to: '/add-admin',
      },
      {
        component: 'CNavItem',
        name: 'Assign Role',
        to: '/assignrole',
      },
      {
        component: 'CNavItem',
        name: 'Assign Company',
        to: '/assigncompany',
      },
      {
        component: 'CNavItem',
        name: 'Assigned Roles',
        to: '/assigned-roles',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Companies',
    icon: 'cil-building',
    items: [
      {
        component: 'CNavItem',
        name: 'All Companies',
        to: '/companies',
      },
      {
        component: 'CNavItem',
        name: 'Department',
        to: '/department',
      },
      {
        component: 'CNavItem',
        name: 'Designation',
        to: '/designation',
      },
      {
        component: 'CNavItem',
        name: 'Add Role',
        to: '/addrole',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Operations',
    icon: 'cil-cog',
    items: [
      {
        component: 'CNavItem',
        name: 'Create State',
        to: '/createstate',
      },
      {
        component: 'CNavItem',
        name: 'Create Destination',
        to: '/createdestination',
      },
      {
        component: 'CNavItem',
        name: 'Create Hotel',
        to: '/createhotel',
      },
      {
        component: 'CNavItem',
        name: 'Invoice Creation',
        to: '/createinvoice',
      },
      {
        component: 'CNavItem',
        name: 'Invoice List',
        to: '/invoicelist',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'HRMS',
    icon: 'cil-people',
    items: [
      {
        component: 'CNavGroup',
        name: 'Employee Management',
        items: [
          {
            component: 'CNavItem',
            name: 'Employee Data',
            to: '/employee-data',
          },
        ],
      },
      {
        component: 'CNavGroup',
        name: 'Pay Roll',
        items: [
          {
            component: 'CNavItem',
            name: 'Salary List',
            to: '/salary-list',
          },
        ],
      },
      {
        component: 'CNavGroup',
        name: 'Inventory',
        items: [
          {
            component: 'CNavItem',
            name: 'SIM management',
            to: '/sim-management',
          },
          {
            component: 'CNavItem',
            name: 'Email management',
            to: '/email-management',
          },
        ],
      },
    ],
  },
  accountNavGroup,
];

export default navigation;