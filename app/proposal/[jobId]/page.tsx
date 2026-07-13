import { getProposalData } from "@/lib/mock-data";
import { ProposalPageClient } from "@/components/proposal/ProposalPageClient";

// This page accepts a jobId from the URL — matches the Zoho CRM job ticket pattern.
// When real API integration is added, replace `getProposalData` with actual fetch calls.
export default async function ProposalPage(props: PageProps<"/proposal/[jobId]">) {
  const { jobId } = await props.params;
  const searchParams = await props.searchParams;
  const quoteId = searchParams?.quoteId as string;
  const isNew = searchParams?.mode === "new";

  const data = await getProposalData(jobId, quoteId, isNew);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Deal Not Found</h1>
        <p className="text-muted-foreground">We couldn't find a Zoho CRM record for Job ID: {jobId}</p>
        <a href="/" className="text-primary hover:underline">Return to Dashboard</a>
      </div>
    );
  }

  const { jobMeta, proposal, catalog, existingProposals } = data;

  return (
    <ProposalPageClient
      jobId={jobId}
      initialProposal={proposal}
      jobMeta={jobMeta}
      catalog={catalog}
      existingProposals={existingProposals}
    />
  );
}

export async function generateMetadata(props: PageProps<"/proposal/[jobId]">) {
  const { jobId } = await props.params;
  return {
    title: `Proposal ${jobId} | RoofWorx`,
    description: "Create and manage RoofWorx project proposals",
  };
}
