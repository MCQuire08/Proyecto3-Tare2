import { Component } from '@angular/core';
import { ProductsListComponent } from '../../components/products/products-list/products-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductFormComponent } from '../../components/products/products-form/products-form.component';
import { AuthService } from '../../services/auth.service';
import { IRole } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductsListComponent,
    ProductFormComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public permission = false;

  constructor(
    private authService:AuthService
  ){
  }

  ngOnInit(){
    if(this.authService.getUserAuthority() === IRole.superAdmin){
      this.permission = true;
    }
  }
}
