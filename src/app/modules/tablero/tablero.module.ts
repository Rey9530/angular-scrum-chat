import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as moment from 'moment';


import { IndexComponent } from './components/index/index.component';
import { TableroRoutes } from './tablero.routing';
import { SharedModule } from '../../shared/shared.module';
import { TablerosComponent } from './components/tableros/tableros.component';
import { ScrumboardBoardComponent } from './components/board/board.component';
import { ScrumboardBoardAddCardComponent } from './components/board/add-card/add-card.component';
import { ScrumboardBoardAddListComponent } from './components/board/add-list/add-list.component';
import { ScrumboardCardComponent } from './components/card/card.component';
import { ScrumboardCardDetailsComponent } from './components/card/details/details.component';
import { ModalAddTableroComponent } from './components/modal-add-tablero/modal-add-tablero.component'; 
import { ModalTableroComponent } from './components/modal-add-tablero/modal-tablero/modal-tablero.component';



@NgModule({
  declarations: [
    IndexComponent,
    TablerosComponent,

    
    ScrumboardBoardComponent,
    ScrumboardBoardAddCardComponent,
    ScrumboardBoardAddListComponent,
    ScrumboardCardComponent,
    ScrumboardCardDetailsComponent,
    ModalAddTableroComponent,
    ModalTableroComponent
  ],
  imports: [ 
    TableroRoutes,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    SharedModule
  ],
  providers   : [
      {
          provide : MAT_DATE_FORMATS,
          useValue: {
              parse  : {
                  dateInput: moment.ISO_8601
              },
              display: {
                  dateInput         : 'll',
                  monthYearLabel    : 'MMM YYYY',
                  dateA11yLabel     : 'LL',
                  monthYearA11yLabel: 'MMMM YYYY'
              }
          }
      }
  ]
})
export class TableroModule { }
