import { Component, OnInit,Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {AddVideoCourseComponent} from '../../../../shared/add-video-course/add-video-course.component';
@Component({
  selector: 'app-video-courses',
  templateUrl: './video-courses.component.html',
  styleUrls: ['./video-courses.component.scss'],
   animations : fuseAnimations
})
export class VideoCoursesComponent implements OnInit {
     @Input() isCoOrdinator:boolean;
     @Input() chapter:any;


    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[]=[];
    currentCategory: string;
    searchTerm: string;    
    private _unsubscribeAll: Subject<any>;
  constructor(private toastr: ToastrService, public dialog: MatDialog,) { 
        this.currentCategory = 'all';
        this.searchTerm = '';
        this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.filteredCourses =   this.courses = [
        {
            'id'      : '15459251a6d6b397565',
            'title'   : 'Basics of Angular',
            'slug'    : 'basics-of-angular',
            'category': 'web',
            'length'  : 30,
            'updated' : 'Jun 28, 2017',
              'icon' : 'completed.png'
        },
        {
            'id'      : '154588a0864d2881124',
            'title'   : 'Basics of TypeScript',
            'slug'    : 'basics-of-typeScript',
            'category': 'web',
            'length'  : 60,
            'updated' : 'Nov 01, 2017',
             'icon' : 'attempted.png'
        },
        {
            'id'      : '15453ba60d3baa5daaf',
            'title'   : 'Android N: Quick Settings',
            'slug'    : 'android-n-quick-settings',
            'category': 'web',
            'length'  : 120,
            'updated' : 'Jun 28, 2017',
             'icon' : 'notstarted.png'
        },
        
        {
            'id'      : '15427f4c1b7f3953234',
            'title'   : 'Building a gRPC Service with Java',
            'slug'    : 'building-a-grpc-service-with-java',
            'category': 'web',
            'length'  : 30,
            'updated' : 'Jun 28, 2017',
             'icon' : 'notstarted.png'
        },
        
        {
            'id'      : '1543ee3a5b43e0f9f45',
            'title'   : 'Build an App for the Google Assistant with Firebase and Dialogflow',
            'slug'    : 'build-an-app-for-the-google-assistant-with-firebase-and-dialogflow',
            'category': 'web',
            'length'  : 30,
            'updated' : 'Jun 28, 2017',
             'icon' : 'notstarted.png'
        },        
        {
            'id'      : '1542e43dfaae6ebf226',
            'title'   : 'Personalize Your iOS App with Firebase User Management',
            'slug'    : 'personalize-your-ios-app-with-firebase-user-management',
            'category': 'web',
            'length'  : 90,
            'updated' : 'Jun 28, 2017',
             'icon' : 'notstarted.png'
        }
    ];
    this.categories = [
        {
            'id'   : 0,
            'value': 'web',
            'label': 'Web'
        },
        {
            'id'   : 1,
            'value': 'firebase',
            'label': 'Firebase'
        },
        {
            'id'   : 2,
            'value': 'cloud',
            'label': 'Cloud'
        },
        {
            'id'   : 3,
            'value': 'android',
            'label': 'Android'
        }
    ];
  }
   ngOnDestroy(): void
  {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
  filterCoursesByCategory(): void
    {
        
        if ( this.currentCategory === 'all' )
        {
            this.coursesFilteredByCategory = this.courses;
            this.filteredCourses = this.courses;
        }
        else
        {
            this.coursesFilteredByCategory = this.courses.filter((course) => {
                return course.category === this.currentCategory;
            });
            this.filteredCourses = [...this.coursesFilteredByCategory];
        }        
        this.filterCoursesByTerm();
    }

   
    filterCoursesByTerm(): void
    {
        const searchTerm = this.searchTerm.toLowerCase();

       
        if ( searchTerm === '' )
        {
            this.filteredCourses = this.coursesFilteredByCategory;
        }
        else
        {
            this.filteredCourses = this.coursesFilteredByCategory.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }

      addCourse(event){

     const dialogRef = this.dialog.open(AddVideoCourseComponent, {
      width: '60%',
      data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }]  }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.submitClicked){
        this.toastr.success('Video uploaded successfully.');
         
                   
       }      
    });
  }

}
