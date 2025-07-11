import { Component, inject } from '@angular/core';
import { StudentProfileComponent } from '../../shared/pages/student-profile/student-profile.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-details',
  imports: [StudentProfileComponent],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css',
})
export class StudentDetailsComponent {
  studentId: string = '';
  route = inject(ActivatedRoute);
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const studentId = params.get('id');
      if (studentId) {
        this.studentId = studentId;
      }
    });
  }
}
