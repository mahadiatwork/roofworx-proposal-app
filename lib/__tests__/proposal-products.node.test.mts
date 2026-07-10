import assert from "node:assert/strict";
import test from "node:test";
import { parseProposalItems } from "../proposal-products.ts";

const product = (id: string) => ({
  zohoProductId: id,
  price: 1,
  description: "Scope",
  optional: false,
});

test("proposal product validation preserves zero or one and exposes two for rejection", () => {
  assert.equal(parseProposalItems({ sections: [] })?.productItems.length, 0);
  assert.equal(parseProposalItems({ sections: [{ lineItems: [product("one")] }] })?.productItems.length, 1);
  assert.equal(
    parseProposalItems({ sections: [{ lineItems: [product("one"), product("two")] }] })?.productItems.length,
    2
  );
  assert.equal(parseProposalItems({ sections: [{ lineItems: "bad" }] }), null);
});
