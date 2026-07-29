import { NextRequest, NextResponse } from "next/server";
import { getProposalData } from "@/lib/mock-data";
import {
  buildProposalEmailHtml,
  getChecklistUrl,
  officeReplyTo,
  officeTo,
  sendProposalMail,
  uploadPdfForMailAttachment,
} from "@/lib/proposal-mail";
import { parsePdfDataUri } from "@/lib/pdf-data-uri";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const quoteId = formData.get("quoteId") as string;
    const dealId = formData.get("dealId") as string;
    const signatureBase64 = formData.get("signature") as string;
    const executedPdfDataUri = formData.get("executedPdf") as string | null;

    if (!quoteId || !dealId) {
      return NextResponse.json(
        { success: false, error: "Missing quoteId or dealId" },
        { status: 400 }
      );
    }

    if (formData.get("agreementAccepted") !== "true") {
      return NextResponse.json(
        { success: false, error: "Terms and deposit acknowledgment are required." },
        { status: 400 }
      );
    }

    const pdfBuffer = parsePdfDataUri(executedPdfDataUri);
    if (!pdfBuffer) {
      return NextResponse.json(
        { success: false, error: "A valid signed proposal PDF is required." },
        { status: 400 }
      );
    }

    console.log(`✅ Approving quote ${quoteId} for deal ${dealId}`);

    try {
      await zohoClient.updateRecord("New_Quotes", quoteId, {
        Quote_Status: "Accepted",
        Approval_Date: new Date().toISOString().split("T")[0],
      });

      if (signatureBase64) {
        const sigBuffer = Buffer.from(signatureBase64.split(",")[1], "base64");
        await zohoClient.uploadAttachment("New_Quotes", quoteId, sigBuffer, `Signature-${Date.now()}.jpg`);
        console.log("💾 Signature attached to record");
      }

      const selectedOptionalsStr = formData.get("selectedOptionals") as string;
      if (selectedOptionalsStr) {
        const selectedIds = JSON.parse(selectedOptionalsStr) as string[];
        for (const itemId of selectedIds) {
          if (itemId && !itemId.startsWith("new-")) {
            await zohoClient.updateRecord("Product_X_Quotes", itemId, {
              Purchase_Option: "Accepted",
            });
          }
        }
      }

      const pdfFileName = `Signed-Proposal-${quoteId}.pdf`;
      await zohoClient.uploadAttachment("New_Quotes", quoteId, pdfBuffer, pdfFileName);
      const pdfAttachmentId =
        (await uploadPdfForMailAttachment(pdfBuffer, pdfFileName)) ?? undefined;

      const context = await getProposalData(dealId, quoteId);
      if (context) {
        try {
          const { jobMeta, proposal } = context;
          const mailContextModule = jobMeta.recipientModule;
          const mailContextRecordId = jobMeta.recipientId;
          const checklistUrl = getChecklistUrl(jobMeta.dealId);

          const teamBody = [
            "Hi Team,",
            "",
            `${jobMeta.contactName} has approved proposal #${jobMeta.proposalNumber} for ${jobMeta.propertyAddress}.`,
            "",
            `Assigned rep: ${jobMeta.salesperson}`,
            `Account: ${jobMeta.accountName}`,
            `Proposal: ${proposal.title}`,
          ].join("\n");

          await sendProposalMail({
            module: mailContextModule,
            recordId: mailContextRecordId,
            to: officeTo(),
            subject: `Proposal Accepted — ${jobMeta.propertyAddress}`,
            htmlContent: buildProposalEmailHtml(teamBody),
            replyTo: { user_name: jobMeta.contactName, email: jobMeta.contactEmail },
          });

          if (jobMeta.contactEmail?.trim()) {
            const clientLines = [
              `Hi ${jobMeta.contactName},`,
              "",
              "Thank you for approving your RoofWorx Exteriors proposal. We are excited to move forward with your project.",
              "",
              "Your executed agreement is attached to this email for your records.",
            ];

            if (checklistUrl) {
              clientLines.push("", "Next step: complete your project checklist using the link below.");
            } else {
              clientLines.push("", "Our team will reach out shortly with next steps for your project.");
            }

            clientLines.push("", "If you have any questions, reply to this email and our office team will assist you.");

            await sendProposalMail({
              module: mailContextModule,
              recordId: mailContextRecordId,
              to: [{ user_name: jobMeta.contactName, email: jobMeta.contactEmail }],
              subject: `Thank You — Proposal Approved for ${jobMeta.propertyAddress}`,
              htmlContent: buildProposalEmailHtml(
                clientLines.join("\n"),
                checklistUrl
                  ? { ctaLabel: "Open Project Checklist", ctaUrl: checklistUrl }
                  : undefined
              ),
              replyTo: officeReplyTo(),
              attachmentFileIds: pdfAttachmentId ? [pdfAttachmentId] : undefined,
            });
          }
        } catch (mailError) {
          console.error("⚠️ Post-approval emails failed (approval still saved):", mailError);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Proposal approved.",
        quoteId,
      });
    } catch (zohoError: unknown) {
      console.error("❌ Zoho Update Error:", zohoError);
      return NextResponse.json(
        { success: false, error: "Could not sync approval to CRM. Please contact your representative." },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("❌ Approval API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
