import React, { Component } from 'react';
import classnames from 'classnames';
import './App.css';
import { TWEETS } from './data/tweets.js'

const TWITTER_SHARE_MESSAGE = 'Check out the Trump Tweet Quiz';

const getTweetUrl = message => {
  const fullMessage = `${message} by @D__Gilbertson ${document.location.href} #trumptweetquiz`;

  return `https://twitter.com/home?status=${encodeURIComponent(fullMessage)}`;
};

const getTwitterShareScoreUrl = score => getTweetUrl(`I got ${score}% on the Trump Tweet Quiz`);

const shuffle = (arr) => {
  const sorted = arr.slice(); // don't mess with original array

  return sorted.sort(() => Math.random() - 0.5);
};

const Tweet = (props) => {
  const classname = classnames(
    'tweet',
    { 'tweet--real': props.isRealTweet },
    { 'tweet--wrong': props.isWrongGuess },
  );

  return (
    <a
      className={classname}
      href={props.tweet.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={props.onClick}
    >
      {props.tweet.text}
    </a>
  );
};

const QuestionPage = (props) => {
  let topMessage = '';

  // TODO (davidg): ternary
  if (props.currentTweetIndex === 0) {
    topMessage = 'Click the real tweet';
  } else if (props.currentTweetIndex === TWEETS.length - 1) {
    topMessage = 'Last one!';
  } else {
    topMessage = `${props.currentTweetIndex + 1} of ${TWEETS.length}`;
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
        {!!props.goToPrevPage &&
          <button
            className="answer-page__nav-button answer-page__nav-button--prev"
            onClick={props.goToPrevPage}
          >〈 Prev</button>
        }

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

const FinishPage = (props) => {
  const score = Math.round((props.rightAnswerCount / props.totalTweetCount) * 100);

  return (
    <div className="finish-page">
      <p className="finish-page__score-finish">Finished!</p>

      <p className="finish-page__score-intro">You scored</p>

      <p className="finish-page__score">{score}%</p>

      <a
        className="finish-page__share"
        href={getTwitterShareScoreUrl(score)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="finish-page__share-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 612 612"
          width="50"
          height="50"
        >
          <g>
            <path d="M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411
                  c-24.322,14.379-51.169,24.82-79.775,30.48c-22.907-24.437-55.49-39.658-91.63-39.658c-69.334,0-125.551,56.217-125.551,125.513
                  c0,9.828,1.109,19.427,3.251,28.606C197.065,206.32,104.556,156.337,42.641,80.386c-10.823,18.51-16.98,40.078-16.98,63.101
                  c0,43.559,22.181,81.993,55.835,104.479c-20.575-0.688-39.926-6.348-56.867-15.756v1.568c0,60.806,43.291,111.554,100.693,123.104
                  c-10.517,2.83-21.607,4.398-33.08,4.398c-8.107,0-15.947-0.803-23.634-2.333c15.985,49.907,62.336,86.199,117.253,87.194
                  c-42.947,33.654-97.099,53.655-155.916,53.655c-10.134,0-20.116-0.612-29.944-1.721c55.567,35.681,121.536,56.485,192.438,56.485
                  c230.948,0,357.188-191.291,357.188-357.188l-0.421-16.253C573.872,163.526,595.211,141.422,612,116.258z"/>
          </g>
        </svg>

        Share your score
      </a>
    </div>
  );
};

const PAGES = {
  QUESTION: QuestionPage,
  ANSWER: AnswerPage,
  FINISH: FinishPage,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTweetIndex: 0,
      page: PAGES.QUESTION,
      rightAnswerCount: 0,
    };

    this.tweets = TWEETS.map(tweetSet => shuffle(tweetSet));

    this.makeAGuess = this.makeAGuess.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  makeAGuess({index, isRight}) {
    this.setState(state => ({
      page: PAGES.ANSWER,
      guessIndex: index,
      rightAnswerCount: state.rightAnswerCount + (isRight ? 1 : 0),
    }));
  }

  goToPage(direction) {
    this.setState(state => ({
      ...state,
      page: direction ? PAGES.QUESTION : PAGES.FINISH, // if no direction is set, go to the last page. Dodgy.
      currentTweetIndex: state.currentTweetIndex + direction,
    }));
  }

  render() {
    const { state } = this;

    const tweetSet = this.tweets[state.currentTweetIndex];

    const Page = state.page;

    const isFirstPage = state.currentTweetIndex === 0;
    const isLastPage = state.currentTweetIndex === this.tweets.length - 1;

    return (
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">Trump Tweets</h1>
          <a
            className="app__share"
            href={getTweetUrl(TWITTER_SHARE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Twitter
          </a>

        </header>

        <main className="app__body">
          <Page
            totalTweetCount={this.tweets.length}
            tweets={tweetSet}
            makeAGuess={this.makeAGuess}
            guessIndex={state.guessIndex}
            rightAnswerCount={state.rightAnswerCount}
            currentTweetIndex={state.currentTweetIndex}
            goToPrevPage={isFirstPage ? null : () => this.goToPage(-1)}
            goToNextPage={() => this.goToPage(isLastPage ? null : 1)}
            nextButtonText={isLastPage ? 'Finish' : 'Next'}
          />
        </main>
      </div>
    );
  }
}

export default App;
