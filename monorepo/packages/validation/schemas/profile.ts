import { z } from "zod";

export const profileSchema =
  z.object({

    name:
      z.string()
        .min(2),

    age:
      z.number()
        .optional(),

    bloodGroup:
      z.string()
        .optional(),

    allergies:
      z.string()
        .optional(),

    chronicDiseases:
      z.string()
        .optional(),

    emergencyContact:
      z.string()
        .optional(),
});

export type ProfileInput =
  z.infer<
    typeof profileSchema
  >;