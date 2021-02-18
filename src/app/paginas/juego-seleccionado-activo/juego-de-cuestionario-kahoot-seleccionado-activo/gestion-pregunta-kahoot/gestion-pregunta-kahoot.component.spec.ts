import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPreguntaKahootComponent } from './gestion-pregunta-kahoot.component';

describe('GestionPreguntaKahootComponent', () => {
  let component: GestionPreguntaKahootComponent;
  let fixture: ComponentFixture<GestionPreguntaKahootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPreguntaKahootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPreguntaKahootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
