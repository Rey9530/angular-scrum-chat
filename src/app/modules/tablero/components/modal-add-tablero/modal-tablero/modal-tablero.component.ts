import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'; 
import { MatDialogRef } from '@angular/material/dialog';  
import { Board, Card, Label } from '../../../tablero.models'; 

@Component({
  selector: 'app-modal-tablero',
  templateUrl: './modal-tablero.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalTableroComponent implements OnInit
{
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    board: Board;
    card: Card;
    cardForm: UntypedFormGroup;
    labels: Label[];
    filteredLabels: Label[];
 

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ModalTableroComponent>, 
        private _formBuilder: UntypedFormBuilder,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      // Prepare the card form
      this.cardForm = this._formBuilder.group({
          id         : [''],
          title      : ['', Validators.required],
          description: [''],
          labels     : [[]],
          dueDate    : [null]
      });
      
    }
 
}
