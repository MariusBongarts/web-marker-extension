export function timeSinceTimestamp(milliseconds: number) {
  const date: Date = new Date();
  const dateNow: number = date.getTime();
  const timeDelta: number = dateNow - milliseconds;

  let seconds = (timeDelta / 1000);
  let minutes = seconds / 60;
  seconds = Math.round(seconds % 60);
  let hours = minutes / 60;
  minutes = Math.round(minutes % 60);
  const days = Math.round(hours / 24);
  hours = Math.round(hours % 24);

  return `${days >= 1 ? days + 'd ' : ''} ${hours >= 1 ? hours + 'h ' : ''}
  ${minutes >= 1 ? minutes + 'm ' : ''} ${seconds >= 0 ? seconds + 's' : ''}`;
}