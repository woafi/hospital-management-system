// ---------------------------------------------------------------------------
// Patient form helpers — shared serialization for edit/create flows
// ---------------------------------------------------------------------------

const GENDER_TO_FORM = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

/** Format a stored DateTime as YYYY-MM-DD for <input type="date" /> */
export function formatDateForInput(date) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
}

/** Map Prisma Gender enum to the select values used in patient forms */
export function genderForForm(gender) {
  return GENDER_TO_FORM[gender] ?? "";
}

/**
 * Convert a Prisma patient record into a plain object safe to pass
 * from a Server Component to the edit-patient client modal.
 */
export function serializePatientForEditForm(patient) {
  return {
    id: patient.id,
    patientId: patient.patientId,
    fullname: patient.fullname ?? "",
    gender: genderForForm(patient.gender),
    dateOfBirth: formatDateForInput(patient.dateOfBirth),
    phone: patient.phone ?? "",
    email: patient.email ?? "",
    address: patient.address ?? "",
    emergencyName: patient.emergencyName ?? "",
    relationship: patient.relationship ?? "",
    emergencyPhone: patient.emergencyPhone ?? "",
    bloodGroup: patient.bloodGroup ?? "O_Positive",
    age: patient.age != null ? String(patient.age) : "",
    allergies: patient.allergies ?? "",
    profileImage: patient.profileImage ?? "",
  };
}

/** Empty field-error map reused by the edit-patient server action state */
export const emptyPatientFieldErrors = {
  fullname: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  address: "",
  emergencyName: "",
  relationship: "",
  emergencyPhone: "",
  bloodGroup: "",
  age: "",
  allergies: "",
  profileImage: "",
};

/** Build the initial useActionState payload for EditPatientModal */
export function buildEditPatientInitialState(patient) {
  return {
    success: false,
    message: "",
    fieldErrors: { ...emptyPatientFieldErrors },
    values: {
      fullname: patient.fullname,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      emergencyName: patient.emergencyName,
      relationship: patient.relationship,
      emergencyPhone: patient.emergencyPhone,
      bloodGroup: patient.bloodGroup,
      age: patient.age,
      allergies: patient.allergies,
      profileImage: patient.profileImage,
    },
  };
}
