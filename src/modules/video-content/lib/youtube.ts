const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?!channel\/)(?!@)(.+)?$/;

export function getEmbedIDFromYouTubeUrl(url: string) {
  if (!url || !YOUTUBE_REGEX.test(url)) {
    return null;
  }

  if (url.includes('/embed/')) {
    return url.split('/embed/').pop() || null;
  }

  if (url.includes('youtu.be')) {
    return url.split('/').pop() || null;
  }

  const videoIdRegex = /(?:v=|shorts\/)([-\w]+)/gm;
  const matches = videoIdRegex.exec(url);

  if (!matches || !matches[1]) {
    return null;
  }

  return matches[1];
}
