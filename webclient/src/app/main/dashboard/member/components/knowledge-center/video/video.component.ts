import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations

})
export class VideoComponent implements OnInit {
   filteredCourses: any[]=[];
   searchTerm:any;
  constructor() { }

  ngOnInit(): void {
     this.filteredCourses =   [
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
        }     
        
       
    ];
  }
    filterCoursesByTerm(): void
    {
        
    }
}
