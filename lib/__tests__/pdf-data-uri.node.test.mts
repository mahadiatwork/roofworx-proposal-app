import assert from "node:assert/strict";
import test from "node:test";
import { jsPDF } from "jspdf";
import { parsePdfDataUri } from "../pdf-data-uri.ts";

test("accepts jsPDF data URIs with filename metadata and rejects non-PDF data", () => {
  const pdf = parsePdfDataUri(new jsPDF().output("datauristring"));

  assert.equal(pdf?.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.equal(parsePdfDataUri("data:application/pdf;base64,bm90IGEgcGRm"), null);
});
