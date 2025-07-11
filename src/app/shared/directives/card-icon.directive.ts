import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[card-icon]',
})
export class CardIconDirective {
  constructor(public el: ElementRef<HTMLElement>) {}
}
