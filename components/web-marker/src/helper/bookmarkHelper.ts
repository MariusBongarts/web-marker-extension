
export function getTitleForBookmark() {
  if (document.title) return document.title;

  // Check if URL is pdf format => Return the filename by splitting the URL
  if (location.href.split('.')[location.href.split('.').length -1] === 'pdf') {

    // Split by forward- or backslash
    let title = location.href.split(/\//ig)[location.href.split(/\//ig).length -1];

    // Remove spaces %20 for windows
    title = title.split('%20').join(' ');

    return title;
  }
}