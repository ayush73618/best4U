import { HttpEvent, HttpEventType } from '@angular/common/http';

// Extracts a 0-100 percentage from an HttpEvent stream when reportProgress
// is enabled. Returns null for events that aren't an upload-progress tick,
// so callers only update their signal when there's a real number to show.
export function extractUploadProgress(event: HttpEvent<unknown>): number | null {
  if (event.type === HttpEventType.UploadProgress && event.total) {
    return Math.round((100 * event.loaded) / event.total);
  }
  return null;
}