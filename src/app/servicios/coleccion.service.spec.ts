import { TestBed } from '@angular/core/testing';

import { ColeccionService } from './coleccion.service';

describe('ColeccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColeccionService = TestBed.get(ColeccionService);
    expect(service).toBeTruthy();
  });
});
