import { Component, Input, OnInit } from '@angular/core';
import { Image } from '../../models/image/image';
import { ImageService } from '../../services/image/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input() image: Image;
  public env: string = environment['store-service']
  constructor(
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
  }

  imageButtonText(hasImage: boolean) {
    return hasImage ? 'Modifier image' : 'Ajouter image';
  }

  imageUrl(url: string) {
    return this.env + url;
  }

  deleteImage(id: string) {
    this.imageService.setDeleteImage({id: id, status: true});
  }
}
