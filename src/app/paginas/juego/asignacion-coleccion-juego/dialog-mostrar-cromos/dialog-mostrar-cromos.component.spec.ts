import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMostrarCromosComponent } from './dialog-mostrar-cromos.component';

describe('DialogMostrarCromosComponent', () => {
  let component: DialogMostrarCromosComponent;
  let fixture: ComponentFixture<DialogMostrarCromosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMostrarCromosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMostrarCromosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
