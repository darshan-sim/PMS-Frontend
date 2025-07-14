import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, effect } from '@angular/core';
import { HeadSlotDirective } from '../directives/head-slot.directive';
import { AsideSlotDirective } from '../directives/aside-slot.directive';
import { ToastComponent } from "../components/toast/toast.component";

@Component({
  selector: 'app-common-page-layout',
  imports: [CommonModule, ToastComponent],
  templateUrl: './common-page-layout.component.html',
  styleUrl: './common-page-layout.component.css',
})
export class CommonPageLayoutComponent {
  head = contentChild(HeadSlotDirective);
  aside = contentChild(AsideSlotDirective);

  hasHead = computed(() => !!this.head());
  hasAside = computed(() => !!this.aside());
}
