// Shared Account navigation group used by all core sidebars
const accountNavGroup = {
  component: 'CNavGroup',
  name: 'Account',
  icon: 'cil-lock-locked',
  items: [
    {
      component: 'CNavItem',
      name: 'Change Password',
      to: '/change-password',
    },
  ],
};

export default accountNavGroup;

