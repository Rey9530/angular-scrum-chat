/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id      : 'dashboards',
    //     title   : 'Tableros',
    //     subtitle: 'Control Scrum',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:home',
    //     children: [
    //         {
    //             id   : 'dashboards.project',
    //             title: 'Project',
    //             type : 'basic',
    //             icon : 'heroicons_outline:clipboard-check',
    //             link : '/dashboards/project'
    //         },
    //         {
    //             id   : 'dashboards.analytics',
    //             title: 'Analytics',
    //             type : 'basic',
    //             icon : 'heroicons_outline:chart-pie',
    //             link : '/dashboards/analytics'
    //         },
    //         {
    //             id   : 'dashboards.finance',
    //             title: 'Finance',
    //             type : 'basic',
    //             icon : 'heroicons_outline:cash',
    //             link : '/dashboards/finance'
    //         },
    //         {
    //             id   : 'dashboards.crypto',
    //             title: 'Crypto',
    //             type : 'basic',
    //             icon : 'heroicons_outline:currency-dollar',
    //             link : '/dashboards/crypto'
    //         }
    //     ]
    // },  

    {
        id      : 'tableros',
        title   : 'Scrum',
        type    : 'collapsable',
        icon    : 'heroicons_outline:home',
        link    : '/tablero/index',
        children: [
            {
                id   : 'tableros.index',
                title: 'Tableros',
                type : 'basic',
                link : '/tablero/index'
            },  
        ]
    },
]; 