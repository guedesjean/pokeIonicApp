import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./pages/detail/detail.page').then((m) => m.DetailPage),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then((m) => m.FavoritesPage),
  },
];