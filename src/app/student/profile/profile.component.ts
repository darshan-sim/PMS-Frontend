import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StudentProfileComponent } from '../../shared/pages/student-profile/student-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, StudentProfileComponent],
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  currentUserId: string = '';

  ngOnInit(): void {
    // Get current user ID from auth service
    const currentUser = this.authService.currentUser();

    if (currentUser && currentUser.studentId) {
      this.currentUserId = currentUser.studentId;
    } else {
      console.error('Profile: No student ID found in user object:', currentUser);
      // Don't set a fallback ID - let the template handle this case
    }
  }
}
