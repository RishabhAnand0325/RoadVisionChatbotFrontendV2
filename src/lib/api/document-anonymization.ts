import { DocumentAnonymizationData } from "@/lib/types/document-anonymization";

const API_BASE_URL = "/api/v1";

export async function getAnonymizationFields(): Promise<DocumentAnonymizationData> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/document-anonymization/fields`);
  // return response.json();

  // Hardcoded data for now
  return {
    anonymizationFields: [
      { id: "name", label: "Name", description: "Hides all names and initials", enabled: true },
      { id: "email", label: "Email", description: "Redacts email addresses", enabled: true },
      { id: "phone", label: "Phone Number", description: "Masks phone numbers", enabled: true },
      { id: "address", label: "Address", description: "Removes physical addresses", enabled: true },
      { id: "dates", label: "Dates", description: "Anonymizes date references", enabled: false },
      { id: "financial", label: "Financial Information", description: "Hides monetary values and account numbers", enabled: true },
      { id: "organizations", label: "Organizations", description: "Redacts company and organization names", enabled: false },
      { id: "government_ids", label: "Government IDs", description: "Masks Aadhaar, PAN, etc.", enabled: true },
      { id: "bank_details", label: "Bank Details", description: "Removes bank account and IFSC codes", enabled: true },
      { id: "medical", label: "Medical Information", description: "Anonymizes health-related data", enabled: false },
      { id: "biometric", label: "Biometric Data", description: "Redacts fingerprints, facial data", enabled: false },
      { id: "geolocation", label: "Geolocation Data", description: "Removes GPS coordinates and locations", enabled: false },
      { id: "professional", label: "Professional Details", description: "Hides job titles and employer info", enabled: false },
      { id: "ip_address", label: "IP Address", description: "Masks IP addresses", enabled: false },
      { id: "vehicle", label: "Vehicle Information", description: "Redacts license plates and registration", enabled: false },
      { id: "passport", label: "Passport Number", description: "Anonymizes passport details", enabled: true },
    ],
  };
}

export async function anonymizeDocument(file: File, enabledFields: string[]): Promise<Blob> {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // formData.append('fields', JSON.stringify(enabledFields));
  // const response = await fetch(`${API_BASE_URL}/document-anonymization/process`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // return response.blob();

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return the original file for now (in real implementation, this would be processed)
  return file;
}
