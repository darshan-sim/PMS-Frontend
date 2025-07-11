import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ElementRef, input } from '@angular/core';
import { CardIconDirective } from '../../directives/card-icon.directive';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css',
})
export class StatsCardComponent implements AfterContentInit {
  hasIcon = false;
  title = input.required<string>();
  @ContentChild(CardIconDirective) iconDirective?: CardIconDirective;

  iconBgColor = 'bg-blue-500';

  ngAfterContentInit(): void {
    const iconEl = this.iconDirective?.el.nativeElement;
    if (iconEl) this.hasIcon = true;
    if (iconEl?.hasAttribute('bgColor')) {
      this.iconBgColor = iconEl.getAttribute('bgColor')!;
    }
  }
}
