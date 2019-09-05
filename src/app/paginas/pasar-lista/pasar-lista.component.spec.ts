import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasarListaComponent } from './pasar-lista.component';

describe('PasarListaComponent', () => {
  let component: PasarListaComponent;
  let fixture: ComponentFixture<PasarListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasarListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasarListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
