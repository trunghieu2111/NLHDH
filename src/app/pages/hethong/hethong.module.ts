import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HethongRoutingModule } from './hethong-routing.module';
import { HethongComponent } from './hethong.component';

import { AntDesignModule } from 'src/app/share/ant-design.module';

import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HethongComponent
  ],
  imports: [
    CommonModule,
    HethongRoutingModule,
    AntDesignModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HethongModule { }
