import { z } from "zod";

export const healthRecordSchema = z.object({

    bloodPressure:
      z.string()
        .optional(),

    sugarLevel:
      z.string()
        .optional(),

    weight:
      z.string()
        .optional(),

    pulse:
      z.string()
        .optional(),

    notes:
      z.string()
        .optional(),
});

export type HealthRecordInput = z.output<typeof healthRecordSchema>;