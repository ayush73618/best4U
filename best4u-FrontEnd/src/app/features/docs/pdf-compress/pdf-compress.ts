import { Component, signal } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FileDropzone } from '../../../shared/components/file-dropzone/file-dropzone';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { extractUploadProgress } from '../../../shared/utilities/upload-progress';
import { validateFile } from '../../../shared/utilities/file-validation';

@Component({
  selector: 'app-pdf-compress',
  standalone: true,
  imports: [FileDropzone, ProgressBar],
  templateUrl: './pdf-compress.html',
  styleUrl: './pdf-compress.scss',
})
export class PdfCompress {
  private readonly url = `${environment.apiBaseUrl}/docs/pdf/compress`;

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly level = signal('medium');
  protected readonly loading = signal(false);
  protected readonly uploadProgress = signal<number | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  protected onFileSelected(files: File[]): void {
    const file = files[0];
    const error = validateFile(file, { acceptedTypes: ['application/pdf'], maxSizeMB: 25 });
    if (error) {
      this.errorMessage.set(error);
      return;
    }
    this.selectedFile.set(file);
    this.errorMessage.set(null);
  }

  protected onLevelChange(value: string): void {
    this.level.set(value);
  }

  protected compress(): void {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('Select a PDF file to compress.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.loading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set(null);

    this.http
      .post(`${this.url}?level=${this.level()}`, formData, { reportProgress: true, observe: 'events', responseType: 'blob' })
      .subscribe({
        next: (event) => {
          const pct = extractUploadProgress(event);
          if (pct !== null) this.uploadProgress.set(pct);

          if (event.type === HttpEventType.Response) {
            const response = event as HttpResponse<Blob>;
            if (response.body) {
              const url = window.URL.createObjectURL(response.body);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'compressed.pdf';
              a.click();
              window.URL.revokeObjectURL(url);
            }
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
}