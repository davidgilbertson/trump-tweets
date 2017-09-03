import React, { Component } from 'react';
import './App.css';

import QuestionPage from './QuestionPage/QuestionPage';
import FinishPage from './FinishPage/FinishPage';
import AnswerPage from './AnswerPage/AnswerPage';
import { getTweetUrl, shuffle } from './utils';
import { TWEETS } from './data/tweets.js'

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
            href={getTweetUrl('Check out the Trump Tweet Quiz')}
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
