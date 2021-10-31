import React from 'react';

import RedditContext from '../context/RedditContext';

const Posts = () => (
  <RedditContext.Consumer>
    {({ posts }) => (
      <ul>
        {posts.map(({ id, title }) => <li key={id}>{title}</li>)}
      </ul>
    )}
  </RedditContext.Consumer>
);

export default Posts;