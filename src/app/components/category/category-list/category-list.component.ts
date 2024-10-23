import { Component, effect, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ICategory, IRole } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    CategoryFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  public categoriesList: ICategory[] = [];
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  public currentCategory: ICategory = { name: '', description: '' };
  public permission = false;

  constructor(
    private authService:AuthService
  ) {
    this.categoryService.getAllSignal();
    effect(() => {
      this.categoriesList = this.categoryService.categories$();
    });
  }

  ngOnInit(){
    if(this.authService.getUserAuthority() === IRole.superAdmin){
      this.permission = true;
    }
  }

  showDetail(category: ICategory, modal: any) {
    this.currentCategory = { ...category }; 
    modal.show();
  }

  deleteCategory(category: ICategory) {
    this.categoryService.deleteCategorySignal(category).subscribe({
      next: () => {
        this.snackBar.open('Category deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting category', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  trackById(index: number, category: ICategory) {
    return category.id;
  }
}
