import { SynopsisContent, BidSynopsisProps } from '@/lib/types/bidsynopsis.types';

/**
 * Generates mock synopsis content based on tender data
 */
export const generateMockSynopsisContent = (tender: BidSynopsisProps | null): SynopsisContent => {
  const tenderValue = tender?.tenderValue || 4500000000;
  const tenderValueCrores = tenderValue / 10000000;
  
  return {
    basicInfo: [
      { 
        sno: 1, 
        item: 'Employer', 
        description: tender?.tenderAuthority || 'National Highways Authority of India (NHAI)' 
      },
      { 
        sno: 2, 
        item: 'Name of Work', 
        description: tender?.tenderTitle || 'Construction of 4-Lane Highway from Jaipur to Ajmer (NH-8)' 
      },
      { 
        sno: 3, 
        item: 'Tender Value', 
        description: `Rs. ${tenderValueCrores.toFixed(2)} Crores (Excluding GST)` 
      },
      { 
        sno: 4, 
        item: 'Project Length', 
        description: tender?.tenderLength || '120 km' 
      },
      { 
        sno: 5, 
        item: 'EMD', 
        description: `Rs. ${((tender?.tenderEmd || 90000000) / 10000000).toFixed(2)} Crores in form of Bank Guarantee` 
      },
      { 
        sno: 6, 
        item: 'Cost of Tender Documents', 
        description: 'Rs. 6,49,000/- (To be paid online)' 
      },
      { 
        sno: 7, 
        item: 'Period of Completion', 
        description: '48 Months' 
      },
      { 
        sno: 8, 
        item: 'Pre-Bid Meeting', 
        description: '07/07/2025 at 1530 Hours IST' 
      },
      { 
        sno: 9, 
        item: 'Bid Due date', 
        description: tender?.tenderDueDate || '28.07.2025, 3.00 PM' 
      },
      { 
        sno: 10, 
        item: 'Physical Submission', 
        description: tender?.tenderDueDate || '28.07.2025, 3.00 PM' 
      },
    ],
    
    allRequirements: [
      {
        description: 'Site Visit',
        requirement: 'Bidders shall submit their respective Bids after visiting the Project site and ascertaining for themselves the site conditions, location, surroundings, climate, availability of power, water & other utilities for construction, access to site, handling and storage of materials, weather data, applicable laws and regulations, and any other matter considered relevant by them.',
        ceigallValue: ''
      },
      {
        description: 'Technical Capacity',
        requirement: `For demonstrating technical capacity and experience (the "Technical Capacity"), the Bidder shall, over the past 7 (Seven) financial years preceding the Bid Due Date, have:`,
        ceigallValue: ''
      },
      {
        description: '(i)',
        requirement: 'paid for, or received payments for, construction of Eligible Project(s);',
        ceigallValue: ''
      },
      {
        description: 'Clause 2.2.2 A',
        requirement: `updated in accordance with clause 2.2.2.(I) and/ or (ii) paid for development of Eligible Project(s) in Category 1 and/or Category 2 specified in Clause 3.4.1; updated in accordance with clause 2.2.2.(I) and/ or`,
        ceigallValue: `Rs. ${(tenderValueCrores * 2.4).toFixed(2)} Crores`
      },
      {
        description: '(iii)',
        requirement: `collected and appropriated revenues from Eligible Project(s) in Category 1 and/or Category 2 specified in Clause 3.4.1, updated in accordance with clause 2.2.2.(I) such that the sum total of the above as further adjusted in accordance with clause 3.4.6, is more than Rs. ${(tenderValueCrores * 2.4 * 1.02).toFixed(2)} Crore (the "Threshold Technical Capability").`,
        ceigallValue: ''
      },
      {
        description: '',
        requirement: 'Provided that at least one fourth of the Threshold Technical Capability shall be from the Eligible Projects in Category 1 and/ or Category 3 specified in Clause 3.4.1.',
        ceigallValue: ''
      },
      {
        description: '',
        requirement: `Capital cost of eligible projects should be more than Rs. ${(tenderValue / 1000000).toFixed(2)} Crores.`,
        ceigallValue: ''
      },
      {
        description: 'Similar Work (JV Required)',
        requirement: `Rs. ${(tenderValueCrores * 0.25).toFixed(2)} Crores`,
        ceigallValue: ''
      },
      {
        description: 'a) Highway/Road Work',
        requirement: `One project shall consist of Widening / reconstruction/ up-gradation works on NH/ SH/ Expressway or on any category for four lane road of at least 9 km, having completion cost of project equal to or more than Rs. ${(tenderValueCrores * 0.26).toFixed(2)} crores. For this purpose, a project shall be considered to be completed, if desired purpose of the project is achieved, and more than 90% of the value of work has been completed.`,
        ceigallValue: ''
      },
      {
        description: 'b) Bridge Work',
        requirement: 'One project shall consist of four lane bridge constructed on perennial river with a minimum length of 4.00 km including viaduct approaches, if the bridge so constructed is of 2 lane then the minimum length shall be 6.00 km including viaduct approaches. The bridge constructed shall have span equal to or greater than 50 meters in last 7 years.',
        ceigallValue: ''
      },
      {
        description: 'Credit Rating',
        requirement: 'The Bidder shall have \'A\' and above Credit Rating given by Credit Rating Agencies authorized by SEBI.',
        ceigallValue: ''
      },
      {
        description: 'Clause 2.2.2 A - Special Requirement',
        requirement: 'The bidder in last Seven years, shall have executed minimum 1,00,000 cum of soil stabilization / Full Depth Recycling in Roads / Yards/ Runways etc, using Cement and additives.',
        ceigallValue: ''
      },
      {
        description: '2.2.2 B (i) Financial Capacity',
        requirement: `The Bidder shall have a minimum Financial Capacity of Rs. ${(tenderValueCrores * 0.2).toFixed(2)} Crore at the close of the preceding financial year. Net Worth: Rs. ${(tenderValueCrores * 0.2).toFixed(2)} Crores (Each Member) / Rs. ${(tenderValueCrores * 0.2).toFixed(2)} Crore (JV Total). Provided further that each member of the Consortium shall have a minimum Net Worth of 7.5% of Estimated Project Cost in the immediately preceding financial year.`,
        ceigallValue: ''
      },
      {
        description: '2.2.2 B (ii) Financial Resources',
        requirement: `The bidder shall demonstrate the total requirement of financial resources for concessionaire's contribution of Rs. ${(tenderValueCrores * 0.61).toFixed(2)} Crores. Bidder must demonstrate sufficient financial resources as stated above, comprising of liquid sources supplemented by unconditional commitment by bankers for finance term loan to the proposed SPV.`,
        ceigallValue: ''
      },
      {
        description: '2.2.2 B (iii) Loss-making Company',
        requirement: 'The bidder shall, in the last five financial years have neither been a loss-making company nor been in the list of Corporate Debt Restructuring (CDR) and/or Strategic Debt Restructuring (SDR) and/or having been declared Insolvent. The bidder should submit a certificate from its statutory auditor in this regard.',
        ceigallValue: ''
      },
      {
        description: '2.2.2 B (iv) Average Annual Construction Turnover',
        requirement: `The bidder shall demonstrate an average annual construction turnover of Rs. ${(tenderValueCrores * 0.41).toFixed(2)} crores within last three years.`,
        ceigallValue: ''
      },
      {
        description: 'JV T & C',
        requirement: 'In case of a Consortium, the combined technical capability and net worth of those Members, who have and shall continue to have an equity share of at least 26% (twenty six per cent) each in the SPV, should satisfy the above conditions of eligibility.',
        ceigallValue: ''
      }
    ]
  };
};
