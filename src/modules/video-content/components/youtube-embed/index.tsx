'use client';

import type { LiteYouTube } from 'react-lite-youtube-embed';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export type YouTubeEmbedProps = LiteYouTube;

export function YouTubeEmbed(props: YouTubeEmbedProps) {
  return <LiteYouTubeEmbed {...props} />;
}
