export const getTweetUrl = message => {
  const fullMessage = `${message} by @D__Gilbertson ${document.location.href} #trumptweetquiz`;

  return `https://twitter.com/home?status=${encodeURIComponent(fullMessage)}`;
};

export const getTwitterShareScoreUrl = score => getTweetUrl(`I got ${score}% on the Trump Tweet Quiz`);

export const shuffle = (arr) => {
  const sorted = arr.slice(); // don't mess with original array

  return sorted.sort(() => Math.random() - 0.5);
};
