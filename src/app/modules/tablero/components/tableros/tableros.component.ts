import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';

 
import { ScrumboardService } from '../../tablero.service';
import { Board } from '../../tablero.models';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms'; 

import {
  MatSnackBar, 
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-tableros',
  templateUrl: './tableros.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablerosComponent implements OnInit, OnDestroy {

  boards: Board[];
  cardForm: UntypedFormGroup;
 

  // Private
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrumboardService: ScrumboardService,
    private _matDialog: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _snackBar: MatSnackBar
  ) { }
  
  // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void
     {
         // Get the boards
         this.getBoards()

             
      // Prepare the card form
      this.cardForm = this._formBuilder.group({ 
        title     : ['', Validators.required],
        description: [''],
        icon: ['heroicons_outline:template'],
    });
     }
     getBoards(){
      this._scrumboardService.boards$
             .pipe(takeUntil(this._unsubscribeAll))
             .subscribe((boards: Board[]) => {
                 this.boards = boards;  
                 console.log(boards)
                 // Mark for check
                 this._changeDetectorRef.markForCheck(); 
             });
     }
 
     /**
      * On destroy
      */
     ngOnDestroy(): void
     {
         // Unsubscribe from all subscriptions
         this._unsubscribeAll.next(null);
         this._unsubscribeAll.complete();
     }
 
     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------
 
     /**
      * Format the given ISO_8601 date as a relative date
      *
      * @param date
      */
     formatDateAsRelative(date: string): string
     {
         return moment(date, moment.ISO_8601).fromNow();
     }
 
     /**
      * Track by function for ngFor loops
      *
      * @param index
      * @param item
      */
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }

     modal_add_tablero(content){
      
        // Launch the modal
        this._matDialog.open(content, {autoFocus: true})
            .afterClosed()
            .subscribe(() => {}); 
     }

     cerrar_modal(){ 
      this._matDialog.closeAll()
     }

     guadar_tablero(){   
      if(this.cardForm.valid){
        this._scrumboardService.createBoard(this.cardForm.value)
        .subscribe({
          next:(response)=>{
            this.cerrar_modal();
            this.openSnackBar(response.title +' fue creada ');
          },
          error:(error)=>{
            this.cerrar_modal();
            this.openSnackBar(error.message +' Ocurrio un error '); 
          }
        })
      }
     }

     openSnackBar(msg:string) {
      this._snackBar.open(msg, 'Exito', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    }
}
