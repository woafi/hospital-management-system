"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

const emptyFieldErrors = {
  name: "",
  email: "",
  phone: "",
  receptionists_id: "",
  gender: "",
  shift: "",
  profileImage: "",
  isActive: "",
};

const getValues = (raw) => ({
  name: raw.name || "",
  email: raw.email || "",
  phone: raw.phone || "",
  receptionists_id: raw.receptionists_id || "",
  gender: raw.gender || "",
  shift: raw.shift || "",
  profileImage: raw.profileImage || "",
  isActive: raw.isActive === "on" ? "on" : "off",
});


const receptionistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^01[0-9]{9}$/, "Invalid phone number format"),
  receptionists_id: z
    .string()
    .trim()
    .min(1, "Receptionist ID is required")
    .regex(
      /^[A-Z]+-\d+$/,
      "Format must be like REC-247"
    ),
  gender: z
    .enum(["Male", "Female", "Other"], "Gender is required")
    .transform((value) => value.toUpperCase()),
  shift: z.enum(["Morning", "Evening", "Night"], "Shift is required"),
  profileImage: z
    .string()
    .trim()
    .url("Uploaded image URL is invalid")
    .optional()
    .or(z.literal("")),
  isActive: z
    .enum(["on", "off"])
    .transform((value) => value === "on" ? "on" : "off"),
});

/** Default login password for new staff accounts (same pattern as doctor onboarding). */
const DEFAULT_RECEPTIONIST_PASSWORD = "Receptionist@123";

export async function receptionistFormsubmissionAction(prevState, formData) {
  const raw = Object.fromEntries(formData);

  const result = receptionistSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      message: "Invalid receptionist information",
      fieldErrors: {
        name: fieldErrors.name?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        phone: fieldErrors.phone?.[0] || "",
        receptionists_id: fieldErrors.receptionists_id?.[0] || "",
        gender: fieldErrors.gender?.[0] || "",
        shift: fieldErrors.shift?.[0] || "",
        profileImage: fieldErrors.profileImage?.[0] || "",
        isActive: fieldErrors.isActive?.[0] || "",
      },
      values: getValues(raw),
    };
  }

  let { name, email, phone, receptionists_id, gender, shift, profileImage, isActive } =
    result.data;
  isActive = raw.isActive === "on" ? true : false;

  try {
    const hashedPassword = await hashPassword(DEFAULT_RECEPTIONIST_PASSWORD);

    await prisma.receptionist.create({
      data: {
        name,
        receptionists_id,
        gender,
        shift,
        profileImage: profileImage || null,
        isActive,
        user: {
          create: {
            email,
            phone,
            password: hashedPassword,
            role: "RECEPTIONIST",
          },
        },
      },
    });
  } catch (error) {
    // Unique constraint (email, phone, or receptionists_id)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target || [];
      const fields = Array.isArray(target) ? target : [target];

      return {
        message: "Receptionist or account already exists",
        fieldErrors: {
          ...emptyFieldErrors,
          email: fields.includes("email") ? "Email already exists" : "",
          phone: fields.includes("phone") ? "Phone number already exists" : "",
          receptionists_id: fields.includes("receptionists_id")
            ? "Receptionist ID already exists"
            : "",
        },
        values: getValues(raw),
      };
    }

    console.error(error);

    return {
      message: "Server Error",
      fieldErrors: emptyFieldErrors,
      values: getValues(raw),
    };
  }

  redirect("/dashboard/receptionists");
}

export async function receptionistEditFormsubmissionAction(prevState, formData) {
  const raw = Object.fromEntries(formData);
  const receptionistId = String(raw.id || "");
  const result = receptionistSchema.safeParse(raw);

  if (!receptionistId) {
    return {
      message: "Receptionist ID is missing",
      fieldErrors: emptyFieldErrors,
      values: getValues(raw),
    };
  }

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      message: "Invalid receptionist information",
      fieldErrors: {
        name: fieldErrors.name?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        phone: fieldErrors.phone?.[0] || "",
        receptionists_id: fieldErrors.receptionists_id?.[0] || "",
        gender: fieldErrors.gender?.[0] || "",
        shift: fieldErrors.shift?.[0] || "",
        profileImage: fieldErrors.profileImage?.[0] || "",
        isActive: fieldErrors.isActive?.[0] || "",
      },
      values: getValues(raw),
    };
  }

  let { name, email, phone, receptionists_id, gender, shift, profileImage, isActive } =
    result.data;
  isActive = raw.isActive === "on" ? true : false;

  try {
    await prisma.receptionist.update({
      where: { id: receptionistId },
      data: {
        name,
        receptionists_id,
        gender,
        shift,
        profileImage: profileImage || null,
        isActive,
        user: {
          update: {
            email,
            phone,
          },
        },
      },
    });
  } catch (error) {
    // Unique constraint (email, phone, or receptionists_id)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target || [];
      const fields = Array.isArray(target) ? target : [target];

      return {
        message: "Receptionist or account already exists",
        fieldErrors: {
          ...emptyFieldErrors,
          email: fields.includes("email") ? "Email already exists" : "",
          phone: fields.includes("phone") ? "Phone number already exists" : "",
          receptionists_id: fields.includes("receptionists_id")
            ? "Receptionist ID already exists"
            : "",
        },
        values: getValues(raw),
      };
    }

    console.error(error);

    return {
      message: "Server Error",
      fieldErrors: emptyFieldErrors,
      values: getValues(raw),
    };
  }
  
  redirect("/dashboard/receptionists");
}
