import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import {MemberListService} from '../../../../services/memberlist.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChapterService } from '../../../../services/chapter.service';
@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class MemberlistComponent implements OnInit {
    selectedContacts: any[];
    private _unsubscribeAll: Subject<any>;
    chapterName:any;
    chapterId:any;
    nonActiveUser:any  ;
    activeUser:any ;
    selectedIndex:any = 0;
    membersSubscription:Subscription; 
    invitememberUpdate:boolean = false;
    activememberUpdate:boolean = false;
  constructor( 
               public _matDialog: MatDialog,
               private _fuseNavigationService:FuseNavigationService,
               private avtivatedRoute : ActivatedRoute,
               private chapterService:ChapterService ) { 
       // Set the private defaults
        this._unsubscribeAll = new Subject();
        
  }

  ngOnInit(): void {
    this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');     
       this.subscribeChapterEvent();
       this.avtivatedRoute.params.subscribe(params => {
            console.log('Params changes ',params);
             if(params){
              //  this.updateSideMenu();
                this.getChapter();
             }
        });
 }
   updateSideMenu(){
    this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName');          
     this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID'); 
    this._fuseNavigationService.updateNavigationItem('chapters', {
        url      : `/dashboard/chapter/${this.chapterId}/${this.chapterName}/chapterlist`        
    });
      this._fuseNavigationService.updateNavigationItem('members', {
        url      : `/dashboard/chapter/${this.chapterId}/${this.chapterName}/memberlist`        
    });
  }
  getChapter(){
        this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName');          
        this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');     
        this.chapterService.chapterID =   this.chapterId;
        this.chapterService.chapterName =   this.chapterName;
  }
   ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        if(this.membersSubscription ){
            this.membersSubscription.unsubscribe();

        }
        
    }
 
    subscribeChapterEvent(){
    this.membersSubscription = this.chapterService.updateMembersData$.subscribe((response:any)=>{
        if(response && response){            
            console.log('update memberlist response',  response); 
            if(response && response.type=='invite'){
              this.selectedIndex = 2;
              this.invitememberUpdate = true;
              console.log('Selected Index 2 invite');
            }
            else if(response && response.type=='add'){
              this.selectedIndex = 0;
              this.activememberUpdate =true;
                console.log('Selected Index 0 add');
            }
            // this._contactsService.getContacts();        
        } 
    });
  }
  activeMemberlistChange(event){
    this.nonActiveUser = event.user;
  }
  nonactiveMemberlistChange(event){
    this.activeUser = event.user;
  }
}



 