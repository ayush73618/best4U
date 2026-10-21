import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {

  // Seeded products use full external placeholder URLs
  // (https://placehold.co/...) — passed through unchanged.
  // Seller-uploaded images come back from the backend as a path
  // relative to the server (/api/uploads/products/...) — those need
  // the backend's own origin prepended, since Angular's dev server
  // runs on a different port and has no idea those files exist.
  // When Cloudinary/S3 replaces local disk storage, only this one
  // method changes — no component touches a URL directly.
  resolve(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${environment.serverOrigin}${url}`;
  }

  // Convenience: resolve the first image from a list, with a fallback.
  // Used by list views (product cards, cart rows, order history) that
  // only ever show one image per item.
  resolveFirst(
    urls: string[] | null | undefined,
    fallback: string
  ): string {
    if (!urls || urls.length === 0) return fallback;
    return this.resolve(urls[0], fallback);
  }

  // Resolve all images in a list — used by the product detail gallery
  // where every uploaded image is shown, not just the first.
  resolveAll(
    urls: string[] | null | undefined,
    fallback: string
  ): string[] {
    if (!urls || urls.length === 0) return [fallback];
    return urls.map((url) => this.resolve(url, fallback));
  }
}