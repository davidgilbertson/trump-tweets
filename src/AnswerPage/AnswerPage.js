import React from 'react';
import PropTypes from 'prop-types';

import './AnswerPage.css';
import Tweet from '../Tweet/Tweet';

const AnswerPage = (props) => {
  if (typeof props.guessIndex !== 'number') {
    console.error('You have set the page to "Answer" but have not set the guessIndex');
    return null;
  }

  const userIsWrong = !props.tweets[props.guessIndex].url;


  const rightWrongMessage = userIsWrong
    ? <p className="answer-page__wrong-message">Wrong!</p>
    : <p className="answer-page__correct-message">Correct!</p>;

  return (
    <div>
      <div className="answer-page__nav-wrapper">
        {/*{!!props.goToPrevPage &&*/}
        {/*<button*/}
          {/*className="answer-page__nav-button answer-page__nav-button--prev"*/}
          {/*onClick={props.goToPrevPage}*/}
        {/*>〈 Prev</button>*/}
        {/*}*/}

        {rightWrongMessage}

        <button
          className="answer-page__nav-button answer-page__nav-button--next"
          onClick={props.goToNextPage}
        >{props.nextButtonText} 〉</button>
      </div>

      {props.tweets.map((tweet, i) => (
        <Tweet
          key={tweet.text}
          tweet={tweet}
          userIsWrong={userIsWrong}
          isRealTweet={!!tweet.url}
          isWrongGuess={userIsWrong && props.guessIndex === i}
        />
      ))}
    </div>
  );
};

AnswerPage.propTypes = {
  guessIndex: PropTypes.number.isRequired,
  currentTweetIndex: PropTypes.number.isRequired,
  goToPrevPage: PropTypes.func,
  goToNextPage: PropTypes.func.isRequired,
  nextButtonText: PropTypes.string.isRequired,
  tweets: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
};

export default AnswerPage;
