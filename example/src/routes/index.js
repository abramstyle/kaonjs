import React from 'react';
import App from '../containers/App';
import Posts from '../containers/Posts';
import Comments from '../containers/Comments';
import Profile from '../containers/Profile';

function Detail() {
  return <detail />;
}

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/posts',
        component: Posts,
        routes: [{
          path: '/posts/detail',
          component: Detail,
        }],
      }, {
        path: '/comments',
        component: Comments,
      }, {
        path: '/profile',
        component: Profile,
      },
    ],
  },
];

export default routes;
