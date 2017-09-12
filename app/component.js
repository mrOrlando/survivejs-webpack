export default (text = 'Hello world') => {
  const element = document.createElement('div');

  // element.className = 'pure-button';
  element.className = 'fa fa-hand-spock-o fa-lg';
  element.innerHTML = text;

  return element;
};
