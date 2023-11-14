import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipoUsuarioComponent } from './list-tipo-usuario.component';

describe('ListTipoUsuarioComponent', () => {
  let component: ListTipoUsuarioComponent;
  let fixture: ComponentFixture<ListTipoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipoUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
