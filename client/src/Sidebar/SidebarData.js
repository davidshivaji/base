import React from 'react';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
  {
    title: 'Settings',
    path: '/settings',
    icon: null,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Account Settings',
        path: '/settings/account'

      },
      {
        title: 'Profile Settings',
        path: '/settings/profile'
      }
    ]
  }
];
