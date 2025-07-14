import { Component, inject } from '@angular/core';
import { DriveCreateComponent } from './drive-create/drive-create.component';
import { DriveService } from '../../services/drive.service';
import { CommonPageLayoutComponent } from '../../shared/common-page-layout/common-page-layout.component';
import { HeadSlotDirective } from '../../shared/directives/head-slot.directive';
import { AsideSlotDirective } from '../../shared/directives/aside-slot.directive';
import { MODE } from '../../types/common.types';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { DriveListComponent } from "../../shared/components/drive-list/drive-list.component";
import { DriveViewComponent } from "../../shared/components/drive-view/drive-view.component";

@Component({
  selector: 'app-drives',
  imports: [
    DriveCreateComponent,
    CommonPageLayoutComponent,
    HeadSlotDirective,
    AsideSlotDirective,
    ToastComponent,
    DriveListComponent,
    DriveViewComponent
],
  templateUrl: './drives.component.html',
  styleUrl: './drives.component.css',
})
export class DrivesComponent {
  driveService = inject(DriveService);
  mode = this.driveService.mode;

  onViewAll() {
    this.driveService.setMode(MODE.VIEW_ALL);
  }
  onCreate() {
    this.driveService.setMode(MODE.CREATE);
  }
}
