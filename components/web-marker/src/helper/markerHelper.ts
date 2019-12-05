import { store } from './../store/store';
import { MyMarkerElement } from './../components/my-marker/my-marker.component';
import { Mark } from './../models/mark';
import uuidv4 from 'uuid/v4';
import { getTitleForBookmark } from './bookmarkHelper';
import rangy from 'rangy-updated';
import 'rangy-updated/lib/rangy-classapplier';
import 'rangy-updated/lib/rangy-highlighter';
import 'rangy-updated/lib/rangy-textrange';
import 'rangy-updated/lib/rangy-serializer';
import 'rangy-updated/lib/rangy-selectionsaverestore';


export function highlightText(range?: Range, mark?: Mark) {

  try {
    //const markElement = markWithRangy(mark);
    addStyles();
    markWithRangy(mark);
    //createMyMarkerComponent(markElement, mark);

  } catch (error) {
    console.log(error);
    //
  }
}

function markWithRangy(mark: Mark) {

  const rangyObject = JSON.parse(mark.rangyObject);
  console.log(rangyObject);

  let highlighter;
  highlighter = rangy.createHighlighter();
  const applier = rangy.createClassApplier('highlight')
  highlighter.addClassApplier(applier);
  // rangy.deserializeSelection(rangyObject);
  highlighter.highlightSelection('highlight');
  rangy.getSelection().removeAllRanges();
}


/**
 * If @param text is given the mark is created by the context menu
 *
 * @export
 * @param {string} [text]
 * @returns {Mark}
 */
export function createMark(text?: string): Mark {
  var selObj = rangy.getSelection();
  var savedSel = rangy.serializeSelection(selObj, true);

  rangy.saveSelection();

  const selection = window.getSelection();

  // If selection is made by my-menu popup
  if (selection.toString()) {
    const range = selection.getRangeAt(0);
    const mark: Mark = {
      id: uuidv4(),
      url: location.href,
      origin: location.href,
      tags: [],
      text: selection.toString(),
      title: getTitleForBookmark(),
      anchorOffset: selection.anchorOffset,
      createdAt: new Date().getTime(),
      nodeData: range.startContainer.nodeValue,
      completeText: range.startContainer.parentElement.innerText,
      nodeTagName: range.startContainer.parentElement.tagName.toLowerCase(),
      startContainerText: range.startContainer.textContent,
      endContainerText: range.endContainer.textContent,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      scrollY: window.scrollY,
      rangyObject: JSON.stringify(savedSel)
    };

    localStorage.setItem('mark', JSON.stringify(mark));
    return mark;
  }
  // Mark is created by context menu
  else if (text) {
    return createContextMark(text)
  }
}


/**
 * Creates a mark from the context-menu by handing text instead of using getSelection()
 *
 * @export
 * @param {string} text
 * @returns {Mark}
 */
export function createContextMark(text: string): Mark {
  const selection = window.getSelection();
  let range = undefined;
  try {
    range = selection.getRangeAt(0);
  } catch (error) {
  }
  const mark: Mark = {
    id: uuidv4(),
    url: location.href,
    origin: location.href,
    tags: [],
    text: text,
    title: getTitleForBookmark(),
    anchorOffset: selection.anchorOffset,
    createdAt: new Date().getTime(),
    nodeData: range ? range.startContainer.nodeValue : text,
    completeText: range ? range.startContainer.parentElement.innerText : text,
    nodeTagName: range ? range.startContainer.parentElement.tagName.toLowerCase() : text,
    startContainerText: range ? range.startContainer.textContent : text,
    endContainerText: range ? range.endContainer.textContent : text,
    startOffset: range ? range.startOffset : 0,
    endOffset: range ? range.endOffset : 0,
    scrollY: window.scrollY
  };
  return mark;
}

/**
 * Creates the mark element to highlight text
 *
 * @param {Range} [range]
 * @param {Mark} [mark]
 * @returns
 */
function createMarkElement(range?: Range, mark?: Mark) {
  const markElement = recreateRange(mark);
  return markElement;
}

/**
 * Creates the mark in the DOM. Afterwards it listenes for a deletion event to remove it.
 *
 * @param {HTMLElement} markElement
 * @param {Mark} mark
 */
function createMyMarkerComponent(markElement: HTMLElement, mark: Mark) {
  const myMarkElement = document.createElement('my-marker') as MyMarkerElement;
  myMarkElement.mark = mark;
  myMarkElement.setAttribute('markId', mark.id);
  markElement.appendChild(myMarkElement);

  // Listen for state changes and delete mark from DOM if it got removed
  store.subscribe(() => {
    const lastAction = store.getState().lastAction;
    if (lastAction === 'REMOVE_MARK') {
      if (!store.getState().marks.find(e => e.id === mark.id)) {
        myMarkElement.remove();
        deleteMarkFromDom(markElement);
      }
    }
  });
}

export function deleteMarkFromDom(markElement: HTMLElement) {
  try {
    // Unwraps the mark element
    const parent = markElement.parentNode;
    // move all children out of the element
    while (markElement.firstChild) parent.insertBefore(markElement.firstChild, markElement);
    // remove the empty element
    parent.removeChild(markElement);
  } catch (error) {
    //
  }
}

