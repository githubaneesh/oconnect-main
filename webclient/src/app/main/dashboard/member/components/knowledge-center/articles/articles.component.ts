import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ArticlesComponent implements OnInit {

  card10Expanded: boolean = false;
  articles:any[];
  constructor() { }

  ngOnInit(): void {
     this.articles =  [{title:'', description:'',expand:false},
                      {title:'', description:'',expand:false},
                      {title:'', description:'',expand:false},
                      {title:'', description:'',expand:false}];

  }

}
