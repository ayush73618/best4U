import { Component, signal } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FileDropzone } from '../../../shared/components/file-dropzone/file-dropzone';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { extractUploadProgress } from '../../../shared/utilities/upload-progress';
import { validateFile } from '../../../shared/utilities/file-validation';

@Component({
  selector: 'app-image-tools',
  standalone: true,
  imports: [FileDropzone, ProgressBar],
  templateUrl: './image-tools.html',
  styleUrl: './image-tools.scss',
})
export class ImageTools {
  private readonly url = `${environment.apiBaseUrl}/docs/image/process`;

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly format = signal('jpg');
  protected readonly quality = signal(80);
  protected readonly maxWidth = signal('');
  protected readonly loading = signal(false);
  protected readonly uploadProgress = signal<number | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  protected onFileSelected(files: File[]): void {
    const file = files[0];
    const error = validateFile(file, { acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'], maxSizeMB: 25 });
    if (error) {
      this.errorMessage.set(error);
      return;
    }
    this.selectedFile.set(file);
    this.errorMessage.set(null);
  }

  protected onFormatChange(value: string): void {
    this.format.set(value);
  }

  protected onQualityInput(value: string): void {
    this.quality.set(Number(value));
  }

  protected onMaxWidthInput(value: string): void {
    this.maxWidth.set(value);
  }

  protected process(): void {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('Select an image to process.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    let url = `${this.url}?format=${this.format()}&quality=${this.quality()}`;
    if (this.maxWidth()) url += `&maxWidth=${this.maxWidth()}`;

    this.loading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set(null);

    this.http
      .post(url, formData, { reportProgress: true, observe: 'events', responseType: 'blob' })
      .subscribe({
        next: (event) => {
          const pct = extractUploadProgress(event);
          if (pct !== null) this.uploadProgress.set(pct);

          if (event.type === HttpEventType.Response) {
            const response = event as HttpResponse<Blob>;
            if (response.body) {
              const downloadUrl = window.URL.createObjectURL(response.body);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `processed.${this.format()}`;
              a.click();
              window.URL.revokeObjectURL(downloadUrl);
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