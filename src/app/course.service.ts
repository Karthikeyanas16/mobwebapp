import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    courses: Subject<any> = new Subject<any>();
    constructor(private http: HttpClient, private route: Router, private authService: AuthService) { }

    geAllCourses(): Observable<any> {
        let url: any = `${environment.searchService}/courses`;
        if (this.authService.getAuthUser().id) {
            url = `${environment.enrollmentService}/search/user/enrolled/` + this.authService.getAuthUser().id;
        }
        return this.http.get(url).pipe(
            map(response => {
                this.courses.next(response);
                return response;
            })
        );
    }
    geUserCourses(text): Observable<any> {
        // let url: any = `${environment.searchService}/courses`;
        const url: any = `${environment.enrollmentService}/search/` + this.authService.getAuthUser().id + `/` + text;
        return this.http.get(url).pipe(
            map(response => {
                this.courses.next(response);
                return response;
            })
        );
    }
    searchCourse(text: string): Observable<any> {
        const url: any = `${environment.searchService}/mentorTechnology/` + text;
        return this.http.get(url).pipe(
            map(response => {
                if (response) {
                    this.courses.next(response);
                }
                return response;
            })
        );
    }
    courseEnroll(reqBody): Observable<any> {
        const url: any = `${environment.enrollmentService}/create`;
        return this.http.post(url, reqBody).pipe(
            map(response => {
                return response;
            })
        );
    }
    getNotification(): Observable<any> {
        const url: any = `${environment.notificationService}/notification/get/` + this.authService.getAuthUser().id;
        return this.http.get(url).pipe(
            map(response => {
                this.courses.next(response);
                return response;
            })
        );
    }
}
