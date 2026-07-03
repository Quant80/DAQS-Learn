import { NextRequest } from "next/server";

export interface ConsultingEnquiry {
  orgName: string;
  orgType: "school" | "university" | "corporate" | "government" | "ngo" | "other";
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  learnerCount: string;
  requirements: string;
  budget?: string;
  timeline?: string;
}

export async function POST(req: NextRequest) {
  const body: ConsultingEnquiry = await req.json();

  if (!body.orgName || !body.contactEmail || !body.requirements) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Send email notification via Resend (or fallback to console log)
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFY_EMAIL = process.env.CONSULTING_NOTIFY_EMAIL ?? "trymorencubecon@gmail.com";

  const emailHtml = `
    <h2>New Consulting Enquiry — DAQS Learn</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Organisation</td><td style="padding:8px;border:1px solid #ddd;">${body.orgName}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Type</td><td style="padding:8px;border:1px solid #ddd;">${body.orgType}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Contact</td><td style="padding:8px;border:1px solid #ddd;">${body.contactName}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Email</td><td style="padding:8px;border:1px solid #ddd;">${body.contactEmail}</td></tr>
      ${body.contactPhone ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${body.contactPhone}</td></tr>` : ""}
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Learners</td><td style="padding:8px;border:1px solid #ddd;">${body.learnerCount}</td></tr>
      ${body.budget ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Budget</td><td style="padding:8px;border:1px solid #ddd;">${body.budget}</td></tr>` : ""}
      ${body.timeline ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Timeline</td><td style="padding:8px;border:1px solid #ddd;">${body.timeline}</td></tr>` : ""}
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;vertical-align:top;">Requirements</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap;">${body.requirements}</td></tr>
    </table>
    <p style="margin-top:16px;font-size:12px;color:#666;">Submitted via DAQS Learn consulting enquiry form.</p>
  `;

  if (RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DAQS Learn <noreply@daqstech.com>",
          to: [NOTIFY_EMAIL],
          reply_to: body.contactEmail,
          subject: `New Consulting Enquiry: ${body.orgName} (${body.orgType})`,
          html: emailHtml,
        }),
      });
    } catch (e) {
      console.error("Failed to send enquiry email:", e);
    }
  } else {
    // No email provider — just log for now
    console.log("Consulting enquiry received:", JSON.stringify(body, null, 2));
  }

  // Store in a simple JSON log (replace with DB in production)
  const enquiry = {
    id: `ENQ-${Date.now()}`,
    ...body,
    submittedAt: new Date().toISOString(),
    status: "new",
  };

  return Response.json({ success: true, enquiryId: enquiry.id });
}
