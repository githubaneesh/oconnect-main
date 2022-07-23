import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject , Observable, of} from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";
import {Constants} from '../core/constants/constants';  
import AuthService from './auth.service';
import LocalStorageService from './localstorage.service';



@Injectable()
export class CourseService {
    
    GET_COURSES:any = 'api/v1/courses/';
    CREATE_VIDEO:any ='video/create';
    GET_ENROLL:any = 'enroll/member/';
    private chapter_id:any;
    private chapter_name:any;
    
    constructor(private http: HttpClient) {
    }

   async getCourses(chapterID:any): Promise <any> 
    {
        try{
        const response:any = await this.http.get( Constants.LMS_BASE_URL+this.GET_COURSES+chapterID , AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }

async createVideo(data:any): Promise <any> 
    {
        try{
        const response:any = await this.http.post( Constants.LMS_BASE_URL+ Constants.BASE_ADMIN_URL+this.CREATE_VIDEO ,data, AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
    async getEnrolID(memberID:any,chapterID:any): Promise <any> 
    {
       // http://localhost:3004/api/v1/courses/enroll/member/5e5b4dc496e39a0b9257c2a2/chapter/5e5b4c1f96e39a0b9257c298
        try{
        const response:any = await this.http.get( Constants.LMS_BASE_URL+ Constants.BASE_COURSE_URL +this.GET_ENROLL+memberID+'/chapter/'+chapterID  , AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }

}
 