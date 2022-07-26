import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes  } from '@angular/router';

import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatGridListModule} from '@angular/material/grid-list'

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ContentModule } from 'app/layout/components/content/content.module';
import { FooterModule } from 'app/layout/components/footer/footer.module';
import { NavbarModule } from 'app/layout/components/navbar/navbar.module';
import { QuickPanelModule } from 'app/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from 'app/layout/components/toolbar/toolbar.module';
 

import { ChapterlistComponent } from './chapterlist/chapterlist.component';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { OrganisationComponent } from './organisation.component';
import { CourseLaunchComponent } from 'app/main/dashboard/member/components/training/course-launch/course-launch.component';
import { TrainingComponent } from 'app/main/dashboard/member/components/training/training.component';
import { ProjectsComponent } from 'app/main/dashboard/member/components/projects/projects.component';
import { GradebookComponent } from 'app/main/dashboard/member/components/gradebook/gradebook.component';
import { EventComponent } from 'app/main/dashboard/member/components/event/event.component';
import { CalenderComponent } from 'app/main/dashboard/member/components/calender/calender.component';
import { ActivityComponent } from 'app/main/dashboard/member/components/activity/activity.component';

const routes: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    children: [
         /*-------------Components--------------------------*/                
                {
                path     : 'chapterlist',
                component: ChapterlistComponent
                },
                {
                    path     : 'memberlist',
                    component: MemberlistComponent,
                },
                {
                    path     : 'activity',
                    component: ActivityComponent,
                },
                {
                    path     : 'calender',
                    component: CalenderComponent,
                },
                {
                    path     : 'event',
                    component: EventComponent,
                },
                {
                    path     : 'gradebook',
                    component: GradebookComponent,
                },
                {
                    path     : 'projects',
                    component: ProjectsComponent,
                },
                {
                    path     : 'training',
                    component: TrainingComponent,
                },
                {
                    path     : 'course/:courseId/:enrollId',
                    component: CourseLaunchComponent,
                },              
    ]
  } 
];

 

@NgModule({
  declarations: [OrganisationComponent,ChapterlistComponent, MemberlistComponent],
  imports: [
    CommonModule,
        RouterModule.forChild(routes) ,
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        FuseSidebarModule,
        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,
        MatDialogModule,
        MatGridListModule,
        MatSelectModule,
        MatCheckboxModule    
   ]
})
export class OrganisationModule { }
