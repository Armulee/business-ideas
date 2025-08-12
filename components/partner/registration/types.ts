export interface FormData {
    // Website Details
    websiteUrl: string
    siteName: string
    primaryCategory: string
    audienceRegions: string
    monthlyPageviews: string
    platformCms: string
    embedType: string

    // Placement & Policy
    intendedPlacement: string
    brandFitNotes: string
    noDeceptivePlacement: boolean | string

    // Contact & Payouts
    contactName: string
    contactEmail: string
    businessType: string
    payoutMethod: string

    // Declarations
    legalCompliance: boolean | string
    analyticsConsent: boolean | string
    termsAgreement: boolean | string
}

export const initialFormData: FormData = {
    websiteUrl: "",
    siteName: "",
    primaryCategory: "",
    audienceRegions: "",
    monthlyPageviews: "",
    platformCms: "",
    embedType: "",
    intendedPlacement: "",
    brandFitNotes: "",
    noDeceptivePlacement: false,
    contactName: "",
    contactEmail: "",
    businessType: "",
    payoutMethod: "",
    legalCompliance: false,
    analyticsConsent: false,
    termsAgreement: false,
}

export interface StepProps {
    formData: FormData
    errors: Partial<FormData>
    updateFormData: (field: keyof FormData, value: string | boolean) => void
}