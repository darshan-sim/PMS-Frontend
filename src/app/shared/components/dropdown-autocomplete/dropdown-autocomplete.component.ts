import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  output,
  signal,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectOption } from '../custom-select-dropdown/custom-select-dropdown.component';

@Component({
  selector: 'app-dropdown-autocomplete-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-autocomplete.component.html',
  styleUrl: './dropdown-autocomplete.component.css',
})
export class DropdownAutocompleteComponentComponent<T = string> implements OnInit, OnChanges {
  // Inputs
  options = input<SelectOption<T>[] | null>(null);
  title = input<string>();
  canSearch = input<boolean>(false);
  placeholder = input<string>('Select…');
  selectedValue = signal<T | null>(null);
  defaultValue = input<string | null>(null);

  canEmitValue = input<boolean>(false);

  // Internal signals
  query = signal<string>('');
  open = signal(false);

  // Output
  added = output<string>();
  selection = output<T>();

  // Filtered list based on query
  filtered = computed(() => {
    if (!this.canSearch()) {
      return this.options();
    }
    return this.options()?.filter(o => o.label.toLowerCase().includes(this.query().toLowerCase()));
  });

  ngOnInit(): void {
    this.setInitialQueryFromOptions();
    console.log(this.options())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.setInitialQueryFromOptions();
    }
  }

  private setInitialQueryFromOptions(): void {
    const selected = this.options()?.find(
      option => option.value === this.defaultValue || option.select === true
    );
    if (selected) {
      this.query.set(selected.label);
    }
  }

  select(o: SelectOption<T>) {
    this.query.set(o.label);
    this.open.set(false);
    this.selection.emit(o.value);
  }

  onAdd() {
    this.added.emit(this.query());
    this.open.set(false);
  }

  onBlur() {
    setTimeout(() => this.open.set(false), 150);
  }

  get queryValue(): string {
    return this.query();
  }

  set queryValue(val: string) {
    this.query.set(val);
    if (this.canSearch()) {
      this.open.set(true);
    }
  }
}
