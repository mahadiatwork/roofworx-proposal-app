/** Proposal language transcribed from the client-supplied DOCX product templates. */
export const ROOFWORX_CONTRACTOR_INTRO =
  'ROOF WORX EXTERIORS, INC., an Illinois corporation, hereinafter ("CONTRACTOR") hereby proposes to furnish the materials and perform the labor necessary for the completion of the following work (the "WORK"):';

type ProductProposalTemplate = {
  scopeItems: readonly string[];
  numbered?: boolean;
  options?: readonly string[];
  proposalExpiration?: string;
  proposalNote?: string;
};

export const ROOFWORX_PROPOSAL_EXPIRATION =
  "Due to fluctuating material pricing in the construction industry we cannot hold to contract pricing for more than seven (7) days. In the event this Proposal is not accepted within seven (7) days of the Proposal Date, the Contractor shall have the right to either: (a) terminate this Proposal with no rights duties or responsibilities between the parties; or (b) offer a new Proposal with a new Contract Price to the Customer which shall not be binding unless accepted and signed by the Customer.";

export const ROOFWORX_PROPOSAL_NOTE =
  "Charges includes removal of one (1) layer of roofing; if additional layers are found, additional cost to the Customer will be added to contract. Rotted plywood is replaced at $105.00 per sheet. Any additional carpentry labor is billed at $160.00 per hour, plus materials. Additional Ice and Water Shield coverage required by specific village code will be an additional cost to the Customer. Any areas on roof with existing roof-to-wall flashing that need replacement or repair will be an additional cost to the Customer.";

const GARAGE_PROPOSAL_EXPIRATION =
  "Due to fluctuating material pricing in the construction industry we cannot hold to contract pricing for more than thirty (30) days. In the event this Proposal is not accepted within seven (7) days of the Proposal Date, the Contractor shall have the right to either: (a) terminate this Proposal with no rights duties or responsibilities between the parties; or (b) offer a new Proposal with a new Contract Price to the Customer which shall not be binding unless accepted and signed by the Customer.";

const GARAGE_PROPOSAL_NOTE =
  "Charges includes removal of one (1) layer of roofing; if additional layers are found, additional cost to the Customer will be added to contract. Rotted plywood is replaced at $105.00 per sheet. Any additional carpentry labor is billed at $160.00 per hour, plus materials.";

const NEW_CONSTRUCTION_PROPOSAL_NOTE =
  "Any additional carpentry labor is billed at $160.00 per hour, plus materials. Additional Ice and Water Shield coverage required by specific village code will be an additional cost to the Customer. Any areas on roof with existing roof-to-wall flashing that need replacement or repair will be an additional cost to the Customer.";

const SIDING_PROPOSAL_NOTE =
  "Rotted plywood is replaced at $105.00 per sheet. Any additional carpentry labor is billed at $160.00 per hour, plus materials.";

const TWO_LAYER_PROPOSAL_NOTE =
  "Charges includes removal of up to two (2) layers of roofing; if additional layers are found, additional cost to the Customer will be added to contract. Rotted plywood is replaced at $105.00 per sheet. Any additional carpentry labor is billed at $160.00 per hour, plus materials. Additional Ice and Water Shield coverage required by specific village code will be an additional cost to the Customer. Any areas on roof with existing roof-to-wall flashing that need replacement or repair will be an additional cost to the Customer.";

const ONE_LAYER_PROPOSAL_NOTE =
  "Charges includes removal of up to one (1) layer of roofing; if additional layers are found, additional cost to the Customer will be added to contract. Rotted plywood is replaced at $105.00 per sheet. Any additional carpentry labor is billed at $160.00 per hour, plus materials. Additional Ice and Water Shield coverage required by specific village code will be an additional cost to the Customer. Any areas on roof with existing roof-to-wall flashing that need replacement or repair will be an additional cost to the Customer.";

