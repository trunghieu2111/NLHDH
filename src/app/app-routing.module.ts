import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/hethong' },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'hethong', loadChildren: () => import('./pages/hethong/hethong.module').then(m => m.HethongModule) },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
