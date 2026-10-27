import { BadRequestException, ConflictException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { MaintenanceStatus } from './enums/maintenance-status.enum.js';
import { assertClosingData, assertValidTransition } from './maintenance-status.rules.js';

const { SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED } = MaintenanceStatus;

describe('assertValidTransition', () => {
  it.each([
    [SCHEDULED, IN_PROGRESS],
    [SCHEDULED, CANCELLED],
    [IN_PROGRESS, COMPLETED],
    [IN_PROGRESS, CANCELLED],
  ])('permite %s -> %s', (from, to) => {
    expect(() => assertValidTransition(from, to)).not.toThrow();
  });

  it.each([
    [COMPLETED, IN_PROGRESS],
    [COMPLETED, SCHEDULED],
    [CANCELLED, IN_PROGRESS],
    [CANCELLED, COMPLETED],
    [SCHEDULED, COMPLETED],
    [IN_PROGRESS, SCHEDULED],
  ])('rechaza %s -> %s con ConflictException', (from, to) => {
    expect(() => assertValidTransition(from, to)).toThrow(ConflictException);
  });
});

describe('assertClosingData', () => {
  it('exige los cuatro datos de cierre y los nombra en el mensaje', () => {
    expect(() => assertClosingData({ status: COMPLETED, finalCost: 1000 })).toThrow(
      new BadRequestException('Para completar el mantenimiento faltan: workPerformed, finishedAt, finalMileage'),
    );
  });

  it('acepta cuando están todos los datos', () => {
    expect(() =>
      assertClosingData({
        status: COMPLETED,
        workPerformed: 'Cambio de aceite',
        finalCost: 0,
        finishedAt: new Date(),
        finalMileage: 1000,
      }),
    ).not.toThrow();
  });
});
