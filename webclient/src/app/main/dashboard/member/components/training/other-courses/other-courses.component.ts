
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';

 

@Component({
  selector: 'app-other-courses',
  templateUrl: './other-courses.component.html',
  styleUrls: ['./other-courses.component.scss'],
    animations : fuseAnimations,
     
    
})
export class OtherCoursesComponent implements OnInit {

    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[]=[];
    currentCategory: string;
    searchTerm: string;    
    private _unsubscribeAll: Subject<any>;

    files: any;
    dataSource: CourseMaterial[] | null;
    displayedColumns = ['icon', 'name', 'type', 'owner', 'size', 'modified', 'detail-button'];
    selected: any;

    



  constructor() {
        this.searchTerm = '';        
   }

  ngOnInit(): void {
      this.dataSource = [
        {
            'name'     : 'Work Documents',
            'type'     : 'folder',
            'owner'    : 'me',
            'size'     : '',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
             'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Public Documents',
            'type'     : 'folder',
            'owner'    : 'public',
            'size'     : '',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
             'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Private Documents',
            'type'     : 'folder',
            'owner'    : 'me',
            'size'     : '',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
             'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Ongoing projects',
            'type'     : 'document',
            'owner'    : 'Emily Bennett',
            'size'     : '1.2 Mb',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
            'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Shopping list',
            'type'     : 'document',
            'owner'    : 'Emily Bennett',
            'size'     : '980 Kb',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
            'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
         
    ];
  }
   ngOnDestroy(): void
  {
     
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

}


export interface CourseMaterial {
            name: string;
            type: string;
            owner: string;
            size: string;
            modified: string;
            opened: string;
            created: string;
            extention: string;
            location: string;
            offline: boolean;
            preview: string;
}