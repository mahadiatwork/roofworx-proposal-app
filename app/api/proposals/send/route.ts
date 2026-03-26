import { NextRequest, NextResponse } from "next/server";
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
      recipientId
    } = body;

    // 1. Validation
    if (!quoteId || !jobId || !toEmail || !subject || !emailBody || !proposalUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`📧 Official Send Mail (v8) for quote ${quoteId} to ${toEmail}`);

    // 2. Resolve final recipient context
    const finalModule = recipientModule || "Deals";
    const finalRecipientId = recipientId || jobId;

    // 3. Build Zoho v8 Send Mail payload
    // Note: The 'from' email must usually be a confirmed address in Zoho CRM or a user's primary email.
    // For this implementation, we allow the request to use the system default org email logic if needed.
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #111;">
        <div style="white-space: pre-wrap; margin-bottom: 32px;">${emailBody}</div>
        
        <div style="margin-bottom: 32px;">
          <a href="${proposalUrl}" style="background-color: #2D6A4F; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: 700; font-size: 16px;">
            View Your Digital Proposal
          </a>
        </div>
        
        <div style="font-size: 12px; color: #9CA3AF; padding-top: 24px; border-top: 1px solid #F3F4F6;">
          If you're having trouble with the button above, copy and paste this URL into your browser:<br/>
          <a href="${proposalUrl}" style="color: #2D6A4F;">${proposalUrl}</a>
        </div>
      </div>
    `;

    const zohoPayload = {
      data: [
        {
          from: {
             user_name: "Ashley Biggs",
             email: "abiggs@roofworxext.com" 
          },
          to: [
            {
              email: toEmail,
            },
          ],
          subject: subject,
          content: htmlContent,
          org_email: false, 
        },
      ],
    };

    // 4. Update the quote status in Zoho CRM to 'Sent' BEFORE attempting send
    // (Or after, but plan says after successful mail result)
    // We execute the mail call first.
    try {
      const mailResult = await zohoClient.sendMail(finalModule, finalRecipientId, zohoPayload);
      console.log(`✅ Zoho v8 Success Response:`, JSON.stringify(mailResult));

      // 5. Update Status
      await zohoClient.updateRecord("New_Quotes", quoteId, {
        Quote_Status: "Sent",
      });

      return NextResponse.json({
        success: true,
        quoteId,
        sentAt: new Date().toISOString(),
        recipient: toEmail
      });

    } catch (zohoError: any) {
      console.error("❌ Zoho Send Mail API Failed:", zohoError.response?.data || zohoError.message);
      return NextResponse.json(
        { 
          success: false, 
          error: "Zoho CRM Mail API rejected this request. Please ensure the recipient email is valid and your Zoho Mail integration is active.",
          details: zohoError.response?.data
        },
        { status: 502 }
      );
    }

  } catch (error: any) {
    console.error("❌ Internal Proposal Send API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
