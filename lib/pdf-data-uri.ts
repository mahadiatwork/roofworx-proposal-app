export function parsePdfDataUri(value: unknown): Buffer | null {
  if (typeof value !== "string") return null;

  const [header, base64, ...extra] = value.trim().split(",");
  if (
    extra.length ||
    !/^data:application\/pdf(?:;[^,]*)*;base64$/i.test(header) ||
    !base64 ||
    base64.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)
  ) {
    return null;
  }

  const pdf = Buffer.from(base64, "base64");
  return pdf.subarray(0, 5).toString("ascii") === "%PDF-" ? pdf : null;
}
