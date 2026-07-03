import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  const { roomName, participantName, isHost } = await req.json();

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "LiveKit not configured" }, { status: 503 });
  }

  if (!roomName || !participantName) {
    return NextResponse.json({ error: "roomName and participantName required" }, { status: 400 });
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: "4h",
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: !!isHost,
    roomRecord: !!isHost,  // allows host to trigger Egress recording
  });

  return NextResponse.json({ token: await token.toJwt() });
}
