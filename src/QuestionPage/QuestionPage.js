import React from 'react';
import PropTypes from 'prop-types';

import './QuestionPage.css';
import Tweet from '../Tweet/Tweet';

const QuestionPage = (props) => {
  let topMessage = '';

  if (props.currentTweetIndex === 0) {
    topMessage = 'Click the real tweet';
  } else if (props.currentTweetIndex === props.totalTweetCount - 1) {
    topMessage = 'Last one!';
  } else {
    topMessage = `${props.currentTweetIndex + 1} of ${props.totalTweetCount}`;
  }

  return (
    <div>
      <div className="question-page__top-message">{topMessage}</div>

      {props.tweets.map((tweet, i) => (
        <Tweet
          key={tweet.text}
          tweet={tweet}
          onClick={(e) => {
            e.preventDefault();
            props.makeAGuess({
              index: i,
              isRight: !!tweet.url,
            })
          }}
        />
      ))}
    </div>
  );
};

QuestionPage.propTypes = {
  totalTweetCount: PropTypes.number.isRequired,
  currentTweetIndex: PropTypes.number.isRequired,
  tweets: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
};

export default QuestionPage;
