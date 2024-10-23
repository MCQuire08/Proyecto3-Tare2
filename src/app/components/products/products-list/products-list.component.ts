import { Component, effect, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProduct, IRole } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductFormComponent } from '../products-form/products-form.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    ProductFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  public search: string = '';
  public productList: IProduct[] = [];
  private service = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  public currentProduct: IProduct = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: undefined
  };
  public permission = false;

  ngOnInit(){
    if(this.authService.getUserAuthority() === IRole.superAdmin){
      this.permission = true;
    }
    
  }

  constructor(
    private authService:AuthService
  ) {
    this.service.getAllSignal();
    effect(() => {      
      this.productList = this.service.products$();
    });
  }

  showDetail(product: IProduct, modal: any) {
    this.currentProduct = { ...product }; 
    modal.show();
  }

  deleteProduct(product: IProduct) {
    this.service.deleteProductSignal(product).subscribe({
      next: () => {
        this.snackBar.open('Product deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting product', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
