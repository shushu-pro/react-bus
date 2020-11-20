import other from './other';
import user from './user';
import manage from './manage';

export default [
  {
    layout: {
      header: true,
    },
    children: [
      ...other,
      ...user,
      ...manage,
    ],
  },
];
