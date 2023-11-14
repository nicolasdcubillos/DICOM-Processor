import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTipoUsuarioComponent } from './create-tipo-usuario.component';

describe('CreateTipoUsuarioComponent', () => {
  let component: CreateTipoUsuarioComponent;
  let fixture: ComponentFixture<CreateTipoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTipoUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTipoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
