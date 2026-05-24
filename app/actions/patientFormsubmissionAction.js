"use server";

import { revalidatePath } from "next/cache";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const emptyFieldErrors = {
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

const emptyValues = {
  fullname: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  address: "",
  emergencyName: "",
  relationship: "",
  emergencyPhone: "",
  bloodGroup: "O_Positive",
  age: "",
  allergies: "",
  profileImage: "",
};

const getValues = (raw) => ({
  fullname: raw.fullname || "",
  gender: raw.gender || "",
  dateOfBirth: raw.dateOfBirth || "",
  phone: raw.phone || "",
  email: raw.email || "",
  address: raw.address || "",
  emergencyName: raw.emergencyName || "",
  relationship: raw.relationship || "",
  emergencyPhone: raw.emergencyPhone || "",
  bloodGroup: raw.bloodGroup || "O_Positive",
  age: raw.age || "",
  allergies: raw.allergies || "",
  profileImage: raw.profileImage || "",
});

function isValidOptionalPhone(value) {
  if (!value) return true;
  return /^[+()\-\s0-9]{7,20}$/.test(value);
}

function isValidOptionalEmail(value) {
  if (!value) return true;
  return z.string().email().safeParse(value).success;
}

function isValidOptionalDate(value) {
  if (!value) return true;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date <= new Date();
}

function toNullableString(value) {
  const trimmed = String(value || "").trim();
  return trimmed ? trimmed : null;
}

function toNullableAge(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) return undefined;
  return parsed;
}

function buildPatientId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PAT-${year}-${random}`;
}

const patientSchema = z.object({
  receptionistId: z.string().optional(),
  fullname: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  gender: z
    .enum(["Male", "Female", "Other"], "Gender is required")
    .transform((value) => value.toUpperCase()),
  dateOfBirth: z
    .string()
    .trim()
    .refine(isValidOptionalDate, "Date of birth cannot be in the future"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^01[0-9]{9}$/, "Invalid phone number format"),
  email: z
    .string()
    .trim()
    .refine(isValidOptionalEmail, "Enter a valid email address"),
  address: z.string().trim(),
  emergencyName: z.string().trim(),
  relationship: z.string().trim(),
  emergencyPhone: z
    .string()
    .trim()
    .refine(isValidOptionalPhone, "Enter a valid emergency phone number"),
  bloodGroup: z.enum(
    [
      "A_Positive",
      "A_Negative",
      "B_Positive",
      "B_Negative",
      "AB_Positive",
      "AB_Negative",
      "O_Positive",
      "O_Negative",
    ],
    "Blood group is required"
  ),
  age: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (!value) return true;
        const parsed = Number(value);
        return Number.isInteger(parsed) && parsed >= 0 && parsed <= 150;
      },
      "Age must be a whole number between 0 and 150"
    ),
  allergies: z.string().trim(),
  profileImage: z
    .string()
    .trim()
    .url("Uploaded image URL is invalid")
    .optional()
    .or(z.literal("")),
});

export async function patientFormsubmissionAction(prevState, formData) {
  const raw = Object.fromEntries(formData);
  const result = patientSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please fix the highlighted patient details.",
      fieldErrors: {
        fullname: fieldErrors.fullname?.[0] || "",
        gender: fieldErrors.gender?.[0] || "",
        dateOfBirth: fieldErrors.dateOfBirth?.[0] || "",
        phone: fieldErrors.phone?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        address: fieldErrors.address?.[0] || "",
        emergencyName: fieldErrors.emergencyName?.[0] || "",
        relationship: fieldErrors.relationship?.[0] || "",
        emergencyPhone: fieldErrors.emergencyPhone?.[0] || "",
        bloodGroup: fieldErrors.bloodGroup?.[0] || "",
        age: fieldErrors.age?.[0] || "",
        allergies: fieldErrors.allergies?.[0] || "",
        profileImage: fieldErrors.profileImage?.[0] || "",
      },
      values: getValues(raw),
    };
  }

  const {
    receptionistId,
    fullname,
    gender,
    dateOfBirth,
    phone,
    email,
    address,
    emergencyName,
    relationship,
    emergencyPhone,
    bloodGroup,
    age,
    allergies,
    profileImage,
  } = result.data;

  const parsedAge = toNullableAge(age);

  let patient = null;

  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        patient = await prisma.patient.create({
          data: {
            patientId: buildPatientId(),
            fullname,
            gender,
            dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00`) : null,
            phone: toNullableString(phone),
            email: toNullableString(email),
            address: toNullableString(address),
            bloodGroup,
            age: parsedAge,
            allergies: toNullableString(allergies),
            emergencyName: toNullableString(emergencyName),
            emergencyPhone: toNullableString(emergencyPhone),
            relationship: toNullableString(relationship),
            profileImage: profileImage || null,
          },
          select: {
            patientId: true,
          },
        });
        break;
      } catch (error) {
        const duplicatePatientId =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          (Array.isArray(error.meta?.target)
            ? error.meta.target.includes("patientId")
            : error.meta?.target === "patientId");

        if (!duplicatePatientId || attempt === 2) {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Could not register this patient. Please try again.",
      fieldErrors: emptyFieldErrors,
      values: getValues(raw),
    };
  }

  if (receptionistId) {
    revalidatePath(`/receptionist/${receptionistId}/patients`);
  }

  return {
    success: true,
    message: `Patient registered successfully as ${patient.patientId}.`,
    fieldErrors: emptyFieldErrors,
    values: emptyValues,
  };
}
