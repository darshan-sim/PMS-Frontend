import { Component, inject } from '@angular/core';
// import { DriveListComponent } from '../../recruiter/drives/drive-list/drive-list.component';
import { DriveService } from '../../services/drive.service';
import { MODE } from '../../types/common.types';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { CommonPageLayoutComponent } from '../../shared/common-page-layout/common-page-layout.component';
import { AsideSlotDirective } from '../../shared/directives/aside-slot.directive';
import { HeadSlotDirective } from '../../shared/directives/head-slot.directive';
import { DriveListComponent } from "../../shared/components/drive-list/drive-list.component";
import { DriveViewComponent } from "../../shared/components/drive-view/drive-view.component";

@Component({
  selector: 'app-drives',
  imports: [
    ToastComponent,
    CommonPageLayoutComponent,
    AsideSlotDirective,
    HeadSlotDirective,
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
}
