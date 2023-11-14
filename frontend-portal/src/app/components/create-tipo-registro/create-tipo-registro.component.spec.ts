import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTipoRegistroComponent } from './create-tipo-registro.component';

describe('CreateTipoRegistroComponent', () => {
  let component: CreateTipoRegistroComponent;
  let fixture: ComponentFixture<CreateTipoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTipoRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTipoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
