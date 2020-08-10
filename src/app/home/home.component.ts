import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CourseService } from '../course.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  msgStatus = { status: false, type: true, message: '', popup: false };
  courseList: any = [];
  enrolledCourses: any = [];
  searchSub: Subscription;
  displayAlert: boolean;
  isLoggedIn: boolean;
  displayEnroll: boolean;
  // tslint:disable-next-line:max-line-length
  courseEnroll: any = { id: '', user_id: '', technology_id: '', technology: '', name: '', description: '', comments: '', fees: '', proposalAmount: '', proposalStatus: 'Not Started', mentorId: '' };
  List: any = [];
  auth: any;
  constructor(private courseService: CourseService, public el: ElementRef, private authService: AuthService, private route: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsAuth();
    if (this.isLoggedIn) {
      if (this.authService.getAuthUser().role == 'user') {
        this.auth = true;
      }
    }
    this.getCourseList();
    this.searchSub = this.courseService.courses.subscribe((value) => {
      this.List = value;
      this.setData();
    });

  }
  getUserCourse() {
    this.courseService.getUserCourses().subscribe(
      res => {
        this.enrolledCourses = res;
        this.msgStatus.message = '';
        this.msgStatus.status = false;
        if (this.isLoggedIn) {
          this.setData();
        }
        if (!this.courseList.length) {
          this.msgStatus.status = true;
          this.msgStatus.message = 'Not record found !';
          this.msgStatus.type = false;
        }
      }, error => {
        console.log('error', error);
        let msg = 'Oops !! Something went wrong, please contact the administrator';
        if (error.error.message) {
          msg = error.error.message;
        }
        this.msgStatus.status = true;
        this.msgStatus.message = msg;
        this.msgStatus.type = false;
      });
  }
  getCourseList() {
    this.courseService.geAllCourses().subscribe(res => {
      this.List = res;
      if (this.isLoggedIn) {
        // if (this.authService.getAuthUser().role === 'user') {
        this.getUserCourse();
        // }
      }
    }, error => {
      console.log('error', error);
      let msg = 'Oops !! Something went wrong, please contact the administrator';
      if (error.error.message) {
        msg = error.error.message;
      }
      this.msgStatus.status = true;
      this.msgStatus.message = msg;
      this.msgStatus.type = false;
    });
  }
  enroll(course: any) {
    //   console.log(course)
    this.msgStatus.status = false;
    this.msgStatus.message = '';
    this.msgStatus.popup = true;
    if (this.authService.getIsAuth()) {
      this.displayAlert = false;
      this.displayEnroll = true;
      // tslint:disable-next-line:max-line-length
      this.courseEnroll = { user_id: this.authService.getAuthUser().id, technology: course.technology, fees: course.fees, description: course.description, name: course.name, technology_id: course.id, comments: '', proposalAmount: course.fees, proposalStatus: 'Not Started', mentorId: course.mentorId };
    } else {
      this.displayAlert = true;
      this.displayEnroll = false;
    }
  }
  login() {
    this.route.navigate(['/auth/login']);
  }
  goToDashboard() {
    this.authService.navigateUser();
  }
  sendProposal() {
    if (this.authService.getAuthUser().id && this.courseEnroll.technology_id && this.courseEnroll.proposalAmount) {
      const reqBody: any = {
        user_id: this.authService.getAuthUser().id,
        technology_id: this.courseEnroll.technology_id,
        comments: this.courseEnroll.comments,
        proposalAmount: this.courseEnroll.proposalAmount,
        proposalStatus: 'Not Started',
        mentor_id: this.courseEnroll.mentorId
      };
      this.courseService.courseEnroll(reqBody).subscribe(res => {
        // console.log(res);
        this.msgStatus.status = true;
        this.msgStatus.popup = false;
        this.msgStatus.message = 'Proposal sent successfully.';
        this.displayEnroll = false;
        this.getCourseList();
        // tslint:disable-next-line:max-line-length
        this.courseEnroll = { id: '', user_id: '', technology_id: '', technology: '', name: '', description: '', comments: '', fees: '', proposalAmount: '', proposalStatus: 'Not Started' };
      }, error => {
        console.log('error', error);
        let msg = 'Oops !! Something went wrong, please contact the administrator';
        if (error.error.message) {
          msg = error.error.message;
        }
        this.msgStatus.status = true;
        this.msgStatus.message = msg;
        this.msgStatus.type = false;
        this.msgStatus.popup = true;
      });
    }
  }
  onClose() {
    // tslint:disable-next-line:max-line-length
    this.courseEnroll = { id: '', user_id: '', technology_id: '', technology: '', name: '', description: '', comments: '', fees: '', proposalAmount: '', proposalStatus: 'Not Started', mentorId: '' };
  }
  setData() {
    // tslint:disable-next-line:prefer-for-of
    for (const key in this.List) {
      if (Object.prototype.hasOwnProperty.call(this.List, key)) {
        const element = this.List[key];
        for (const k in this.enrolledCourses) {
          if (Object.prototype.hasOwnProperty.call(this.enrolledCourses, k)) {
            const courses = this.enrolledCourses[k];
            if (element.id === courses.technology_id) {
              element.status = 'Started';
              // console.log(element, element.id);
            }
          }
        }
      }
    }
    this.courseList = this.List;
    // console.log('courseEnroll', JSON.stringify(this.courseList));

  }
}
