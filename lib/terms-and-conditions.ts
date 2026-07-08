/**
 * Proposal language pulled from the client-supplied "1 CT T-OFF.docx" template.
 */
export const ROOFWORX_CONTRACTOR_INTRO =
  'ROOF WORX EXTERIORS, INC., an Illinois corporation, hereinafter ("CONTRACTOR") hereby proposes to furnish the materials and perform the labor necessary for the completion of the following work (the "WORK"):';

export const ROOFWORX_CT_T_OFF_SCOPE_ITEMS = [
  "Set up all safety equipment per OSHA requirements.",
  "Protect planted areas from falling debris.",
  "Tear off existing asphalt shingle roof on entire house.",
  "Examine complete roof deck and replace any deteriorated lumber (not in final price see note below).",
  "Install SwiftStart Starter strip on all eaves and rakes.",
  "Install WinterGuard Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
  "Install CertainTeed RoofRunner synthetic felt.",
  "Furnish and Install CertainTeed Landmark architectural limited lifetime roofing shingles, per manufacturer's specifications. (color)_________________.",
  "Install new VELUX preinstalled white, room darkening, solar powered, battery-operated shade skylight in existing location.",
  "Install new CertainTeed 4-foot ridge vents.",
  "Install new R-51 roof vents in existing locations (color)_________________.",
  "Install new power vent with humidistat (interior electrical connection to be completed by electrician).",
  "Install new kitchen vent in existing location.",
  "Install new bathroom vent in existing location.",
  "Install new lead soil stack cover in existing locations.",
  "Install new metal chimney flashing (color)_________________.",
  "Install Shadow Ridge Hip and Ridge to match shingles overlapped to conceal fastener.",
  "Install new 24-gauge W-valley on all valleys of house (color)_________________.",
  "Install new drip edge on all rakes of house (color)_________________.",
  "Install new gutter apron on all eaves of house (color)_________________.",
  "Install new chimney housing in existing locations (color)_________________.",
  "Install new roof to wall metal in existing locations.",
  "Install new step flashing in existing locations.",
  "No interior carpentry work to tunnel of skylight is included in pricing (see carpentry pricing below).",
  "Roof to be secured at the end of each workday to protect against inclement weather.",
  "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
  "Gutters and downspouts to be cleaned of all roofing debris.",
  "Debris to be hauled away upon completion.",
  "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
  "Ten-year workmanship guarantee.",
  "Permit fees and municipality requirements, if required, are to be paid by Customer and are in addition to the Contract Price listed below.",
];

export const ROOFWORX_CT_T_OFF_SCOPE_DESCRIPTION =
  ROOFWORX_CT_T_OFF_SCOPE_ITEMS.map((item, index) => `${index + 1}. ${item}`).join("\n");

export const ROOFWORX_CT_T_OFF_OPTION =
  "OPTION:\nCertainTeed 4-Star Limited Warranty. $348.00 ______ please initial";

export const ROOFWORX_PROPOSAL_EXPIRATION =
  "Due to fluctuating material pricing in the construction industry we cannot hold to contract pricing for more than seven (7) days. In the event this Proposal is not accepted within seven (7) days of the Proposal Date, the Contractor shall have the right to either: (a) terminate this Proposal with no rights duties or responsibilities between the parties; or (b) offer a new Proposal with a new Contract Price to the Customer which shall not be binding unless accepted and signed by the Customer.";

export const ROOFWORX_PROPOSAL_NOTE =
  "Charges includes removal of one (1) layer of roofing; if additional layers are found, additional cost to the Customer will be added to contract. Rotted plywood is replaced at $105.00 per sheet. Any additional carpentry labor is billed at $160.00 per hour, plus materials. Additional Ice and Water Shield coverage required by specific village code will be an additional cost to the Customer. Any areas on roof with existing roof-to-wall flashing that need replacement or repair will be an additional cost to the Customer.";

export const ROOFWORX_STANDARD_TERMS_NOTICE =
  'The Work provided hereunder is subject to the Roof Worx Exteriors, Inc. Standard Terms and Conditions attached (the "Standard Terms and Conditions"). Customer hereby represents and warrants that Customer has reviewed and accepted the Standard Terms and Conditions prior to execution of this Contract. Customer may cancel the Signed Contract within three (3) business days from the Signed Contract Date through the execution of the Notice of Cancellation incorporated herein as Exhibit A attached hereto (the "Notice of Cancellation").';

export const ROOFWORX_PAYMENT_TERMS =
  "PAYMENT TO BE MADE AS FOLLOWS: 1/2 DOWN UPON EXECUTION OF THIS CONTRACT WITH PAYMENT IN FULL DUE UPON COMPLETION OF WORK.";

export const ROOFWORX_ACCEPTANCE_TEXT =
  "The above Contract Price and other prices, specifications, and conditions are satisfactory and are hereby accepted. You are authorized to perform the Work as specified. Payment will be made as outlined above.";

export const ROOFWORX_CANCELLATION_NOTICE =
  "YOU, THE CUSTOMER, MAY CANCEL THIS CONTRACT AT ANY TIME PRIOR TO MIDNIGHT OF THE THIRD (3rd) BUSINESS DAY AFTER THE DATE OF EXECUTION. SEE THE ATTACHED NOTICE OF CANCELLATION FORM AS EXPLANATION OF THIS RIGHT.";

export const ROOFWORX_TERMS_AND_CONDITIONS = [
  `Proposal Expiration: ${ROOFWORX_PROPOSAL_EXPIRATION}`,
  `NOTE: ${ROOFWORX_PROPOSAL_NOTE}`,
  ROOFWORX_STANDARD_TERMS_NOTICE,
  ROOFWORX_PAYMENT_TERMS,
  ROOFWORX_CANCELLATION_NOTICE,
].join("\n\n");
