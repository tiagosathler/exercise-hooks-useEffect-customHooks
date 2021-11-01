import React from 'react';

import RedditContext from '../context/RedditContext';

const renderOptions = (options) => (
  options.map((option) => (
    <option
      value={option}
      key={option}
    >
      {option}
    </option>
  ))
);

const Selector = () => (
  <RedditContext.Consumer>
    {({ selectedSubreddit, availableSubreddits, selectSubreddit }) => (
      <span>
        <h1>{`Selected: ${selectedSubreddit}`}</h1>
        <select
          onChange={(e) => selectSubreddit(e.target.value)}
          value={selectedSubreddit}
        >
          {renderOptions(availableSubreddits)}
        </select>
      </span>
    )}
  </RedditContext.Consumer>
);

export default Selector;