const SKYLIGHT_PROPOSAL_EXPIRATION =
  "Due to fluctuating material pricing in the construction industry, we cannot hold to contract pricing for more than seven (7) days. In the event this Proposal is not accepted within seven (7) days of the Proposal Date, the Contractor shall have the right to either: (a) terminate this Proposal with no rights duties or responsibilities between the parties; or (b) offer a new Proposal with a new Contract Price to the Customer which shall not be binding unless accepted and signed by the Customer.";

const PRODUCT_PROPOSAL_TEMPLATES: Record<string, ProductProposalTemplate> = {
  // 1 - CT T-Off.docx
  "1": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Planted areas to be protected from falling debris.",
      "Strip off asphalt shingle roof on entire house.",
      "Examine complete roof deck and replace any deteoriated lumber (not in final price see note below)",
      "Install Swift Start Starter strip on all eaves and rakes.",
      "Install Grace Select Winter Guard Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install CertainTeed Roof Runner synthetic felt.",
      "Furnish and Install CertainTeed Landmark architectural limited lifetime roofing shingles, per manufacturer's specifications. (color)_________________.",
      "Install new VELUX - preinstalled white, room darkening, solar powered, battery-operated shade skylight in existing location.",
      "Install new CertainTeed 4-foot ridge vents.",
      "Install new R-51 roof vents in existing locations (color)_________________.",
      "Install new power vent with humidistat (inside to be done by electrician).",
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
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, and municipality requirements, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    options: ["CertainTeed 4-Star Limited Warranty. $348.00 ______ please initial"],
  },

  // 1.1 - CT T-Off - Insurance.docx
  "1.1": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Tear off existing asphalt shingle roof on entire house (Line items *** as per adjuster summary sheet).",
      "Examine complete roof deck and replace any deteriorated lumber (not included in final price; see note below).",
      "Install CertainTeed SwiftStart starter strip on all eaves and rakes.",
      "Install Grace Select WinterGuard Ice & Water Shield, 6-feet at eaves and 3-feet in valleys.",
      "Install CertainTeed RoofRunner synthetic underlayment.",
      "Furnish and install CertainTeed Landmark Limited Lifetime architectural shingles per manufacturer's specifications. (Color)_________________.",
      "Install Shadow Ridge Hip & Ridge to match shingles, overlapped to conceal fasteners.",
      "Install new CertainTeed 4-foot ridge vent system.",
      "Install new R-51 roof vents in existing locations (color)_________________.",
      "Install new power vent with humidistat in existing location. (Electrical connection inside home to be completed by electrician.)",
      "Install new kitchen vent in existing location.",
      "Install new bathroom vent in existing location.",
      "Install new lead soil stack covers in existing locations.",
      "Install new metal chimney flashing. (color)_________________.",
      "Install new 24-gauge W-valley metal in all valleys of house. (color)_________________.",
      "Install new drip edge on all rakes of house. (color)_________________.",
      "Install new gutter apron on all eaves of house. (color)_________________.",
      "Install new chimney housing in existing location. (color)_________________.",
      "Install new roof-to-wall metal flashing in existing locations.",
      "Install new step flashing in existing locations.",
      "Install new rain caps in existing locations.",
      "Install new VELUX pre-finished white, room-darkening, solar-powered, battery-operated shade skylight in existing location.",
      "No interior carpentry work to skylight tunnel is included in pricing (see carpentry pricing below).",
      "Protect planted areas from falling debris.",
      "Roof to be secured at the end of each workday to protect against inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away upon completion.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten (10) year workmanship guarantee.",
      "Permit fees, if required, are to be paid by Customer and are in addition to the Contract Price listed below.",
      "Homeowner is responsible for any insurance deductible.",
      "Any additional funds approved by the insurance company for permit fees, code-required items, and supplements shall be paid directly to contractor.",
    ],
  },

  // 1.2 CT GARAGE T-off.docx
  "1.2": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Strip off asphalt shingle roof on entire garage.",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price, see note below).",
      "Install Swift Start Starter strip on all eaves and rakes.",
      "Install CertainTeed Roof Runner synthetic felt.",
      "Furnish and install CertainTeed Landmark architectural limited lifetime roofing shingles, per manufacturer's specifications (color) ________________.",
      "Install new R-51 roof vents in existing locations (color)______________________.",
      "Install Shadow Ridge Hip and Ridge to match shingles overlapped to conceal fasteners.",
      "Install new drip edge on all rakes of garage if existing (color)___________________________.",
      "Install new gutter apron on all eaves of house (color)_________________________.",
      "Planted areas to be protected from falling debris.",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalExpiration: GARAGE_PROPOSAL_EXPIRATION,
    proposalNote: GARAGE_PROPOSAL_NOTE,
  },

  // 1.25 - CT GARAGET-Off - Insurance.docx
  "1.25": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Strip off asphalt shingle roof on entire garage (Line items *** as per adjustor summary sheet).",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price, see note below).",
      "Install Swift Start Starter strip on all eaves and rakes.",
      "Install CertainTeed Winter Guard Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install CertainTeed Roof Runner synthetic felt.",
      "Furnish and install CertainTeed Landmark architectural limited lifetime roofing shingles, per manufacturer's specifications (color) ________________.",
      "Install Shadow Ridge Hip and Ridge to match shingles overlapped to conceal fasteners.",
      "Install new R-51 roof vents in existing locations (color)______________________.",
      "Install new drip edge on all rakes of garage (color)___________________________.",
      "Install new gutter apron on all eaves of garage (color)_________________________.",
      "Install new rain caps in existing locations.",
      "Planted areas to be protected from falling debris.",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
      "Homeowner is responsible for any deductible.",
      "Additional fees to be paid to contractor by insurance company for permit, code required ice & water shield, & supplements.",
    ],
  },

  // 2 GAF T-Off.docx
  "2": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Strip off asphalt shingle roof on entire house.",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price see note below)",
      "Install GAF Pro-Start starter strip on all eaves and rakes.",
      "Install GAF Weather Watch Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install GAF FeltBuster synthetic roofing underlayment felt.",
      "Furnish and Install Timberline HDZ Limited Lifetime architectural shingles, per manufacturer's specifications. (color)_________________.",
      "Install new VELUX - preinstalled white, room darkening, solar powered, battery-operated shade skylight in existing location.",
      "Install new GAF Snow Country 4-foot ridge vents.",
      "Install new R-51 roof vents in existing locations (color)_________________.",
      "Install new power vent with humidistat (inside to be done by electrician).",
      "Install new kitchen vent in existing location.",
      "Install new bathroom vent in existing location.",
      "Install new lead soil stack cover in existing locations.",
      "Install new metal chimney flashing (color)_________________.",
      "Install Timbertex Hip and Ridge to match shingles overlapped to conceal fastener.",
      "Install new 24-gauge W-valley on all valleys of house (color)_________________.",
      "Install new drip edge on all rakes of house (color)_________________.",
      "Install new gutter apron on all eaves of house (color)_________________.",
      "Install new chimney housing in existing locations (color)_________________.",
      "Install new roof to wall metal in existing locations (color)_________________.",
      "Install new step flashing in existing locations.",
      "Planted areas to be protected from falling debris.",
      "No interior carpentry work to tunnel of skylight is included in pricing (see carpentry pricing below).",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    options: [
      "GAF Silver Pledge Limited Warranty $264.00 _______ please initial",
      "GAF Golden Pledge Limited Warranty $316.00 _______ please initial",
    ],
  },

  // 2.1 - GAF T-Off - Insurance.docx
  "2.1": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Tear off existing asphalt shingle roof on entire house (Line items *** as per adjuster summary sheet).",
      "Examine complete roof deck and replace any deteriorated lumber (not included in final price; see note below).",
      "Install GAF Pro-Start starter strip on all eaves and rakes.",
      "Install GAF WeatherWatch Ice & Water Shield, 6-feet at eaves and 3-feet in valleys.",
      "Install GAF FeltBuster synthetic roofing underlayment.",
      "Furnish and install GAF Timberline HDZ Limited Lifetime architectural shingles per manufacturer's specifications. (Color)_________________.",
      "Install TimberTex Hip & Ridge to match shingles, overlapped to conceal fasteners.",
      "Install new GAF Snow Country 4-foot ridge vent system.",
      "Install new R-51 roof vents in existing locations (Color)_________________.",
      "Install new power vent with humidistat (inside electrical to be completed by electrician).",
      "Install new kitchen vent in existing location.",
      "Install new bathroom vent in existing location. (Supplement requested; pending approval and not included in Contract Price below.)",
      "Install new lead soil stack covers in existing locations.",
      "Install new metal chimney flashing. (Color)_________________.",
      "Install new 24-gauge W-valley metal in all valleys of house. (Color)_________________.",
      "Install new drip edge on all rakes of house. (Color)_________________.",
      "Install new gutter apron on all eaves of house. (Color)_________________.",
      "Install new chimney housing in existing location. (Color)_________________.",
      "Install new roof-to-wall metal flashing in existing locations.",
      "Install new step flashing in existing locations.",
      "Install new rain caps in existing locations.",
      "Install new VELUX pre-finished white, room-darkening, solar-powered, battery-operated shade skylight in existing location.",
      "No interior carpentry work to skylight tunnel is included in pricing (see carpentry pricing below).",
      "Protect planted areas from falling debris.",
      "Roof to be secured at the end of each workday to protect against inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away upon completion.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten (10) year workmanship guarantee.",
      "Permit fees, if required, are to be paid by Customer and are in addition to the Contract Price listed below.",
      "Homeowner is responsible for any insurance deductible.",
      "Any additional funds approved by the insurance company for permit fees, code-required items, and supplements shall be paid directly to contractor",
    ],
  },

  // 2.2 - GAF GARAGE T-Off.docx
  "2.2": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Strip off asphalt shingle roof on entire garage.",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price, see note below).",
      "Install GAF Weather Watch Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install GAF FeltBuster synthetic roofing underlayment felt.",
      "Furnish and Install Timberline HDZ Limited Lifetime architectural shingles, per manufacturer's specifications. (color)_________________.",
      "Install new R-51 roof vents in existing locations (color)______________________.",
      "Install Timbertex Hip and Ridge to match shingles overlapped to conceal fastener.",
      "Install new drip edge on all rakes of garage if existing (color)___________________________.",
      "Install new gutter apron on all eaves of house (color)_________________________.",
      "Planted areas to be protected from falling debris.",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalNote: GARAGE_PROPOSAL_NOTE,
  },

  // 2.25 - GAF GARAGE T-Off - Insurance.docx
  "2.25": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Strip off asphalt shingle roof on entire garage (Line items *** as per adjustor summary sheet).",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price, see note below).",
      "Install GAF Pro-Start starter strip on all eaves and rakes.",
      "Install GAF Weather Watch Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install GAF FeltBuster synthetic roofing underlayment felt.",
      "Furnish and Install Timberline HDZ Limited Lifetime architectural shingles, per manufacturer's specifications. (color)_________________.",
      "Install Timbertex Hip and Ridge to match shingles overlapped to conceal fastener.",
      "Install new R-51 roof vents in existing locations (color)______________________.",
      "Install new drip edge on all rakes of garage (color)___________________________.",
      "Install new gutter apron on all eaves of garage (color)_________________________.",
      "Install new rain caps in existing locations.",
      "Planted areas to be protected from falling debris.",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
      "Homeowner is responsible for any deductible.",
      "Additional fees to be paid to contractor by insurance company for permit, code required ice & water shield, & supplements.",
    ],
  },

  // 3 - Flat Roof Membrane.docx
  "3": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Tear off complete flat roof of house and examine roof deck.",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price, see note below).",
      "Install Flintlastic base sheet on flat roof areas.",
      "Install Flintlastic cap sheet on flat roof areas (color)___________________________.",
      "Install modified roof system on same.",
      "Install all necessary flashing where needed (color)___________________________.",
      "Planted areas to be protected from falling debris.",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalNote: ONE_LAYER_PROPOSAL_NOTE,
  },

  // 3.5 - Flat Roof EPDM.docx
  "3.5": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Tear off complete flat roof of house.",
      "Examine complete roof deck and replace any deteriorated lumber (not in final price, see note below).",
      "Install EPDM roof system fully adheard on same.",
      "Install all necessary flashing where needed.",
      "Planted areas to be protected from falling debris.",
      "Roof to be secured every night to protect from inclement weather.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Gutters and downspouts to be cleaned of all roofing debris.",
      "Debris to be hauled away.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalNote: TWO_LAYER_PROPOSAL_NOTE,
  },

  // 4 - Skylights.docx
  "4": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Remove shingles around existing skylight.",
      "Install new VELUX - preinstalled white, room darkening, solar powered, battery-operated shade skylight in existing location.",
      "where old one was removed.",
      "Install Ice & Water shield on roof deck around skylight.",
      "Install necessary flashing.",
      "Install felt paper.",
      "Install back new shingles where old were removed. (shingles will not be an exact match)",
      "Seal around new skylight.",
      "No interior carpentry work &/or painting to tunnel of skylight is included in pricing (see carpentry pricing below).",
      "Planted areas to be protected from falling debris.",
      "Jobsite to be cleaned daily.",
      "Debris to be hauled away.",
      "One-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalExpiration: SKYLIGHT_PROPOSAL_EXPIRATION,
  },

  // 10- Siding.docx
  "10": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Remove old siding on complete house.",
      "Install house wrap on complete house.",
      "Install J Channel around all windows and doors where siding exists",
      "Install corner posts where needed on complete house.",
      "Install starter to install siding to main bottom plate.",
      "Install vinyl siding on complete house.",
      "Nail all siding to studs properly using two (2) inch siding nails with 1/4 to 1/2 inch allowing for expansion and contraction.",
      "All siding to be installed according to manufacturing specifications.",
      "Planted areas to be protected from falling debris.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Debris to be hauled away.",
      "Two year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalNote: SIDING_PROPOSAL_NOTE,
  },

  // 11 - CT New Construction.docx
  "11": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Inspect complete roof deck.",
      "Install Swift Start Starter strip on all eaves and rakes.",
      "Install CertainTeed Winter Guard Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install CertainTeed Roof Runner synthetic felt.",
      "Furnish and install CertainTeed Landmark architectural limited lifetime roofing shingles, per manufacturer's specifications (color) ________________.",
      "Install new CertainTeed 4-foot ridge vents.",
      "Install new R-51 roof vents. (color)______________________.",
      "Install new kitchen vent.",
      "Install new bathroom vent.",
      "Install new lead soil stack covers.",
      "Install new metal chimney flashing. (color)____________.",
      "Install Shadow Ridge Hip and Ridge to match shingles overlapped to conceal fasteners.",
      "Install new 24-gauge W-valley on all valleys of house (color) __________________.",
      "Install new drip edge on all rakes of house (color)___________________________.",
      "Install new gutter apron on all eaves of house (color)_________________________.",
      "Install new chimney housing in existing locations (color)_________________________.",
      "Install new roof to wall metal.",
      "Install new step flashing.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
      "Jobsite to be inspected prior to commenecement of work for ______ blueprint accuracy.",
    ],
    proposalNote: NEW_CONSTRUCTION_PROPOSAL_NOTE,
  },

  // 12 - GAF New Construction.docx
  "12": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Inspect complete roof deck.",
      "Install GAF Pro-Start starter strip on all eaves and rakes.",
      "Install GAF Weather Watch Ice and Water Shield, 6-feet at eaves, and 3-feet in valleys.",
      "Install GAF FeltBuster synthetic roofing underlayment felt.",
      "Furnish and Install Timberline HDZ Lifetime architectural shingles, per manufacturer's specifications. (color)_________________.",
      "Install new VELUX - preinstalled white, room darkening, solar powered, battery-operated shade skylight in existing location.",
      "Install new GAF Snow Country 4-foot ridge vents.",
      "Install new R-51 roof vents. (color)______________________.",
      "Install new kitchen vent.",
      "Install new bathroom vent.",
      "Install new lead soil stack covers.",
      "Install new metal chimney flashing. (color)____________.",
      "Install Timbertex Hip and Ridge to match shingles overlapped to conceal fastener.",
      "Install new 24-gauge W-valley on all valleys of house (color) __________________.",
      "Install new drip edge on all rakes of house (color)___________________________.",
      "Install new gutter apron on all eaves of house (color)_________________________.",
      "Install new chimney housing in existing locations (color)_________________________.",
      "Install new roof to wall metal.",
      "Install new step flashing.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Debris to be hauled away.",
      "Limited Lifetime manufacturer warranty, as provided by manufacturer.",
      "Ten-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
      "Jobsite to be inspected prior to commenecement of work for ______ blueprint accuracy.",
    ],
    proposalNote: NEW_CONSTRUCTION_PROPOSAL_NOTE,
  },

  // 13 - 60Mil TPO.docx
  "13": {
    scopeItems: [
      "Tear off complete flat roof of building.",
      "Remove any copping flashing and drip edge flashing around perimeters of roof.",
      "Install insulation board mechanically fastened with screws and plates to metal roof deck as per manufacture specifications.",
      "Install 45 degree can strip around perimeters of parapet walls and air conditioner curbing.",
      "Install TPO 60 mil roofing system.",
      "Install all necessary flashing and term bar where needed.",
      "Prime any new flashing using a TPO adhesive primer.",
      "Install back all existing flashing on copings where removed using existing metal.",
      "Planted areas to be protected from falling debris.",
      "Roof to be dried in every night to protect from inclement weather.",
      "Job site to be cleaned daily.",
      "Job site to be magnetically swept for nails and debris.",
      "Clean gutters and downspouts of all roofing debris.",
      "Haul away debris.",
      "Ten-year workmanship guarantee.",
      "Plus, permit fee if required",
    ],
    proposalNote: TWO_LAYER_PROPOSAL_NOTE,
  },

  // 14 - Insurance Elevations.docx
  "14": {
    scopeItems: [
      "FRONT ELEVATION\nPer line items on summary lines",
      "RIGHT ELEVATION\nPer line items on summary lines",
      "LEFT ELEVATION\nPer line items on summary lines",
      "REAR ELEVATION\nPer line items on summary lines",
    ],
    numbered: false,
    proposalNote: ONE_LAYER_PROPOSAL_NOTE,
  },

  // 15- LP Smartside Siding.docx
  "15": {
    scopeItems: [
      "Set up all safety equipment per OSHA requirements.",
      "Remove old siding on complete house.",
      "Check underlayment for deterioration and make necessary repairs. (Additional labor and material cost to be added)",
      "Install house wrap on complete house.",
      "Install J Channel around all windows and doors where siding exists",
      "Install starter to install siding to main bottom plate.",
      "Install .044 Dutch Lap vinyl siding where specified by homeowner. COLOR: LINEN",
      "Nail all siding to studs properly using two (2) inch siding nails with 1/4 to 1/2 inch allowing for expansion and contraction.",
      "All siding to be installed per manufacturer specifications.",
      "Install LP trim board around bay door area on rear of house and around window on rear garage side of house.",
      "Install LP Smart Board with LP Batten Strips on both bay window bump outs and around front door area on front of house. (COLOR: _______________________)",
      "Nail back fascia where needed per homeowners instructions.",
      "Caulk all necessary areas of siding.",
      "Planted areas to be protected from falling debris.",
      "Jobsite to be cleaned daily and magnetically swept for nails and debris.",
      "Debris to be hauled away.",
      "Five-year workmanship guarantee.",
      "Permit fees, if required, to be paid by Customer and is in addition to Contract Price listed below.",
    ],
    proposalNote: SIDING_PROPOSAL_NOTE,
  },
};

