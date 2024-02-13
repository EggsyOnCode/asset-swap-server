export function extractS3ObjectKey(url) {
  const regex = /amazonaws\.com\/(.+)$/i;
  const match = url.match(regex);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  } else {
    return null;
  }
}
