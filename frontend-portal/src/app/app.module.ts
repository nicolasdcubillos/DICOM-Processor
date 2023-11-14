import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }from '@angular/forms';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { ListUsuarioComponent } from './components/list-usuario/list-usuario.component';
import { ListTipoUsuarioComponent } from './components/list-tipo-usuario/list-tipo-usuario.component';
import { ListTipoRegistroComponent } from './components/list-tipo-registro/list-tipo-registro.component';
import { ListRegistroComponent } from './components/list-registro/list-registro.component';
import { ListParametroComponent } from './components/list-parametro/list-parametro.component';
import { CreateUsuarioComponent } from './components/create-usuario/create-usuario.component';
import { CreateTipoUsuarioComponent } from './components/create-tipo-usuario/create-tipo-usuario.component';
import { CreateTipoRegistroComponent } from './components/create-tipo-registro/create-tipo-registro.component';
import { CreateRegistroComponent } from './components/create-registro/create-registro.component';
import { CreateParametroComponent } from './components/create-parametro/create-parametro.component';
import { MenuComponent } from './components/menu/menu.component';
import { VisualizadorComponent } from './components/visualizador/visualizador.component';
import { DetalleRegistroComponent } from './components/detalle-registro/detalle-registro.component';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import localePy from '@angular/common/locales/es-PY';

registerLocaleData(localePy, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListUsuarioComponent,
    ListTipoUsuarioComponent,
    ListTipoRegistroComponent,
    ListRegistroComponent,
    ListParametroComponent,
    CreateUsuarioComponent,
    CreateTipoUsuarioComponent,
    CreateTipoRegistroComponent,
    CreateRegistroComponent,
    CreateParametroComponent,
    MenuComponent,
    VisualizadorComponent,
    DetalleRegistroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    TokenService,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
