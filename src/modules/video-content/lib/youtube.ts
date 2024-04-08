export const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?!channel\/)(?!@)(.+)?$/;
export const YOUTUBE_REGEX_GLOBAL =
  /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)\/(?!channel\/)(?!@)(.+)?$/g;

export const isValidYoutubeUrl = (url: string) => {
  return url.match(YOUTUBE_REGEX);
};

export const getEmbedIDFromYoutubeUrl = (url: string) => {
  if (!isValidYoutubeUrl(url)) {
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
};