function getProductTemplate(productName: string): ProductProposalTemplate | undefined {
  const code = productName.trim().match(/^(\d+(?:\.\d+)?)(?=$|\s|[-:])/)?.[1];
  return code ? PRODUCT_PROPOSAL_TEMPLATES[code] : undefined;
}

export function getProductTemplateDescription(productName: string): string | undefined {
  const template = getProductTemplate(productName);
  if (!template) return undefined;

  const scope = template.scopeItems
    .map((item, index) => template.numbered === false ? item : `${index + 1}. ${item}`)
    .join(template.numbered === false ? "\n\n" : "\n");
  if (!template.options?.length) return scope;

  const optionLabel = template.options.length === 1 ? "OPTION" : "OPTIONS";
  return `${scope}\n\n${optionLabel}:\n${template.options.map((option) => `- ${option}`).join("\n")}`;
}

export const ROOFWORX_STANDARD_TERMS_NOTICE =
  'The Work provided hereunder is subject to the Roof Worx Exteriors, Inc. Standard Terms and Conditions attached (the "Standard Terms and Conditions"). Customer hereby represents and warrants that Customer has reviewed and accepted the Standard Terms and Conditions prior to execution of this Contract. Customer may cancel the Signed Contract within three (3) business days from the Signed Contract Date through the execution of the Notice of Cancellation incorporated herein as Exhibit A attached hereto (the "Notice of Cancellation").';

