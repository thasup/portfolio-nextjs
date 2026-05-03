/**
 * CapitalOS - Validation Schemas & Type Definitions
 * 
 * Zod schemas for runtime validation of API inputs and JSONB structures.
 * Provides type-safe parsing with detailed error messages.
 */

import { z } from "zod";
import { CapitalMappingRole, CapitalAssetType, CapitalGoalPriority } from "@prisma/client";

// ============================================================================
// JSONB Structure Types
// ============================================================================

/**
 * SA Asset mapping entry stored in capital_mapping_configs.sa_asset_mappings
 */
export const SAAssetMappingSchema = z.object({
  saTicker: z.string().min(1, "Ticker is required"),
});

export type SAAssetMapping = z.infer<typeof SAAssetMappingSchema>;

/**
 * Array of SA asset mappings (the actual JSONB column value)
 */
export const SAAssetMappingsArraySchema = z.array(SAAssetMappingSchema);

export type SAAssetMappingsArray = z.infer<typeof SAAssetMappingsArraySchema>;

// ============================================================================
// Currency Types
// ============================================================================

/**
 * Satangs - Thai Baht cents (1/100 THB)
 * Stored as BigInt in database
 */
export type Satangs = bigint;

/**
 * Cents - USD cents (1/100 USD)
 * Stored as BigInt for precision
 */
export type Cents = bigint;

/**
 * Convert THB to satangs
 */
export function toSatangs(thb: number): Satangs {
  return BigInt(Math.round(thb * 100));
}

/**
 * Convert satangs to THB
 */
export function fromSatangs(satangs: Satangs): number {
  return Number(satangs) / 100;
}

// ============================================================================
// API Request Schemas
// ============================================================================

/**
 * POST /api/capital-os/mapping - Mapping configuration update
 */
export const MappingConfigRequestSchema = z.object({
  mappings: z.array(
    z.object({
      ynabAccId: z.string().min(1, "YNAB account ID is required"),
      role: z.nativeEnum(CapitalMappingRole),
      saAssetMappings: SAAssetMappingsArraySchema.optional().default([]),
      note: z.string().optional(),
    })
  ).min(1, "At least one mapping is required"),
});

export type MappingConfigRequest = z.infer<typeof MappingConfigRequestSchema>;

/**
 * POST /api/capital-os/accounts - Create/Update account
 */
export const AccountRequestSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100),
  balance: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  type: z.nativeEnum(CapitalAssetType),
  source: z.enum(["MANUAL", "YNAB", "AIRTABLE", "SA_SNAPSHOT"]).optional().default("MANUAL"),
  externalId: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type AccountRequest = z.infer<typeof AccountRequestSchema>;

/**
 * POST /api/capital-os/liabilities - Create/Update liability
 */
export const LiabilityRequestSchema = z.object({
  name: z.string().min(1, "Liability name is required").max(100),
  balance: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  apr: z.number().min(0).max(100).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type LiabilityRequest = z.infer<typeof LiabilityRequestSchema>;

/**
 * POST /api/capital-os/goals - Create/Update goal
 */
export const GoalRequestSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100),
  current: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  target: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  priority: z.nativeEnum(CapitalGoalPriority),
  deadline: z.string().datetime().optional(),
  vehicle: z.string().optional(),
});

export type GoalRequest = z.infer<typeof GoalRequestSchema>;

/**
 * POST /api/capital-os/snapshots - Create snapshot
 */
export const SnapshotRequestSchema = z.object({
  date: z.string().datetime(),
  netWorth: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  liquid: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  invested: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  liabilities: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))),
  saTotal: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))).optional(),
  saPortfolios: z.record(z.any()).optional(),
  fxRateUsdThb: z.number().positive().optional(),
  saAssets: z.array(z.any()).optional(),
});

export type SnapshotRequest = z.infer<typeof SnapshotRequestSchema>;

/**
 * POST /api/capital-os/settings - Update settings
 */
export const SettingsRequestSchema = z.object({
  runwayBurnRate: z.bigint().or(z.number().transform(n => BigInt(Math.round(n * 100)))).optional(),
  runwayAccountIds: z.array(z.string().uuid()).optional(),
  preferredCurrency: z.enum(["THB", "USD", "EUR", "GBP", "JPY"]).optional(),
  numberFormat: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, "Must be BCP 47 locale (e.g., en-US)").optional(),
  dateFormat: z.enum(["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD.MM.YYYY"]).optional(),
  theme: z.enum(["dark", "light"]).optional(),
});

export type SettingsRequest = z.infer<typeof SettingsRequestSchema>;

// ============================================================================
// Airtable Configuration Schemas
// ============================================================================

/**
 * Airtable field mapping structure
 */
export const AirtableFieldMapSchema = z.record(z.string());

export type AirtableFieldMap = z.infer<typeof AirtableFieldMapSchema>;

/**
 * POST /api/capital-os/airtable/config - Airtable configuration
 */
export const AirtableConfigRequestSchema = z.object({
  baseId: z.string().regex(/^app[a-zA-Z0-9]+$/, "Invalid Airtable base ID"),
  name: z.string().min(1).max(100).optional().default("My Airtable Base"),
  isActive: z.boolean().optional().default(true),
  tables: z.array(
    z.object({
      entityType: z.enum(["ACCOUNTS", "LIABILITIES", "GOALS", "SNAPSHOTS", "HOLDINGS"]),
      tableName: z.string().min(1),
      isEnabled: z.boolean().optional().default(true),
      fieldMap: AirtableFieldMapSchema.optional(),
      filterFormula: z.string().optional(),
      customTitle: z.string().optional(),
      customDescription: z.string().optional(),
    })
  ).optional(),
});

export type AirtableConfigRequest = z.infer<typeof AirtableConfigRequestSchema>;

// ============================================================================
// Response Types
// ============================================================================

/**
 * Standard success response
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

/**
 * API response wrapper
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse and validate request body with Zod schema
 * Returns parsed data or throws with formatted error
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    
    throw new ValidationError("Request validation failed", errors);
  }
  
  return result.data;
}

/**
 * Custom validation error with details
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Format validation error for API response
 */
export function formatValidationError(error: ValidationError): ErrorResponse {
  return {
    success: false,
    error: error.message,
    details: error.errors,
  };
}
