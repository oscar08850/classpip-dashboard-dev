import { TestBed } from '@angular/core/testing';

import { PuntosInsigniasService } from './puntos-insignias.service';

describe('PuntosInsigniasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuntosInsigniasService = TestBed.get(PuntosInsigniasService);
    expect(service).toBeTruthy();
  });
});
