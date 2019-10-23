export function urlToOrigin(url: string) {
  url = url.replace(/https:\/\/|http:\/\/|www.|/gi, '');
  url = url.split('/')[0];
  return url;
}