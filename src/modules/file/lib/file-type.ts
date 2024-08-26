type FileType = 'image' | 'text' | 'audio' | 'video' | 'application' | 'unknown';

const text = ['text/plain', 'text/html', 'text/css', 'text/javascript'];

const image = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];

const audio = ['audio/midi', 'audio/mpeg', 'audio/webm', 'audio/ogg', 'audio/wav'];

const video = ['video/webm', 'video/ogg'];

const application = [
  'application/octet-stream',
  'application/pkcs12',
  'application/vnd.mspowerpoint',
  'application/xhtml+xml',
  'application/xml',
  'application/pdf',
];

export function fileType(mimetype: string): FileType {
  if (image.includes(mimetype)) {
    return 'image';
  }
  if (text.includes(mimetype)) {
    return 'text';
  }
  if (audio.includes(mimetype)) {
    return 'audio';
  }
  if (video.includes(mimetype)) {
    return 'video';
  }
  if (application.includes(mimetype)) {
    return 'application';
  }
  return 'unknown';
}
