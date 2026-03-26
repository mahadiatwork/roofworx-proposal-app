import { getProposalData } from "@/lib/mock-data";
import { ProposalPreviewClient } from "@/components/proposal/ProposalPreviewClient";

export default async function ClientPreviewPage(props: PageProps<"/p/[jobId]">) {
  const { jobId } = await props.params;
  const searchParams = await props.searchParams;
  const quoteId = searchParams?.quoteId as string;
  const data = await getProposalData(jobId, quoteId);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Proposal Expired or Missing</h1>
        <p className="text-muted-foreground">We couldn't find a record for ID: {jobId}</p>
        <p className="text-sm">Please contact your RoofWorx representative.</p>
      </div>
    );
  }

  const { jobMeta, proposal } = data;

  return (
    <ProposalPreviewClient
      proposal={proposal}
      jobMeta={jobMeta}
    />
  );
}
