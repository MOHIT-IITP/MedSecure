import type { users } from "./schema/user";

type UserRow = typeof users.$inferSelect;

export function omitPassword(user: UserRow) {
  const { password: _password, ...safe } = user;
  return safe;
}

export function toPublicHealthProfile(user: UserRow) {
  return {
    name: user.name,
    age: user.age,
    bloodGroup: user.bloodGroup,
    allergies: user.allergies,
    chronicDiseases: user.chronicDiseases,
    emergencyContact: user.emergencyContact,
  };
}
