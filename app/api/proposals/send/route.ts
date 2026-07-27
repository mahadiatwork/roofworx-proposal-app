import { NextRequest, NextResponse } from "next/server";
import {
  buildProposalEmailHtml,
  officeReplyTo,
  sendProposalMail,
} from "@/lib/proposal-mail";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      quoteId,
      jobId,
      toEmail,
      subject,
      body: emailBody,
      proposalUrl,
      recipientModule,
      recipientId,
    } = body;

    if (!quoteId || !jobId || !toEmail || !subject || !emailBody || !proposalUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`📧 Official Send Mail (v8) for quote ${quoteId} to ${toEmail}`);

    const finalModule = recipientModule || "Deals";
    const finalRecipientId = recipientId || jobId;

    const htmlContent = buildProposalEmailHtml(emailBody, {
      ctaLabel: "View Your Proposal",
      ctaUrl: proposalUrl,
    });

    try {
      const sendResult = await sendProposalMail({
        module: finalModule,
        recordId: finalRecipientId,
        to: [{ email: toEmail }],
        subject,
        htmlContent,
        replyTo: officeReplyTo(),
      });

      await zohoClient.updateRecord("New_Quotes", quoteId, {
        Quote_Status: "Sent",
      });

      return NextResponse.json({
        success: true,
        quoteId,
        sentAt: new Date().toISOString(),
        recipient: toEmail,
        messageId: sendResult.details?.message_id,
      });
    } catch (zohoError: unknown) {
      const message =
        zohoError instanceof Error ? zohoError.message : "Zoho CRM Mail API rejected this request.";
      // Log only the message; the full axios error carries the OAuth token in its headers.
      console.error("❌ Zoho Send Mail API Failed:", message);
      return NextResponse.json(
        {
          success: false,
          error:
            "Zoho CRM Mail API rejected this request. Please ensure the recipient email is valid and your Zoho Mail integration is active.",
          details: message,
        },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("❌ Internal Proposal Send API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
