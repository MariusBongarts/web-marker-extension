var highlighter;

rangy.init();
highlighter = rangy.createHighlighter();
highlighter.addClassApplier(rangy.createClassApplier('highlight'));

export function highlight() {
  highlighter.highlightSelection('highlight');
  var selTxt = rangy.getSelection();
  console.log('selTxt: '+selTxt);
  rangy.getSelection().removeAllRanges();
}

export function removeHighlights() {
  highlighter.removeAllHighlights();
}

function showStyle() {
  alert(document.querySelector('style').innerHTML);
}

document.getElementById('highlight').addEventListener('click', highlight);
document.getElementById('remove').addEventListener('click', removeHighlights);
document.getElementById('show').addEventListener('click', showStyle);