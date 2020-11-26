import other from './other';
import user from './user';
import manager from './manager';
import app from './app';

export default [
  {
    layout: {
      header: true,
    },
    children: [
      ...other,
      ...user,
      ...manager,
      ...app,
    ],
  },
];
