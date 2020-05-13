import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MisEscenariosComponent } from './mis-escenarios.component';


describe('MisColeccionesComponent', () => {
  let component: MisEscenariosComponent;
  let fixture: ComponentFixture<MisEscenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisEscenariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEscenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
