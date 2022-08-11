import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';  
import { IndexComponent } from './components/index/index.component';
import { TablerosComponent } from './components/tableros/tableros.component';
import { ScrumboardBoardsResolver, ScrumboardBoardResolver, ScrumboardCardResolver } from './tablero.resolvers';
import { ScrumboardBoardComponent } from './components/board/board.component';
import { ScrumboardCardComponent } from './components/card/card.component';
import { ModalAddTableroComponent } from './components/modal-add-tablero/modal-add-tablero.component';
 
export const authRoutes: Route[] = [
  
    {
        path:'index',
        component:TablerosComponent,
        resolve  : {
            boards: ScrumboardBoardsResolver
        },
        children:[ 
            {
                path     : 'ModalAdd',
                component: ModalAddTableroComponent, 
            }
        ]
    },
    {
        path     : 'index/:boardId',
        component: ScrumboardBoardComponent,
        resolve  : {
            board: ScrumboardBoardResolver
        },
        children : [
            {
                path     : 'card/:cardId',
                component: ScrumboardCardComponent,
                resolve  : {
                    card: ScrumboardCardResolver
                }
            }
        ]
    }
 
  
 
];


@NgModule({ 
    imports : [ 
        RouterModule.forChild(authRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class TableroRoutes
{
}