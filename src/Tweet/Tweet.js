import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Tweet.css';

const Tweet = (props) => {
  const className = classnames(
    'tweet',
    { 'tweet--real': props.isRealTweet },
    { 'tweet--wrong': props.isWrongGuess },
  );

  const badge = props.isRealTweet
    ? <span className="tweet__twitter-badge">View on Twitter</span>
    : null;

  return (
    <a
      className={className}
      href={props.tweet.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={props.onClick}
    >
      {props.tweet.text}

      {badge}
    </a>
  );
};

Tweet.propTypes = {
  isRealTweet: PropTypes.bool,
  isWrongGuess: PropTypes.bool,
  tweet: PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string,
  }),
};

export default Tweet;
