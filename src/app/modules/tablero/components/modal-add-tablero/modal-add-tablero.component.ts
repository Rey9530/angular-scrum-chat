import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalTableroComponent } from './modal-tablero/modal-tablero.component'; 
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-modal-add-tablero',
  templateUrl: './modal-add-tablero.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalAddTableroComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _router: Router
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
        // Launch the modal
        this._matDialog.open(ModalTableroComponent, {autoFocus: true})
            .afterClosed()
            .subscribe(() => {  
                this._router.navigate(['/tablero/index'], {relativeTo: this._activatedRoute});
            });
    }
}


