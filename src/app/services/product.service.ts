import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct } from '../interfaces';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<IProduct> {
  protected override source: string = 'products';
  private productListSignal = signal<IProduct[]>([]);

  get products$() {
    return this.productListSignal;
  }

  getAllSignal(): IProduct[] {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.productListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching products', error);
      }
    });
  
    return this.productListSignal(); 
  }
  

  saveProductSignal(product: IProduct): Observable<any> {
    return this.add(product).pipe(
      tap((response: any) => {
        this.productListSignal.update(products => [response, ...products]);
      }),
      catchError(error => {
        console.error('Error saving product', error);
        return throwError(error);
      })
    );
  }

  updateProductSignal(product: IProduct): Observable<any> {
    return this.edit(product.id, product).pipe(
      tap((response: any) => {
        const updatedProducts = this.productListSignal().map(p => p.id === product.id ? response : p);
        this.productListSignal.set(updatedProducts);
      }),
      catchError(error => {
        console.error('Error updating product', error);
        return throwError(error);
      })
    );
  }

  deleteProductSignal(product: IProduct): Observable<any> {
    return this.http.delete(`${this.source}/${product.id}`, { responseType: 'text' })
      .pipe(
        tap(() => {
          console.log('Product deleted successfully');
        }),
        catchError((error: any) => {
          if (error.status === 200 && typeof error.error === 'string') {
            console.error('Error deleting product:', error.error); 
            return of(null);
          }
          return throwError(() => new Error('Error deleting product'));
        })
      );
  }
  
  
}
