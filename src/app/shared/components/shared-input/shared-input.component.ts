import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shared-input.component.html',
  styleUrl: './shared-input.component.css',
})
export class SharedInputComponent {
  @Input() readonly = false;
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');

  get showPlaceholder() {
    return this.readonly ? '- -' : this.placeholder();
  }
}
