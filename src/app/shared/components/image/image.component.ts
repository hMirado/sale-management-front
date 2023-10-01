import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Image } from '../../models/image/image';
import { ImageService } from '../../services/image/image.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../services/file/file.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  public env: string = environment['store-service'];
  public imageFormGroup!: FormGroup;
  private subscription = new Subscription();
  public image: Image | null = null;
  constructor(
    private imageService: ImageService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.getImage();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getImage(): void {
    this.subscription.add(
      this.imageService.getImage().pipe(
        filter((value: Image | null) => value != null && value?.id == this.id)
      ).subscribe((value: Image | null) => {
        this.image = value;
      })
    )
  }

  imageButtonText(hasImage: boolean): string {
    return hasImage ? 'Modifier image' : 'Ajouter image';
  }

  imageUrl(url: string): string {
    return this.env + '/file/image/' + url;
  }

  deleteImage(id: string): void {
    this.imageService.setDeleteImage({id: id, status: true});
  }

  onFileChange(event: any, id: string): void {
    this.fileService.convertFileToBase64(event.target.files[0], id);
    event.target.value = '';
  }
}
