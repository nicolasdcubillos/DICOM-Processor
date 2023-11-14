import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRegistroComponent } from './create-registro.component';

describe('CreateRegistroComponent', () => {
  let component: CreateRegistroComponent;
  let fixture: ComponentFixture<CreateRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
