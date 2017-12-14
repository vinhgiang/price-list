import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AlertPanelComponent } from './shared/alert-panel/alert-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import 'hammerjs';

import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ToastMsgComponent } from './shared/toast-msg/toast-msg.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AlertPanelComponent,
    ToastMsgComponent
  ],
  imports: [
    HttpModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ ToastMsgComponent ]
})
export class AppModule { }
