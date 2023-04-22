import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from 'src/app/features/catalog/models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ItemSelectionService {
  private products$: BehaviorSubject<{id: string, products: Product[]} | null> = new BehaviorSubject<{id: string, products: Product[]} | null>(null);
  private validateSelectedProduct$: Subject<boolean> = new Subject<boolean>;
  private cancelSelectedProduct$: Subject<boolean> = new Subject<boolean>;
  private selectedProducts$: Subject<{id: string, products: Product[]} | null> = new Subject<{id: string, products: Product[]} | null>();

  constructor() { }

  getProducts(): BehaviorSubject<{id: string, products: Product[]} | null> {
    return this.products$;
  }

  setProducts(value: {id: string, products: Product[]} | null) {
    this.products$.next(value);
  }

  getValidateSelectedProduct(): Subject<boolean> {
    return this.validateSelectedProduct$;
  }

  setValidateSelectedProduct(status: boolean) {
    this.validateSelectedProduct$.next(status);
  }

  getCancelSelectedProduct(): Subject<boolean> {
    return this.cancelSelectedProduct$;
  }

  setCancelSelectedProduct(status: boolean) {
    this.cancelSelectedProduct$.next(status);
  }

  getSelectedProducts(): Subject<{id: string, products: Product[]} | null> {
    return this.selectedProducts$;
  }

  setSelectedProducts(value: {id: string, products: Product[]} | null) {
    this.selectedProducts$.next(value);
  }
}
