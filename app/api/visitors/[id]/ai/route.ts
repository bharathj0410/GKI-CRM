import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { action, visitorData } = body

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    let prompt = ""

    if (action === "summarize") {
      prompt = `You are a professional factory security officer. Summarize the following factory visitor record in 3-4 concise, professional sentences. Focus on the visitor's identity, purpose, arrival/departure, and any noteworthy security details.

Visitor Data:
Name: ${visitorData.fullName}
Company: ${visitorData.company || "N/A"}
Type: ${visitorData.visitorType}
Purpose: ${visitorData.purposeOfVisit}
Meeting With: ${visitorData.meetingWith || "N/A"}
Location: ${visitorData.visitLocation || "N/A"}
Check-In: ${visitorData.checkIn ? new Date(visitorData.checkIn).toLocaleString() : "N/A"}
Check-Out: ${visitorData.checkOut ? new Date(visitorData.checkOut).toLocaleString() : "Still inside"}
Status: ${visitorData.status}
ID Provided: ${visitorData.providedIDProofs?.join(", ") || "None"}
Materials: ${visitorData.materialsCarriedIn?.join(", ") || "None"}
Vehicle: ${visitorData.hasVehicle ? `${visitorData.vehicleType} - ${visitorData.vehicleNumber}` : "None"}
Safety Briefing: ${visitorData.safetyBriefingGiven ? "Given" : "Not given"}
NDA Signed: ${visitorData.ndaSigned ? "Yes" : "No"}

Write a professional visit summary:`
    } else if (action === "flag") {
      prompt = `You are a factory security analyst. Analyze this visitor record for potential security anomalies or compliance issues. List any flags as bullet points with brief explanations. Be concise and professional.

Visitor Data:
Name: ${visitorData.fullName}
Type: ${visitorData.visitorType}
Purpose: ${visitorData.purposeOfVisit}
Check-In: ${visitorData.checkIn ? new Date(visitorData.checkIn).toLocaleString() : "N/A"}
Check-Out: ${visitorData.checkOut ? new Date(visitorData.checkOut).toLocaleString() : "Still inside"}
ID Provided: ${visitorData.providedIDProofs?.join(", ") || "None"}
Materials Carried In: ${visitorData.materialsCarriedIn?.join(", ") || "None"}
Visit Location: ${visitorData.visitLocation || "Not specified"}
Safety Briefing: ${visitorData.safetyBriefingGiven ? "Given" : "Not given"}
NDA Signed: ${visitorData.ndaSigned ? "Yes" : "No"}
Gate Pass: ${visitorData.gatePassNumber || "None"}
Security Guard: ${visitorData.securityGuard || "Not recorded"}

Security flags and anomalies:`
    } else if (action === "email") {
      prompt = `You are a professional factory manager at Gurukrupa Industries. Draft a polite, concise follow-up email to the visitor below. The email should thank them for their visit, reference the purpose, and invite future contact if relevant. Keep it under 150 words.

Visitor: ${visitorData.fullName}
Company: ${visitorData.company || "N/A"}
Email: ${visitorData.email || "N/A"}
Purpose: ${visitorData.purposeOfVisit}
Meeting With: ${visitorData.meetingWith || "our team"}
Visit Date: ${visitorData.checkIn ? new Date(visitorData.checkIn).toLocaleDateString() : "N/A"}

Draft follow-up email:`
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 512,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: response.status })
    }

    // Stream the response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") continue
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                    controller.enqueue(encoder.encode(parsed.delta.text))
                  }
                } catch {}
              }
            }
          }
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    })
  } catch (err) {
    console.error("AI route error:", err)
    return NextResponse.json({ error: "AI request failed" }, { status: 500 })
  }
}