function recreateRange(mark: Mark) {
  try {
    const startContainer = findStartEndContainer(document.body, mark, true);
    const endContainer = findStartEndContainer(document.body, mark, false);
    const range = document.createRange();
    range.setStart(startContainer, mark.startOffset);
    range.setEnd(endContainer, mark.endOffset);
    let markElement;
    let firstMarkElement;
    const commonAncestorContainer = range.commonAncestorContainer;
    let markedText = '';

    if (startContainer !== endContainer) {
      // Recreate container in between
      let followingSiblings = document.evaluate('.//parent::*/following-sibling::*//text()', startContainer, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let precedingSiblings = document.evaluate('.//parent::*/preceding-sibling::*//text()', endContainer, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0; i < followingSiblings.snapshotLength; i++) {
        let node = followingSiblings.snapshotItem(i);
        if (node.textContent) {
          let nodeIsInPrecedingSiblings = isAlsoInPrecedingSiblings(precedingSiblings, endContainer, node);
          if (nodeIsInPrecedingSiblings && markedText.length < mark.text.length) {
            markedText += highlightContainerInBetween(node, mark);
          }
        }
      }
    }


    // Recreate the first container
    let firstContainerNodes = document.evaluate('.//parent::*//text()', startContainer, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let tmp = '';
    for (let i = 0; i < firstContainerNodes.snapshotLength; i++) {
      let node = firstContainerNodes.snapshotItem(i);
      markedText += node.textContent;

      if (node.textContent.length >= mark.startOffset && tmp.length < mark.startOffset && markedText.length < mark.text.length) {
        const range = document.createRange();
        range.setStart(node, mark.startOffset);

        if (startContainer === endContainer) {
          range.setEnd(node, mark.endOffset);
        } else {
          range.setEnd(node, node.textContent.length);
        }
        let startMarkElement = document.createElement('mark');
        startMarkElement.setAttribute('markId', mark ? mark.id : '');
        startMarkElement.appendChild(range.extractContents());
        range.insertNode(startMarkElement);
      }

      if (node.textContent && tmp.length >= mark.startOffset && markedText.length < mark.text.length) {
        let newMarkElement = document.createElement('mark');
        newMarkElement.setAttribute('markId', mark ? mark.id : '');
        node.parentNode.insertBefore(newMarkElement, node);
        newMarkElement.appendChild(node);
      }
      tmp += node.textContent;
    }

    // Recreate the last container
    let endContainerNodes = document.evaluate('.//parent::*//text()', endContainer, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    tmp = '';
    let finished = false;
    for (let i = 0; i < endContainerNodes.snapshotLength; i++) {
      let node = endContainerNodes.snapshotItem(i);
      markedText += node.textContent;
      if ((mark.text.length - markedText.length) < node.textContent.length) {
        // finished = true;
        // let endMarkElement = document.createElement('mark');
        // const range = document.createRange();
        // range.setStart(node, 0);
        // range.setEnd(node, mark.endOffset);
        // endMarkElement.setAttribute('markId', mark ? mark.id : '');
        // endMarkElement.appendChild(range.extractContents());
        // range.insertNode(endMarkElement);

      }
      if (mark.text.length > markedText.length && !finished) {
        // let newMarkElement = document.createElement('mark');
        // newMarkElement.setAttribute('markId', mark ? mark.id : '');
        // node.parentNode.insertBefore(newMarkElement, node);
        // newMarkElement.appendChild(node);
      }
      tmp += node.textContent;
    }

    return firstMarkElement;

  } catch (error) {
    console.log(error);
  }
}

function isAlsoInPrecedingSiblings(precedingSiblings, endContainer, node: Node) {

  for (let i = 0; i < precedingSiblings.snapshotLength; i++) {
    let tmp = precedingSiblings.snapshotItem(i);
    if (node.textContent === tmp.textContent) return true;
  }
  return false;
}

function highlightContainerInBetween(startContainer, mark: Mark) {
  let tmp = '';
  // Recreate the first container
  let firstContainerNodes = document.evaluate('.//parent::*//text()', startContainer, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0; i < firstContainerNodes.snapshotLength; i++) {
    let node = firstContainerNodes.snapshotItem(i);
    tmp += node.textContent;
    let newMarkElement = document.createElement('mark');
    newMarkElement.setAttribute('markId', mark ? mark.id : '');
    node.parentNode.insertBefore(newMarkElement, node);
    newMarkElement.appendChild(node);
  }
  return tmp;

}

function getAllRootNodes(childNode: ChildNode) {
  let children = [];
  for (let child of childNode.childNodes) {
    children = [...children, child];
  }
  return children;
}



/**
 * Returns the StartContainer or EndContainer to recreate the range of the given mark
 *
 * @export
 * @param {HTMLElement} container
 * @param {Mark} mark
 * @param {boolean} start true = searchs for StartContainer; false = searchs for EndContainer
 * @returns {HTMLElement}
 */
export function findStartEndContainer(container: HTMLElement, mark: Mark, start: boolean) {
  container ? container = container : container = document.body;
  let elements;
  try {
    elements = textNodesUnder(container);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].textContent.includes(start ? mark.startContainerText : mark.endContainerText)) {
        return elements[i] as HTMLElement;
      }
    }
  } catch (error) {
    //
  }

}

/**
 * Returns all text nodes under an element
 *
 * @export
 * @param {Node} node
 * @returns {Node[]}
 */
export function textNodesUnder(node: Node) {
  try {
    let all: Node[] = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === 3) all.push(node);
      else all = all.concat(textNodesUnder(node));
    }
    return all;
  } catch (error) {
    //
  }

}

/**
 * Adds the style for the mark element.
 *
 */
function addStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
      mark, span.highlight {
        border-radius: 5px;
        padding: 2px 0px;
        background-color: #92ffaa;
        width: 100%;
      }

      mark > *:not(my-marker) {
        background-color: #92ffaa;
      }
      `;
  document.body.appendChild(style);
}