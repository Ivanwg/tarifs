export function formatSeconds(seconds) {
  let hours = Math.floor(seconds / 60 / 60);
  let minutes = Math.floor(seconds / 60) - (hours * 60);
  let secs = seconds % 60;
  hours = hours > 9 ? `${hours}` : `0${hours}`;
  minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
  secs = secs > 9 ? `${secs}` : `0${secs}`;
  return `${hours}:${minutes}:${secs}`;
}
