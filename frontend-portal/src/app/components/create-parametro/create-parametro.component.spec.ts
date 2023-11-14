import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParametroComponent } from './create-parametro.component';

describe('CreateParametroComponent', () => {
  let component: CreateParametroComponent;
  let fixture: ComponentFixture<CreateParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateParametroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
