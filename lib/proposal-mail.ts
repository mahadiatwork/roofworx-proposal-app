import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export const OFFICE_EMAIL = "office@roofworx.com";
export const OFFICE_NAME = "Roof Worx Office";

export const PROPOSAL_FROM = {
  user_name: process.env.PROPOSAL_FROM_NAME || "Roof Worx Exteriors",
  email: process.env.PROPOSAL_FROM_EMAIL || OFFICE_EMAIL,
};

type ZohoSendMailResult = {
  status?: string;
  message?: string;
  details?: { message_id?: string };
};

type ZohoSendMailResponse = {
  data?: ZohoSendMailResult[];
};

export type ProposalMailRecipient = {
  user_name?: string;
  email: string;
};

export type SendProposalMailOptions = {
  module: string;
  recordId: string;
  to: ProposalMailRecipient[];
  subject: string;
  htmlContent: string;
  cc?: ProposalMailRecipient[];
  replyTo?: ProposalMailRecipient;
  attachmentFileIds?: string[];
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function officeReplyTo(): ProposalMailRecipient {
  return { user_name: OFFICE_NAME, email: OFFICE_EMAIL };
}

export function officeCc(): ProposalMailRecipient[] {
  return [{ user_name: OFFICE_NAME, email: OFFICE_EMAIL }];
}

export function officeTo(): ProposalMailRecipient[] {
  return officeCc();
}

export function getChecklistUrl(dealId: string): string | null {
  const base = process.env.CHECKLIST_BASE_URL?.trim();
  if (!base) return null;
  return base.includes("{dealId}")
    ? base.replace("{dealId}", dealId)
    : `${base.replace(/\/$/, "")}/${dealId}`;
}

export function buildProposalEmailHtml(body: string, extras?: { ctaLabel?: string; ctaUrl?: string }) {
  const safeBody = escapeHtml(body);
  const ctaBlock =
    extras?.ctaUrl && extras?.ctaLabel
      ? `
        <div style="margin-bottom: 32px;">
          <a href="${escapeHtml(extras.ctaUrl)}" style="background-color: #2D6A4F; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: 700; font-size: 16px;">
            ${escapeHtml(extras.ctaLabel)}
          </a>
        </div>
      `
      : "";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #111;">
      <div style="white-space: pre-wrap; margin-bottom: 32px;">${safeBody}</div>
      ${ctaBlock}
    </div>
  `;
}

export async function sendProposalMail(options: SendProposalMailOptions) {
  const payload = {
    data: [
      {
        from: PROPOSAL_FROM,
        to: options.to,
        ...(options.cc?.length ? { cc: options.cc } : {}),
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
        ...(options.attachmentFileIds?.length
          ? { attachments: options.attachmentFileIds.map((id) => ({ id })) }
          : {}),
        subject: options.subject,
        content: options.htmlContent,
        mail_format: "html",
        org_email: false,
      },
    ],
  };

  const mailResult = (await zohoClient.sendMail(
    options.module,
    options.recordId,
    payload
  )) as ZohoSendMailResponse;

  const sendResult = mailResult.data?.[0];
  if (sendResult?.status !== "success") {
    throw new Error(sendResult?.message || "Zoho CRM did not confirm that the email was sent.");
  }

  return sendResult;
}

export async function uploadPdfForMailAttachment(pdfBuffer: Buffer, fileName: string) {
  return zohoClient.uploadFileToZfs(pdfBuffer, fileName);
}
