export interface AnonymizationField {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface DocumentAnonymizationData {
  anonymizationFields: AnonymizationField[];
}
