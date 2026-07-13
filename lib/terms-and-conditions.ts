/** Proposal language transcribed from the client-supplied DOCX product templates. */
export const ROOFWORX_CONTRACTOR_INTRO =
  'ROOF WORX EXTERIORS, INC., an Illinois corporation, hereinafter ("CONTRACTOR") hereby proposes to furnish the materials and perform the labor necessary for the completion of the following work (the "WORK"):';

type ProductProposalTemplate = {
  scopeItems: readonly string[];
  numbered?: boolean;
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

  return template.scopeItems
    .map((item, index) => template.numbered === false ? item : `${index + 1}. ${item}`)
    .join(template.numbered === false ? "\n\n" : "\n");
}

export function stripLegacyTemplateOptions(description: string): string {
  return description.replace(/\r?\n\r?\nOPTIONS?:\r?\n(?:- [^\r\n]*(?:\r?\n|$))+$/, "");
}

export const ROOFWORX_STANDARD_TERMS_NOTICE =
  'The Work provided hereunder is subject to the Roof Worx Exteriors, Inc. Standard Terms and Conditions attached (the "Standard Terms and Conditions"). Customer hereby represents and warrants that Customer has reviewed and accepted the Standard Terms and Conditions prior to execution of this Contract. Customer may cancel the Signed Contract within three (3) business days from the Signed Contract Date through the execution of the Notice of Cancellation incorporated herein as Exhibit A attached hereto (the "Notice of Cancellation").';

