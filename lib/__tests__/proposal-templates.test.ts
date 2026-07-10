import assert from "node:assert/strict";
import test from "node:test";
import {
  getProductProposalTerms,
  getProductTemplateDescription,
} from "../terms-and-conditions.ts";

test("maps each supplied product code to its own DOCX template", () => {
  assert.match(getProductTemplateDescription("1 - CT T-Off")!, /CertainTeed 4-Star/);
  assert.match(getProductTemplateDescription("1.1 - CT T-Off - Insurance")!, /insurance deductible/);
  assert.match(getProductTemplateDescription("1.2 CT GARAGE T-off")!, /entire garage/);
  assert.match(getProductTemplateDescription("1.25 - CT GARAGET-Off - Insurance")!, /adjustor summary sheet/);
  assert.match(getProductTemplateDescription("2 GAF T-Off")!, /Timberline HDZ/);
  assert.match(getProductTemplateDescription("2.1 - GAF T-Off - Insurance")!, /Supplement requested/);
  assert.match(getProductTemplateDescription("2.2 - GAF GARAGE T-Off")!, /GAF FeltBuster/);
  assert.match(getProductTemplateDescription("2.25 - GAF GARAGE T-Off - Insurance")!, /insurance company/);
  assert.match(getProductTemplateDescription("3 - Flat Roof Membrane")!, /Flintlastic cap sheet/);
  assert.match(getProductTemplateDescription("3.5 - Flat Roof EPDM")!, /fully adheard/);
  assert.match(getProductTemplateDescription("4 - Skylights")!, /^1\..*\n4\. where old one was removed\./s);
  assert.match(getProductTemplateDescription("10- Siding")!, /house wrap on complete house/);
  assert.match(getProductTemplateDescription("11 - CT New Construction")!, /Inspect complete roof deck/);
  assert.match(getProductTemplateDescription("12 - GAF New Construction")!, /GAF Snow Country/);
  assert.match(getProductTemplateDescription("13 - 60Mil TPO")!, /TPO 60 mil roofing system/);
  const elevations = getProductTemplateDescription("14 - Insurance Elevations")!;
  assert.match(elevations, /FRONT ELEVATION/);
  assert.doesNotMatch(elevations, /^1\.|TPO 60 mil/);
  assert.equal(getProductTemplateDescription("Shingles"), undefined);
  assert.match(getProductProposalTerms("1.2 - CT Garage T-Off").proposalExpiration, /thirty \(30\) days/);
  assert.doesNotMatch(getProductProposalTerms("10 - Siding").proposalNote, /removal of/);
  assert.doesNotMatch(getProductProposalTerms("11 - CT New Construction").proposalNote, /removal of one/);
  assert.match(getProductProposalTerms("13 - 60Mil TPO").proposalNote, /two \(2\) layers/);
  assert.match(getProductProposalTerms("14 - Insurance Elevations").proposalNote, /up to one \(1\) layer/);
  assert.match(getProductTemplateDescription("15 - LP Smartside Siding")!, /COLOR: LINEN/);
  assert.doesNotMatch(getProductProposalTerms("2.2 - GAF Garage T-Off").proposalNote, /roof-to-wall/);
  assert.match(getProductProposalTerms("3 - Flat Roof Membrane").proposalNote, /up to one \(1\) layer/);
  assert.match(getProductProposalTerms("3.5 - Flat Roof EPDM").proposalNote, /up to two \(2\) layers/);
  assert.match(getProductProposalTerms("4 - Skylights").proposalExpiration, /industry, we/);
  assert.doesNotMatch(getProductProposalTerms("15 - LP Smartside Siding").proposalNote, /removal of/);
});
