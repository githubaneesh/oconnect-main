import { Component, OnInit, Inject ,ViewEncapsulation,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChapterService} from '../../../../services/chapter.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import {UtilsService } from '../../../../services/Utils.service';
import {UploadService} from '../../../../services/upload.service';
import { ToastrService } from 'ngx-toastr';
import { DragdropService } from 'app/services/dragdrop.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import LocalStorageService from 'app/services/localstorage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
  styleUrls: ['./addcourse.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class AddcourseComponent implements OnInit {
   courseForm: FormGroup;
   trackmodes:any[]=[{label:'CMI5/XAPI',value:'cmi5/xapi'}, {label:'None',value:'none'}];
   showSpinner:boolean = false;
   chapters:any[];
	 selectedChapter:any;
	 uploadedData:any;

   /*------------------------*/
  options: UploaderOptions;
  formData: FormData;
	files: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	docUploaded: EventEmitter<any>;
	fileArr = [];
  imgArr = [];
	fileObj = [];
	msg: string;
	progress: number = 0;
	trackedItem : any ;
   /*------------------------*/


   constructor( private _formBuilder: FormBuilder,
    private uploadService:UploadService,
		public dialogRef: MatDialogRef<AddcourseComponent>,
		private toastr : ToastrService,
		public dragdropService: DragdropService,
		private chapterService : ChapterService,
		private sanitizer : DomSanitizer,
     @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.chapters = data.chapters;
				this.selectedChapter =  this.chapters[0];
				this.trackedItem = this.trackmodes[0];
     }

  ngOnInit(): void {
     this.docUploaded = new EventEmitter();
	  this.options = { concurrency: 1, maxUploads: 1 , allowedContentTypes: ["application/x-zip-compressed"]  };
    this.files = [];  
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;

    this.courseForm = this._formBuilder.group({
            title: [''],
            description: [''],
            trackmode: ['', Validators.required],
            chapter: ['', Validators.required],
            duration: ['', Validators.required],
						avatar: [null]
        });
	}
	
	async upload(e) {
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const file = (e as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
    })

    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)
    })

    // Set files form control
    this.courseForm.patchValue({
      avatar: this.fileObj
    })

    this.courseForm.get('avatar').updateValueAndValidity()

    // Upload to server
    this.dragdropService.addFiles(this.courseForm.value.avatar)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:						
						this.uploadedData = event.body;
            setTimeout(() => {
              this.progress = 0;
              this.fileArr = [];
              this.fileObj = [];
              this.msg = "File uploaded successfully!"
            }, 3000);
        }
      })
	}

	sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onUploadOutput(output: UploadOutput): void {
		switch (output.type) {
		  case 'allAddedToQueue':
         break;
		  case 'addedToQueue':
		 	if (typeof output.file !== 'undefined' ) {
			  this.files[0] = output.file;
        	console.log('this.files   ', this.files );
       }
        	break;
		  case 'uploading':
			if (typeof output.file !== 'undefined') {			   
			  const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
			  this.files[index] = output.file;
			}
			break;
		  case 'removed':		 
			this.files = this.files.filter((file: UploadFile) => file !== output.file);
			break;
		  case 'dragOver':
			this.dragOver = true;
			console.log('dragOver');
			break;
		  case 'dragOut':
		  case 'drop':
			this.dragOver = false;
			console.log('dragOut');
			break;
		  case 'done':		 
			console.log('done');

			break;
		}
 }
  async startUpload(event) {
			console.log('this.files[]  ',this.files[0]);
		 	if (this.files && this.files.length > 0) {
			 const uploadResponse:any = await this.uploadService.uploadCourse(this.files[0]);
			 console.log('uploadResponse  ',uploadResponse);
	   	}
	}
	
		
	async createChapterCourse(){
		this.showSpinner = true;
		let userInfo :any = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
		userInfo = JSON.parse(userInfo);
		let data : any = {
			filename : this.uploadedData.filename,
			chapter : this.selectedChapter.id,
			user : userInfo._id

		}
		let response = await this.chapterService.createChapterCourse(data);
		console.log('createChapterCourse',response)
		if(response && !response.error)
		{
			let enrollData = {
												chapter: this.selectedChapter.id,
												course:	response.entity._id
											}
			let enrollResponse = await this.chapterService.enrollUserWithChapterCourse(enrollData);
			if(enrollResponse && !enrollResponse.error)
				{
					this.showSpinner = false;
					this.dialogRef.close({ submitClicked: true });
				}
				else{
					this.showSpinner = false;
					this.toastr.error('Error on course creation.');					
				}
			}
			else{
				this.showSpinner = false;
				this.toastr.error('Error on course creation.');
			}
		
	}

  submit(event){
		this.createChapterCourse();
	}
	

  	getUploadObj(path,mime){
		return {
			key:path ,
			mimeType:mime
		}
	}

}
