import {BrowserModule} from "@angular/platform-browser";
import {APP_INITIALIZER, NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";

import {AppComponent} from "./app.component";
import {ConfigService} from "../services/config.service";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [ConfigService],
      useFactory : (appConfigService : ConfigService) =>  () => appConfigService.loadAppConfig()
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
