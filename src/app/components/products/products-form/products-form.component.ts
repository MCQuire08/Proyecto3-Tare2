import { Component, Input, inject, OnInit } from '@angular/core';
import { IFeedBackMessage, IProduct, IFeedbackStatus, ICategory, IRole } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service'; 
import { effect } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() title!: string;
  @Input() product: IProduct = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: { id: 0, name: '' }
  };
  public categoriesList: ICategory[] = [];
  @Input() action: string = 'add';

  productService = inject(ProductService);
  categoryService = inject(CategoryService); 
  feedbackMessage: IFeedBackMessage = { type: IFeedbackStatus.default, message: '' };

  categories: ICategory[] = [];
  selectedCategoryId: number | null = null;

  constructor(

  ) {
    effect(() => {
      this.categories = this.categoryService.categories$();
    });

  }

  ngOnInit() {

    this.categoryService.getAllSignal();
  }

  onCategoryChange(categoryId: number) {
    const idAsNumber = Number(categoryId);  
    const selectedCategory = this.categories.find(category => category.id === idAsNumber);
    if (selectedCategory) {
      this.product.category = { id: selectedCategory.id, name: selectedCategory.name };
      console.log('Category assigned to product: ', this.product.category);
    } else {
      console.log('No category found with ID: ', idAsNumber);
    }
  }
  
  

  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.productService[this.action === 'add' ? 'saveProductSignal' : 'updateProductSignal'](this.product).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `Product successfully ${this.action === 'add' ? 'added' : 'updated'}`;
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      });
    }
  }
}
