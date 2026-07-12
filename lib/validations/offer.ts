import { z } from "zod"

// Matches Prisma Enum
export const OfferStatusSchema = z.enum(["PENDING", "ACCEPTED", "REJECTED", "ARCHIVED"])

export const BenefitsSchema = z.object({
  healthInsurance: z.boolean().default(false),
  dentalInsurance: z.boolean().default(false),
  visionInsurance: z.boolean().default(false),
  retirementPlan: z.boolean().default(false),
  relocation: z.boolean().default(false),
  learningBudget: z.boolean().default(false),
  wfhAllowance: z.boolean().default(false),
  flexibleHours: z.boolean().default(false),
  other: z.string().optional(),
})

export const OfferFormSchema = z.object({
  // Offer Details
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  status: OfferStatusSchema.default("PENDING"),
  notes: z.string().optional(),
  
  // Compensation Details
  baseSalary: z.coerce.number().min(0, "Base salary must be a positive number"),
  currency: z.string().default("USD"),
  bonus: z.coerce.number().min(0).optional(),
  equity: z.coerce.number().min(0).optional(),
  equityType: z.string().optional(),
  signOnBonus: z.coerce.number().min(0).optional(),
  ptoDays: z.coerce.number().min(0).optional(),
  
  benefits: BenefitsSchema.default({
    healthInsurance: false,
    dentalInsurance: false,
    visionInsurance: false,
    retirementPlan: false,
    relocation: false,
    learningBudget: false,
    wfhAllowance: false,
    flexibleHours: false,
  }),
})

export type OfferFormValues = z.infer<typeof OfferFormSchema>
export type BenefitsValues = z.infer<typeof BenefitsSchema>
