import { Component, OnInit, Inject ,ViewEncapsulation,EventEmitter,ViewChild,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChapterService} from '../../../../services/chapter.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import {UtilsService } from '../../../../services/Utils.service';
import {UploadService} from '../../../../services/upload.service';
import {CourseService} from '../../../../services/course.service';
import LocalStorageService from '../../../../services/localstorage.service';

@Component({
  selector: 'app-add-video-course',
  templateUrl: './add-video-course.component.html',
  styleUrls: ['./add-video-course.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AddVideoCourseComponent implements OnInit {

   @ViewChild('videotag') videotag:any;
   @ViewChild('canvas') canvas:any;
    @ViewChild('thumnailImg') thumnailImg:any;
   

  courseForm: FormGroup;
  showSpinner:boolean = false;
  chapters:any[];
  selectedChapter:any;

   /*------------------------*/
  options: UploaderOptions;
  formData: FormData;
	files: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	docUploaded: EventEmitter<any>;
   /*------------------------*/
  showTumbButton:boolean = false;
  
  constructor(private _formBuilder: FormBuilder,
      private cdr:ChangeDetectorRef,
      private uploadService:UploadService,
      private courseService:CourseService,
      private utilsService: UtilsService,
      public dialogRef: MatDialogRef<AddVideoCourseComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { 
         this.chapters = data.chapters;
         this.selectedChapter =  this.chapters[0];
     }

  ngOnInit(): void {
    this.docUploaded = new EventEmitter();
	  this.options = { concurrency: 1, maxUploads: 1 , allowedContentTypes: ['video/mp4' , 'video/quicktime' , 'video/x-msvideo' ]  };
    this.files = [];  
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;

     this.courseForm = this._formBuilder.group({
            title: ['',Validators.required],
            description: ['',Validators.required],
            videoUrl: ['', Validators.required],
            thumbnail: ['', Validators.required],
            user: ['', Validators.required]             
        });
      const user:any = LocalStorageService.getInstance().getJSONObject('OConnect-UserInfo');
      this.courseForm.controls['user'].setValue(user._id);
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
      this.addVideoSource();
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
 addVideoSource(){
   
   this.videotag.nativeElement.src =  URL.createObjectURL(this.files[0].nativeFile ) ;
  // this.videotag.nativeElement.load();
  // this.cdr.detectChanges();
   console.log('addVideoSource  ');

 }
 metaDataLoaded(event){
   console.log('metaDataLoaded ',event);
   this.showTumbButton  = true ; 
   this.videotag.nativeElement.currentTime = 50;
   this.canvas.nativeElement.width = this.videotag.nativeElement.videoWidth;
   this.canvas.nativeElement.height = this.videotag.nativeElement.videoHeight;
   const ctx = this.canvas.nativeElement.getContext("2d");
  /* const _owner:any = this;
    setTimeout(()=>{
      ctx.drawImage(_owner.videotag.nativeElement , 0, 0, _owner.videotag.nativeElement.videoWidth, _owner.videotag.nativeElement.videoHeight);
      _owner.thumnailImg.nativeElement.src = _owner.canvas.nativeElement.toDataURL();
       _owner.cdr.detectChanges();
    },1000); */
}
addThumnail(){
  const ctx = this.canvas.nativeElement.getContext("2d");  
  ctx.drawImage(this.videotag.nativeElement , 0, 0, this.videotag.nativeElement.videoWidth, this.videotag.nativeElement.videoHeight);
  this.thumnailImg.nativeElement.src = this.canvas.nativeElement.toDataURL();
 // this.showTumbButton  = false ; 
}
/*------------------------- 
First uploads thumb nail Image
Seconed uploads Video
 -------------------------*/
  async startUpload(event) {
			console.log('this.files[]  ',this.files[0]);
		 	if (this.files && this.files.length > 0) {
          const file:any = this.files[0];
          this.addThumnail();


          /* ---------video thumbnail upload--------------*/
          const filename = 'video-thumbnails/'+ this.utilsService.searchReplaceSpace(this.utilsService.addTimeStatp(`video-thumbnail.jpeg`));
          const objSend = this.getUploadObj(filename , 'image/jpeg');	  
          const thumbSignedURLRes:any = await this.uploadService.getSignedUrl(objSend);
          console.log('uploadThumbnail  ',thumbSignedURLRes);
          const uploadThumbnail = await this.uploadService.uploadfileAWSS3(thumbSignedURLRes,this.getFileObject() , 'image/jpeg' );
		      console.log('uploadResponse   ',uploadThumbnail);
          const thumbnailPath = thumbSignedURLRes.split('?')[0];
          this.courseForm.controls['thumbnail'].setValue(thumbnailPath);
          /* --------------------------------------------*/

           /* ---------video thumbnail upload--------------*/
          const video_filename = 'videos/'+ this.utilsService.searchReplaceSpace(this.utilsService.addTimeStatp(file.nativeFile.name));
          const videoObjSend = this.getUploadObj(video_filename , file.type );	  
          const videoSignedURLRes:any = await this.uploadService.getSignedUrl(videoObjSend);
          console.log('videoSignedURLRes  ',videoSignedURLRes);
          const videoUploadResponse = await this.uploadService.uploadfileAWSS3(videoSignedURLRes,file.nativeFile,file.type );
		      console.log('uploadResponse   ',videoUploadResponse);    
           const videoPath = videoSignedURLRes.split('?')[0];          
           this.courseForm.controls['videoUrl'].setValue(videoPath);       
          /* --------------------------------------------*/          
	   	}
  }
  async submit(event){
    if(this.courseForm.valid){
        const response:any =await this.courseService.createVideo(this.courseForm.value);
        if(response && response._id){          
          this.dialogRef.close({ submitClicked: true, response :response });
        }
        console.log('create video response  ',response);

    }

  }
 	getUploadObj(path,mime){
		return {
			key:path ,
			mimeType:mime
		}
	}
  getFileObject(){
    
    let dataUrl = this.thumnailImg.nativeElement.src.split(',')
    let base64 = dataUrl[1];
    let mime = dataUrl[0].match(/:(.*?);/)[1];
    let bin = atob(base64);
    let length = bin.length;  
    let buf = new ArrayBuffer(length);
    let arr = new Uint8Array(buf);
    bin.split('').forEach((e,i)=>arr[i]=e.charCodeAt(0));  
    return  new File([buf],'filename',{type:mime}); 
  }

}
