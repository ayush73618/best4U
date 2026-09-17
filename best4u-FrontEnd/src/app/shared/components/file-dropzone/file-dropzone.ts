import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  templateUrl: './file-dropzone.html',
  styleUrl: './file-dropzone.scss',
})
export class FileDropzone {
  @Input() accept = '*/*';
  @Input() multiple = false;
  @Input() label = 'Choose file';
  @Output() filesSelected = new EventEmitter<File[]>();

  protected readonly isDragOver = signal(false);

  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filesSelected.emit(Array.from(input.files));
    }
    input.value = ''; // lets the same file be re-picked later if removed
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  protected onDragLeave(): void {
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.filesSelected.emit(Array.from(files));
    }
  }
}