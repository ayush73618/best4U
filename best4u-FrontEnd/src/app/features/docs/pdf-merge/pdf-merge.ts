import { Component, signal } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FileDropzone } from '../../../shared/components/file-dropzone/file-dropzone';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { extractUploadProgress } from '../../../shared/utilities/upload-progress';
import { validateFile } from '../../../shared/utilities/file-validation';

@Component({
  selector: 'app-pdf-merge',
  standalone: true,
  imports: [FileDropzone, ProgressBar],
  templateUrl: './pdf-merge.html',
  styleUrl: './pdf-merge.scss',
})
export class PdfMerge {
  private readonly url = `${environment.apiBaseUrl}/docs/pdf/merge`;

  protected readonly selectedFiles = signal<File[]>([]);
  protected readonly loading = signal(false);
  protected readonly uploadProgress = signal<number | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  protected onFilesSelected(files: File[]): void {
    for (const file of files) {
      const error = validateFile(file, { acceptedTypes: ['application/pdf'], maxSizeMB: 25 });
      if (error) {
        this.errorMessage.set(error);
        return;
      }
    }
    this.selectedFiles.update((existing) => [...existing, ...files]);
    this.errorMessage.set(null);
  }

  protected removeFile(index: number): void {
    this.selectedFiles.update((files) => files.filter((_, i) => i !== index));
  }

  protected merge(): void {
    if (this.selectedFiles().length < 2) {
      this.errorMessage.set('Select at least two PDF files to merge.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles().forEach((file) => formData.append('files', file));

    this.loading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set(null);

    this.http
      .post(this.url, formData, { reportProgress: true, observe: 'events', responseType: 'blob' })
      .subscribe({
        next: (event) => {
          const pct = extractUploadProgress(event);
          if (pct !== null) this.uploadProgress.set(pct);

          if (event.type === HttpEventType.Response) {
            const response = event as HttpResponse<Blob>;
            if (response.body) this.downloadBlob(response.body, 'merged.pdf');
            this.loading.set(false);
            this.uploadProgress.set(null);
          }
        },
        error: (err) => {
          this.errorMessage.set(err.message);
          this.loading.set(false);
          this.uploadProgress.set(null);
        },
      });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}