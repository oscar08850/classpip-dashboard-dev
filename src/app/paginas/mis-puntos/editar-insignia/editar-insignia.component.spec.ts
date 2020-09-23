import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInsigniaComponent } from './editar-insignia.component';

describe('EditarInsigniaComponent', () => {
  let component: EditarInsigniaComponent;
  let fixture: ComponentFixture<EditarInsigniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarInsigniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarInsigniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
