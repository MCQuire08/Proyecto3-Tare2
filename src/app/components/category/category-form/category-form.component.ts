import { Component, Input, inject, OnInit } from '@angular/core';
import { IFeedBackMessage, ICategory, IFeedbackStatus } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryService } from '../../../services/category.service'; 
import { effect } from '@angular/core';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Input() title!: string;
  @Input() category: ICategory = {
    name: '',
    description: ''
  };
  @Input() action: string = 'add';

  categoryService = inject(CategoryService); 
  feedbackMessage: IFeedBackMessage = { type: IFeedbackStatus.default, message: '' };

  ngOnInit() {
    this.categoryService.getAllSignal();
  }

  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.categoryService[this.action === 'add' ? 'saveCategorySignal' : 'updateCategorySignal'](this.category).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `Category successfully ${this.action === 'add' ? 'added' : 'updated'}`;
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      });
    }
  }
}
