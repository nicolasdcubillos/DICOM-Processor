import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipoRegistroComponent } from './list-tipo-registro.component';

describe('ListTipoRegistroComponent', () => {
  let component: ListTipoRegistroComponent;
  let fixture: ComponentFixture<ListTipoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipoRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
