import { redirect } from "next/navigation";

// Root page: redirect to a sample proposal for development.
// In production, the URL will always include a jobId from Zoho CRM.
export default function RootPage() {
  redirect("/proposal/261075");
}
