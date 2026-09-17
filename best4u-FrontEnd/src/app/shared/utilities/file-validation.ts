// Client-side check so a user finds out about an oversized or wrong-type
// file instantly, instead of waiting through a whole upload only to have
// the backend reject it. The backend re-checks both independently -
// this is a convenience, not the actual enforcement.
export function validateFile(
  file: File,
  options: { acceptedTypes?: string[]; maxSizeMB?: number }
): string | null {
  if (options.acceptedTypes && !options.acceptedTypes.includes(file.type)) {
    return `"${file.name}" isn't a supported file type.`;
  }
  if (options.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
    return `"${file.name}" is larger than the ${options.maxSizeMB}MB limit.`;
  }
  return null;
}