export const ROOFWORX_PAYMENT_TERMS =
  "PAYMENT TO BE MADE AS FOLLOWS: 1/2 DOWN UPON EXECUTION OF THIS CONTRACT WITH PAYMENT IN FULL DUE UPON COMPLETION OF WORK.";

export const ROOFWORX_ACCEPTANCE_TEXT =
  "The above Contract Price and other prices, specifications, and conditions are satisfactory and are hereby accepted. You are authorized to perform the Work as specified. Payment will be made as outlined above.";

export const ROOFWORX_CANCELLATION_NOTICE =
  "YOU, THE CUSTOMER, MAY CANCEL THIS CONTRACT AT ANY TIME PRIOR TO MIDNIGHT OF THE THIRD (3rd) BUSINESS DAY AFTER THE DATE OF EXECUTION. SEE THE ATTACHED NOTICE OF CANCELLATION FORM AS EXPLANATION OF THIS RIGHT.";

function formatTerms(proposalExpiration: string, proposalNote: string): string {
  return [
    `Proposal Expiration: ${proposalExpiration}`,
    `NOTE: ${proposalNote}`,
    ROOFWORX_STANDARD_TERMS_NOTICE,
    ROOFWORX_PAYMENT_TERMS,
    ROOFWORX_CANCELLATION_NOTICE,
  ].join("\n\n");
}

export function getProductProposalTerms(productName?: string) {
  const template = productName ? getProductTemplate(productName) : undefined;
  const proposalExpiration = template?.proposalExpiration ?? ROOFWORX_PROPOSAL_EXPIRATION;
  const proposalNote = template?.proposalNote ?? ROOFWORX_PROPOSAL_NOTE;

  return {
    proposalExpiration,
    proposalNote,
    termsAndConditions: formatTerms(proposalExpiration, proposalNote),
  };
}

export const ROOFWORX_TERMS_AND_CONDITIONS = formatTerms(
  ROOFWORX_PROPOSAL_EXPIRATION,
  ROOFWORX_PROPOSAL_NOTE
);
