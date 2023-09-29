import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, filter, switchMap } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { ProductService } from '../../../service/product/product.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from '../../../models/product/product.model';
import { ProductFormValue } from '../../../models/validations/product-form-value';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Image } from 'src/app/shared/models/image/image';
import { ImageService } from 'src/app/shared/services/image/image.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  public title: string = 'Détails de l\'article';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public product: Product;
  public image: Image;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private notificationService: NotificationService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.getCurrentProduct();
    this.deleteImage();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent(): void {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil',
      },
      {
        url: '/catalog/product',
        label: 'Catalogues',
      },
      {
        url: '/catalog/product',
        label: 'Liste des articles'
      },
      {
        label: 'Détails'
      }
    ]
  }

  getCurrentProduct(): void {
    this.subscription.add(
      this.activatedRoute.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const uuid = params.get('uuid') as string;
          return this.productService.getProductByUuid(uuid)
        })
      ).subscribe((response: ApiResponse) => {
        this.product = response.data.product;
        this.image = {
          id: this.product.product_uuid,
          ... response.data.image
        }
      })
    );
  }

  getProductNewValue(event: any): void {
    this.editProduct(event)
  }

  editProduct(product: ProductFormValue): void {
    this.subscription.add(
      this.productService.updateProduct(product).subscribe((response: ApiResponse) => {
        this.showNotification('success', response.notification);
      })
    );
  }

  editPrice(value: any): void {
    this.subscription.add(
      this.productService.updatePrice(value).subscribe((response: ApiResponse) => {
        this.showNotification('success', response.notification)
      })
    );
  }

  showNotification(type: string, message: string): void {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }

  deleteImage(): void {
    this.subscription.add(
      this.imageService.getDeleteImage().pipe(
        filter((value: any) => value['status'] && value['id'] != ''),
        switchMap((value: any) => this.productService.deleteImage(value['id']))
      ).subscribe((response: ApiResponse) => {
        this.product = response.data.product;
        this.image = {
          id: this.product.product_uuid,
          ... response.data.image
        }
      })
    );
  }
}
