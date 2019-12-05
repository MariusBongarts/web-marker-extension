import { store } from './../store/store';
import uuidv4 from 'uuid/v4';
import { getTitleForBookmark } from './bookmarkHelper';
import './rangy-updated/lib/rangy-classapplier';
import './rangy-updated/lib/rangy-highlighter';
import './rangy-updated/lib/rangy-textrange';
import './rangy-updated/lib/rangy-serializer';
import './rangy-updated/lib/rangy-selectionsaverestore';
import rangy from './rangy-updated';
export function highlightText(range, mark) {
    try {
        //const markElement = markWithRangy(mark);
        addStyles();
        if (mark.rangyObject) {
            markWithRangy(mark);
        }
        else {
            // Supporting old marks, made without rangy
            const markElement = createMarkElement(range, mark);
            createMyMarkerComponent(mark, markElement);
        }
        createMyMarkerComponent(mark);
    }
    catch (error) {
        console.log(error);
        //
    }
}
function markWithRangy(mark) {
    const selectionSerialized = mark.rangyObject;
    const highlighter = rangy.createHighlighter();
    const applier = rangy.createClassApplier('highlight', {
        onElementCreate: function (el) {
            el.markId = mark.id;
            el.setAttribute('markId', mark.id);
        }
    });
    highlighter.addClassApplier(applier);
    highlighter.deserialize(selectionSerialized);
    highlighter.highlightSelection('highlight', null, mark.id);
    rangy.getSelection().removeAllRanges();
}
/**
 * Creates the mark element to highlight text
 *
 * @param {Range} [range]
 * @param {Mark} [mark]
 * @returns
 */
function createMarkElement(range, mark) {
    mark ? range = recreateRange(mark) : range = range;
    const markElement = document.createElement('mark');
    markElement.setAttribute('markId', mark ? mark.id : '');
    markElement.appendChild(range.extractContents());
    range.insertNode(markElement);
    return markElement;
}
function recreateRange(mark) {
    const startContainer = findStartEndContainer(document.body, mark, true);
    const endContainer = findStartEndContainer(document.body, mark, false);
    const range = document.createRange();
    range.setStart(startContainer, mark.startOffset);
    range.setEnd(endContainer, mark.endOffset);
    return range;
}
/**
 * If @param text is given the mark is created by the context menu
 *
 * @export
 * @param {string} [text]
 * @returns {Mark}
 */
export function createMark(text) {
    const selection = window.getSelection();
    // If selection is made by my-menu popup
    // if (selection.toString()) {
    const range = selection.getRangeAt(0);
    const mark = {
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
        rangyObject: ''
    };
    let highlighter;
    highlighter = rangy.createHighlighter();
    rangy.saveSelection();
    const applier = rangy.createClassApplier('highlight', {
        onElementCreate: function (el) {
            el.markId = mark.id;
            el.setAttribute('markId', mark.id);
        }
    });
    highlighter.addClassApplier(applier);
    highlighter.highlightSelection('highlight', null, mark.id);
    let selectionSerialized = highlighter.serialize();
    highlighter.deserialize(selectionSerialized);
    rangy.getSelection().removeAllRanges();
    mark.rangyObject = selectionSerialized;
    localStorage.setItem('mark', JSON.stringify(mark));
    return mark;
}
// Mark is created by context menu
// else if (text) {
//   return createContextMark(text)
// }
/**
 * Creates a mark from the context-menu by handing text instead of using getSelection()
 *
 * @export
 * @param {string} text
 * @returns {Mark}
 */
export function createContextMark(text) {
    const selection = window.getSelection();
    let range = undefined;
    try {
        range = selection.getRangeAt(0);
    }
    catch (error) {
    }
    const mark = {
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
        scrollY: window.scrollY,
        rangyObject: ''
    };
    let highlighter;
    highlighter = rangy.createHighlighter();
    rangy.saveSelection();
    const applier = rangy.createClassApplier('highlight', {
        onElementCreate: function (el) {
            el.markId = mark.id;
            el.setAttribute('markId', mark.id);
        }
    });
    highlighter.addClassApplier(applier);
    highlighter.highlightSelection('highlight', null, mark.id);
    let selectionSerialized = highlighter.serialize();
    highlighter.deserialize(selectionSerialized);
    rangy.getSelection().removeAllRanges();
    mark.rangyObject = selectionSerialized;
    return mark;
}
/**
 * Creates the mark in the DOM. Afterwards it listenes for a deletion event to remove it.
 *
 * @param {HTMLElement} markElement
 * @param {Mark} mark
 */
function createMyMarkerComponent(mark, markElement) {
    const myMarkElement = document.createElement('my-marker');
    myMarkElement.mark = mark;
    myMarkElement.setAttribute('markId', mark.id);
    if (!markElement) {
        markElement = document.evaluate(`.//span[@markid='${mark.id}']`, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
    }
    markElement.appendChild(myMarkElement);
    // Listen for state changes and delete mark from DOM if it got removed
    store.subscribe(() => {
        const lastAction = store.getState().lastAction;
        if (lastAction === 'REMOVE_MARK') {
            if (!store.getState().marks.find(e => e.id === mark.id)) {
                myMarkElement.remove();
                if (mark.rangyObject) {
                    deleteMarksFromDom(mark);
                }
                else {
                    deleteMarkFromDom(markElement);
                }
            }
        }
    });
}
export function deleteMarksFromDom(mark) {
    try {
        let spanHighlights = document.evaluate(`.//span[@markid='${mark.id}']`, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < spanHighlights.snapshotLength; i++) {
            let markElement = spanHighlights.snapshotItem(i);
            // Unwraps the mark element
            const parent = markElement.parentNode;
            // move all children out of the element
            while (markElement.firstChild)
                parent.insertBefore(markElement.firstChild, markElement);
            // remove the empty element
            parent.removeChild(markElement);
        }
    }
    catch (error) {
        //
    }
}
export function deleteMarkFromDom(markElement) {
    try {
        // Unwraps the mark element
        const parent = markElement.parentNode;
        // move all children out of the element
        while (markElement.firstChild)
            parent.insertBefore(markElement.firstChild, markElement);
        // remove the empty element
        parent.removeChild(markElement);
    }
    catch (error) {
        //
    }
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
export function findStartEndContainer(container, mark, start) {
    container ? container = container : container = document.body;
    let elements;
    try {
        elements = textNodesUnder(container);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.includes(start ? mark.startContainerText : mark.endContainerText)) {
                return elements[i];
            }
        }
    }
    catch (error) {
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
export function textNodesUnder(node) {
    try {
        let all = [];
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === 3)
                all.push(node);
            else
                all = all.concat(textNodesUnder(node));
        }
        return all;
    }
    catch (error) {
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
        padding: 2px 2px;
        background-color: #92ffaa;
        width: 100%;
      }

      mark > *:not(my-marker) {
        background-color: #92ffaa;
      }
      `;
    document.body.appendChild(style);
}
//# sourceMappingURL=markerHelper.js.map