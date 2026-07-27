import { NextRequest, NextResponse } from "next/server";
import { getProposalData } from "@/lib/mock-data";
import { buildProposalEmailHtml, officeTo, sendProposalMail } from "@/lib/proposal-mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quoteId, dealId, message } = body as {
      quoteId?: string;
      dealId?: string;
      message?: string;
    };

    if (!quoteId || !dealId) {
      return NextResponse.json(
        { success: false, error: "Missing quoteId or dealId" },
        { status: 400 }
      );
    }

    const context = await getProposalData(dealId, quoteId);
    if (!context) {
      return NextResponse.json(
        { success: false, error: "Proposal not found." },
        { status: 404 }
      );
    }

    const { jobMeta, proposal } = context;

    const appBase =
      process.env.NEXT_PUBLIC_APP_BASE_URL?.replace(/\/$/, "") ||
      "https://roofworx-proposal-app.vercel.app";
    const proposalUrl = `${appBase}/p/${dealId}?quoteId=${quoteId}`;

    const questionBody = [
      "Hi Team,",
      "",
      `${jobMeta.contactName} has questions about proposal #${jobMeta.proposalNumber} for ${jobMeta.propertyAddress}.`,
      "",
      `Assigned rep: ${jobMeta.salesperson}`,
      `Account: ${jobMeta.accountName}`,
      `Proposal: ${proposal.title}`,
      `Client email: ${jobMeta.contactEmail}`,
      message?.trim() ? `\nClient message:\n${message.trim()}` : "",
      `\nView proposal: ${proposalUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendProposalMail({
      module: jobMeta.recipientModule,
      recordId: jobMeta.recipientId,
      to: officeTo(),
      subject: `Client Questions — ${jobMeta.propertyAddress}`,
      htmlContent: buildProposalEmailHtml(questionBody, {
        ctaLabel: "View Proposal",
        ctaUrl: proposalUrl,
      }),
      replyTo: { user_name: jobMeta.contactName, email: jobMeta.contactEmail },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("❌ Questions API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send question notification.",
      },
      { status: 502 }
    );
  }
}