export const ROOFWORX_STANDARD_TERMS_AND_CONDITIONS = `ROOF WORX EXTERIORS, INC.
STANDARD TERMS & CONDITIONS

1. PARTIES AND SCOPE OF WORK

These Standard Terms and Conditions (the “Standard Terms and Conditions”) are incorporated herein by reference to that certain Proposal executed by and between Customer and Contractor. The Proposal together with the Standard Terms and Conditions shall be referred to as the “Agreement”. In the event of any conflict between the terms and conditions of the Proposal and the Standard Terms and Conditions, the Standard Terms and Conditions shall prevail and dictate.

Roof Worx Exteriors, Inc., an Illinois corporation (hereafter called “Contractor”), shall mean the company performing the Work. “Work” means that specific services to be performed and materials provided by the Contractor as set forth on the Proposal executed by the Contractor and the Customer. “Customer” refers to the person(s) or business entity ordering the Work to be done by Contractor and shall be responsible for the payment thereof in accordance with Proposal. If the Customer is ordering the work on behalf of another, the Customer represents and warrants that the Customer is the duly authorized agent of said party for the purpose of ordering and directing said work. Unless otherwise stated in writing, the Customer assumes sole responsibility for determining whether the nature of the work ordered by the Customer is adequate and sufficient for the Customer’s intended purpose. In performing its Work, the Contractor shall be entitled to rely on the work of third parties, the representations of Customer and the public record and shall be under no obligation to verify any of the foregoing. The ordering of additional service and/or materials from Contractor beyond the scope of the Work shall constitute acceptance of the terms of these Standard Terms and Conditions as to such additional services and/or materials.

2. RIGHT OF ENTRY

The Customer shall provide rights of entry for Contractor and/or their representatives and necessary permissions in order for Contractor and/or their representative to complete its services.

3. CHANGES / COST ESCALATION

3.1 Unless otherwise specified in writing, the price for the work is based on the understanding that the deck and all structural members and other components are in fact in sound condition and capable of withstanding roof construction, equipment and operations. Contractor’s commencement of the Work indicates only that Contractor has visually inspected the surface of the roof deck for visible defects. If any conditions are encountered that are not currently visible, Customer agrees to pay Contractor additional compensation that may be necessary based upon Contractor’s normal rates and as agreed to in writing by both parties. Contractor is not responsible for the structural sufficiency, quality of construction (including compliance with Contractor’s criteria), undulations, fastening or moisture content of the roof deck or other trades’ work or design.

3.2 Any alteration or deviation from the scope of work involving extra costs will be executed only upon written agreement signed by both parties, and will become an extra charge over and above the estimate.

3.3 Customer agrees that Contractor has the right to substitute materials with equal or superior quality materials should the materials listed in the description of the work become unavailable for any reason. Contractor has the right to make such substitution without notice to or permission from the Customer. In the event of temporary material unavailability, the contract time shall be extended to reflect the duration of time that the Contractor is delayed by the unavailability. To the extent an available substitute is provided by Contractor under this provision, any increase in the cost between the originally specified material and equipment and the substitute shall be paid by the Customer to the Contractor, upon prior approval.

3.4 Any work required to replace rotten, missing or deteriorated, rusted or crumbling decking shall be done on a labor and material or unit price basis as an extra unless specifically included in the scope of Work. When re-roofing over an existing roof, replacement of visible wet or deteriorated insulation shall be an extra or billed at unit prices unless otherwise stated on the face of this Proposal. Unforeseen conditions that may affect the Work will be reported to Customer and authorization requested prior to permanent repairs being performed.

3.5 Roofing materials and equipment are sometimes subject to unusual price volatility due to conditions beyond the control or anticipation of Contractor. If there is an increase in the actual cost or shipping and receiving of materials or equipment between the date of this Proposal and the time when the Work is to be performed, the amount of the contract may be increased to reflect the additional cost to Contractor, upon submittal of written documentation.

4. SCHEDULING OF WORK

Contractor will not be responsible for damage done to Contractor’s work by others, including damage to temporary tie-ins. Any repairing of the same by Contractor will be charged as an extra. If the Contractor is required to delay commencement of the Work or if, upon embarking upon its Work, Contractor is required to stop or interrupt the progress of the Work as a result in changes in the scope of Work requested by the Customer, to fulfill the requirements of third parties, acts of God, accidents, pandemics, snow, fire, weather, vandalism, regulation, strikes, jurisdictional disputes, failure or delay of transportation, shortage of or inability to obtain materials, equipment or labor, or other interruptions in the progress of construction, or other causes beyond the direct control of Contractor, additional charges may be applicable and payable by the Customer and the approximate completion date of the Work shall be extended to take into account the period of delay. Contractor shall not be liable for any delay damages. Any delays caused by any event or events beyond the control of the Contractor do not constitute abandonment and are not included in calculating timeframes for payment or performance.

5. HOMEOWNER / CUSTOMER ADVISORY

Most roofing, siding & exterior renovation jobs may involve major demolition of materials and minor disturbances may occur. Contractor shall not be held responsible for any interior damages and advises the Customer to remove all wall hangings, light glass fixtures, and other fragile items prior to start of Work. Any items in attic should be covered for protection from falling debris and dust. Contractor shall not be responsible for interior drywall cracks, nail pops or any damage to any items on the interior or the exterior of the home or work site including damage to shrubbery, outside plants, landscaping, yard furniture, decking, sprinkler systems, or driveways during the process of the work. Upon request from the Customer, the contractor will assist in covering or removing these items. Upon completion of the Work all debris associated with the work will be removed. Contractor will re-install any roof mounted antennas or satellite dishes unless otherwise directed by Customer. Contractor will not be responsible for proper alignment or reception of same.

6. TERMINATION

6.1 If Customer fails to fulfill in a timely and proper manner their obligations under the agreement, then in such instance, the Contractor shall have the right to terminate the agreement between Contractor and Customer by written notice of termination, specifying the effective date thereof, at least two (2) business days before effective date, in which event the Customer shall be obligated to immediately pay the Contractor compensation based on the Contractor’s normal rates for any Work completed prior to the effective date of termination, including charges for both labor performed and materials purchased by Contractor prior to such date, in addition to the Contractors overhead and profit on the portion of the work which remains uncompleted as of the cancellation date.

6.2 Customer shall have the right to cancel or terminate the Proposal only in accordance with the terms of the Proposal and through the execution of the Notice of Cancellation.

7. WARRANTY

THE WORK WILL BE PERFORMED IN ACCORDANCE WITH THIS AGREEMENT, ALL REQUIRED BUILDING CODES, INSPECTIONS, THESE TERMS AND CONDITIONS, AND GENERALLY ACCEPTED PRACTICES. ALL BUILDING & ZONING PERMITS, INSPECTIONS AND COSTS IF REQUIRED ARE THE RESPONSIBILITY OF THE CUSTOMER UNLESS SPECIFICALLY NOTED OTHERWISE IN THIS AGREEMENT.

NO WARRANTY IS PROVIDED HEREUNDER WITH THE EXCEPTION OF THE CONTRACTOR’S TEN YEAR WORKMANSHIP WARRANTY AND THE LIMITED LIFETIME WARRANTY PROVIDED BY THE MANUFACTURER OF THE ROOFING MATERIALS, IF ANY. CONTRACTOR HEREBY FOREVER DISCLAIMS ANY AND ALL IMPLIED WARRANTIES OF ANY KIND INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, ALL OF WHICH ARE EXPRESSLY EXCLUDED. ALL MANUFACTURER’S WARRANTIES ARE VOID IF UNAUTHORIZED SERVICE, ALTERATIONS OR ADJUSTMENTS HAVE BEEN MADE TO ANY OF THE WORK. IT IS EXPRESSLY AGREED THAT IN THE EVENT OF ALLEGED DEFECTS IN THE MATERIALS FURNISHED PURSUANT TO THIS CONTRACT, CUSTOMER SHALL HAVE RECOURSE ONLY AGAINST THE MANUFACTURER OF SUCH MATERIAL.

8. PAYMENTS

8.1 All final payments are due in full upon substantial completion / invoice date unless other arrangements are made in writing, agreed to, and signed by both the contractor and Customer. If payments due under this agreement are not paid in full within thirty (30) days of the date such payments are due, Contractor reserves the right to pursue all appropriate remedies, including stopping work with two (2) days prior written notice.

8.2 If at any time an invoice remains unpaid for a period in excess of thirty (30) days, a service charge of one and on half percent (1-1/2%) per month from the date of original invoice, an effective maximum rate of eighteen percent (18%) per annum, will be charged on past due accounts.

8.3 Timely payment of amounts due under this agreement is a condition of this agreement. Failure to make payments in full within the time limits stated above will be considered substantial non-compliance with the terms of this agreement and will be cause for termination of this agreement if Contractor so chooses.

8.4 In the event a lien or suit is filed by Contractor to collect any amounts owed under this agreement, Customer agrees to pay Contractor reasonable attorney’s fees, plus all costs and other expenses incurred by Contractor in connection with such lien or suit. All disputes arising between Contractor and Customer relating in whole or in part to the Work shall be resolved exclusively in the Circuit Court of Kane County, Illinois applying the substantive and procedural laws of the State of Illinois. All parties agree to waiver of trial by jury.

9. LIMITATION OF LIABILITY

9.1 CONTRACTOR SHALL NOT BE LIABLE FOR DAMAGES OF ANY KIND WHICH RESULT IN WHOLE OR IN PART FROM FIRE, FLOOD, STRIKE, THIRD PARTIES, ACTS OF GOD, ACTS OF TERRORISM, OR BY ANY OTHER CIRCUMSTANCES WHICH ARE BEYOND THE CONTROL OF THE CONTRACTOR INCLUDING BUT NOT LIMITED TO SEVERE WEATHER.

9.2 CONTRACTOR’S LIABILITY FOR DAMAGES OF ANY KIND DUE TO BREACH OF WARRANTY, CONTRACT, ERROR, OMISSION OR NEGLIGENCE OR ANY TORT SHALL BE LIMITED TO A MAXIMUM OF THE TOTAL AMOUNT PAID TO CONTRACTOR UNDER THIS AGREEMENT. UNDER NO CIRCUMSTANCES SHALL CONTRACTOR BE LIABLE FOR SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES OF ANY KIND.

9.3 ANY CLAIMS AGAINST CONTRACTOR BROUGHT ALLEGING A BREACH BY CONTRACTOR OF THE TERMS OF THIS AGREEMENT OR IN ANY WAY ARISING OUT OF THIS AGREEMENT MUST BE FILED WITHIN ONE YEAR FROM THE TIME THE CAUSE OF ACTION ACCRUED OR IT SHALL BE TIME BARRED.

9.4 UNDER NO CIRCUMSTANCES SHALL ANY EMPLOYEE, STOCKHOLDER, OFFICER OR AGENT OF CONTRACTOR HAVE ANY INDIVIDUAL LIABILITY TO THE CUSTOMER, NOTWITHSTANDING THE AFORESAID, IN THE EVENT ANY JUDGMENT IS ENTERED AGAINST ANY SUCH INDIVIDUAL, CUSTOMER AGREES TO LOOK EXCLUSIVELY TO THE ASSETS OF CONTRACTOR FOR SATISFACTION OF SAID JUDGMENT.

10. INSURANCE

Contractor to carry Workmen’s compensation and Public Liability Insurance on above work. Customer to carry fire, builder’s risk and general liability insurance. With respect to Customer’s general liability insurance, the Customer shall name the Contractor as an additionally named insured thereunder in a primary and non-contributory basis and by separate endorsement prior to granting access to the Contractor to perform the Work.

11. SEVERABILITY

In the event that any provisions herein shall be deemed invalid or unenforceable, the other provisions hereof shall remain in full force and effect and binding upon the parties hereto.

12. ENTIRE AGREEMENT

This contract constitutes the entire understanding of the parties and no other understanding, collateral or otherwise, shall be binding unless in writing and signed by all parties hereto.

13. MOLD DISCLAIMER

This contract does not include, unless explicitly specified, any mold abatement, removal, or cleaning. If mold is found existing on the premises, any cost to abate, remove, or clean shall be paid by Customer as an extra. In addition, any warranty given to you under this contract does NOT include the cost to abate, remove, or clean mold that may be found on the premises in the future.

14. ASBESTOS AND TOXIC MATERIALS.

This Proposal is based on Contractor’s not coming into contact with asbestos-containing or toxic materials (“ACM”). Contractor is not responsible for expenses, claims or damages arising out of the presence, disturbance or removal of ACM. Contractor shall be compensated for additional expenses resulting from the presence of ACM. Customer agrees to indemnify Contractor from and against any liability, damages, losses, claims, demands or citations arising out of the presence of ACM.

15. INDEMNIFICATION.

Customer hereby agrees to defend, indemnify, hold harmless and reimburse Contractor, its shareholders, officers, directors and employees, agents, and subcontractors, from and against all claims, suits, actions, proceedings, damages, losses and expenses, including attorneys' fees, arising in whole in part out of, related to, or resulting, in whole or in part from: (a) any breach of any term or condition of this Agreement by the Customer; (b) any negligent or willful act or omission by the Customer, or its agents, employees, guests or invitees in connection with the performance of the Work; (c) any litigation, proceeding or claim by any third party relating in whole or in part to the obligations of Contractor under the Agreement; (d) any alleged violation of law by Customer; (e) any personal injury or property damage to Customer or to any third party resulting in whole or in part from the Work performed at the Customer’s property.`;

export const ROOFWORX_PAYMENT_TERMS =
  "A 50% DEPOSIT IS DUE UPON EXECUTION OF THIS AGREEMENT. THE REMAINING BALANCE IS DUE UPON COMPLETION OF THE WORK.";

export const ROOFWORX_ACCEPTANCE_TEXT =
  "The above Contract Price and other prices, specifications, and conditions are satisfactory and are hereby accepted. You are authorized to perform the Work as specified. Payment will be made as outlined above.";

export const ROOFWORX_CANCELLATION_NOTICE =
  "YOU, THE CUSTOMER, MAY CANCEL THIS CONTRACT AT ANY TIME PRIOR TO MIDNIGHT OF THE THIRD (3rd) BUSINESS DAY AFTER THE DATE OF EXECUTION. SEE THE ATTACHED NOTICE OF CANCELLATION FORM AS EXPLANATION OF THIS RIGHT.";

function formatTerms(proposalExpiration: string, proposalNote: string): string {
  return [
    `Proposal Expiration: ${proposalExpiration}`,
    `NOTE: ${proposalNote}`,
    ROOFWORX_STANDARD_TERMS_AND_CONDITIONS,
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
