// modules/media.js v1.0
export function createMediaElement(url) {
  const ext = url.split('.').pop().toLowerCase();
  if (ext === 'mp4' || ext === 'webm') {
    const video = document.createElement('video');
    video.src = url;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.style.maxWidth = '100%';
    video.style.borderRadius = '4px';
    return video;
  } else {
    const img = document.createElement('img');
    img.src = url;
    img.alt = "obrázek";
    img.style.maxWidth = '100%';
    img.style.borderRadius = '4px';
    return img;
  }
}
