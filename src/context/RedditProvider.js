import React, { useState, useEffect, useCallback } from 'react';
import RedditContext from './RedditContext';
import PropTypes from 'prop-types';

import { getPostsBySubreddit } from '../services/redditAPI';


function RedditProvider (props) {
    const INITIAL_STATE = {
      postsBySubreddit: {
        frontend: {},
        reactjs: {},
      },
      selectedSubreddit: 'reactjs',
      shouldRefreshSubreddit: false,
      isFetching: false,
    };

    const [state, setState] = useState(INITIAL_STATE);

    const fetchPosts = useCallback(
      () => {
        const {
          selectedSubreddit,
          postsBySubreddit,
          shouldRefreshSubreddit,
          isFetching,
        } = state;
        const posts = postsBySubreddit[selectedSubreddit];
        
        // if (!shouldFetchPosts()) return;
        //  if (!posts.items) return true;
        //  if (isFetching) return false;
        //  return shouldRefreshSubreddit;
      
        if (!isFetching && (!posts.items || shouldRefreshSubreddit)) {
          setState({
            ...state,
            shouldRefreshSubreddit: false,
            isFetching: true,
          });
      
          getPostsBySubreddit(selectedSubreddit)
          .then((json) => {
              const lastUpdated = Date.now();
              const items = json.data.children.map((child) => child.data);
              const newState = {
                ...state,
                shouldRefreshSubreddit: false,
                isFetching: false,
              };
            
              newState.postsBySubreddit[state.selectedSubreddit] = {
                items,
                lastUpdated,
              };
            
              setState(newState);
            })
          .catch((error) => {
            const newState = {
              ...state,
              shouldRefreshSubreddit: false,
              isFetching: false,
            };
            
            newState.postsBySubreddit[state.selectedSubreddit] = {
              error: error.message,
              items: [],
            };
          
            setState(newState);
          });
        }
      },
      [state],
    )
  
  useEffect(() => {
    const { shouldRefreshSubreddit, selectedSubreddit } = state;
    // const selectedSubredditChanged = prevState.selectedSubreddit !== state.selectedSubreddit;
    if (selectedSubreddit || shouldRefreshSubreddit) {
      fetchPosts();
    }
  }, [fetchPosts, state]);

  const handleSubredditChange = (selectedSubreddit) => {
    setState({ ...state, selectedSubreddit });
  }

  const handleRefreshSubreddit = () => {
    setState({ ...state, shouldRefreshSubreddit: true });
  }

  const { children } = props;
  const { selectedSubreddit, postsBySubreddit } = state;
  const context = {
    ...state,
    selectSubreddit: handleSubredditChange,
    fetchPosts: fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };

  return (
    <RedditContext.Provider value={context}>
      {children}
    </RedditContext.Provider>
  );
}

RedditProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RedditProvider;
