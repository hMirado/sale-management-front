import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { ProductService } from '../../../service/product/product.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from '../../../models/product/product.model';
import { ProductFormValue } from '../../../models/product-form-value/product-form-value';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.getCurrentProduct()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
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

  getCurrentProduct() {
    this.subscription.add(
      this.activatedRoute.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const uuid = params.get('uuid') as string;
          return this.productService.getProductByUuid(uuid)
        })
      ).subscribe((response: ApiResponse) => {
        this.product = response.data;
      })
    );
  }

  getProductNewValue(event: any) {
    this.editProduct(event)
  }

  editProduct(product: ProductFormValue) {
    this.subscription.add(
      this.productService.updateProduct(product).subscribe((response: ApiResponse) => {
        this.showNotification('success', response.notification);
      })
    );
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
