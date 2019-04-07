import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '../../node_modules/@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';


import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { ApiService } from './shared/api.service';
import { ExcelService } from './shared/excel-service.service';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
