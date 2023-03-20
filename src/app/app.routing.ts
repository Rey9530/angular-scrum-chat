import { Route } from '@angular/router';
// import { AuthGuard } from 'app/core/auth/guards/auth.guard';
// import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from './app.resolvers';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
// import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
 
    {path: '', pathMatch : 'full', redirectTo: 'tablero/index'},   

    // Auth routes for guests
    {
        path: 'auth',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {layout: 'empty' },
        loadChildren: () => import('./modules/auth/auth.module').then( a => a.AuthModule ) 
    }, 
    // Auth routes for authenticated users
    {
        path: 'tablero',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        loadChildren: () => import('./modules/tablero/tablero.module').then(t => t.TableroModule)
    },
 
 
];
