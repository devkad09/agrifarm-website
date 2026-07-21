import { supabase } from "@/integrations/supabase/client";

export interface SmsAlertSubscription {
  id?: string;
  user_id?: string | null;
  phone_number: string;
  crop: string;
  market: string;
  target_price?: number | null;
  active?: boolean;
  created_at?: string;
}

export const CROPS = ["Maize", "Tomato", "Yam", "Cassava", "Plantain", "Pepper", "Sorghum", "Millet"];

export const MARKETS = [
  "All Markets (Nationwide)",
  "Techiman",
  "Kejetia",
  "Agbogbloshie",
  "Tamale Central",
  "Kaneshie",
  "Makola",
  "Ho Central",
  "Takoradi Market Circle",
];

export async function subscribeSmsAlert(payload: {
  phone_number: string;
  crop: string;
  market: string;
  target_price?: number | null;
}) {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes.user?.id || null;

  // Format phone number to clean standard
  const cleanedPhone = payload.phone_number.trim().replace(/\s+/g, "");

  const { data, error } = await supabase
    .from("sms_alerts")
    .insert([
      {
        user_id: userId,
        phone_number: cleanedPhone,
        crop: payload.crop,
        market: payload.market,
        target_price: payload.target_price || null,
        active: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchUserSmsAlerts(phoneNumber?: string): Promise<SmsAlertSubscription[]> {
  const { data: userRes } = await supabase.auth.getUser();

  let query = supabase.from("sms_alerts").select("*").eq("active", true).order("created_at", { ascending: false });

  if (userRes.user) {
    query = query.eq("user_id", userRes.user.id);
  } else if (phoneNumber) {
    query = query.eq("phone_number", phoneNumber);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function cancelSmsAlert(id: string) {
  const { error } = await supabase.from("sms_alerts").delete().eq("id", id);
  if (error) throw error;
}

export async function sendRealTwilioSms({ to, body }: { to: string; body: string }) {
  const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

  if (!fromNumber || fromNumber.includes("REPLACE")) {
    return { status: "simulated", to, body };
  }

  let formattedTo = to.replace(/\s+/g, "");
  if (!formattedTo.startsWith("+")) {
    formattedTo = "+" + formattedTo;
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const credentials = btoa(`${accountSid}:${authToken}`);

  const formData = new URLSearchParams();
  formData.append("To", formattedTo);
  formData.append("From", fromNumber);
  formData.append("Body", body);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Twilio SMS dispatch failed");
  }

  return { status: "sent", sid: json.sid, to: formattedTo, body };
}

export async function broadcastPriceUpdateSmsAlerts(payload: {
  crop: string;
  market: string;
  newPrice: number;
  oldPrice?: number;
}) {
  const { data: subscribers, error } = await supabase
    .from("sms_alerts")
    .select("*");

  if (error) throw error;

  const allSubscribers = subscribers || [];

  const uniqueSubscribersMap = new Map();
  allSubscribers.forEach((sub) => {
    if (!uniqueSubscribersMap.has(sub.phone_number)) {
      uniqueSubscribersMap.set(sub.phone_number, sub);
    }
  });

  let targets = Array.from(uniqueSubscribersMap.values());

  if (targets.length === 0) {
    targets = [
      {
        id: "demo-sub-1",
        phone_number: "+233 0592921133",
        crop: payload.crop,
        market: payload.market,
      },
    ];
  }
  const priceDiff = payload.oldPrice ? payload.newPrice - payload.oldPrice : 0;
  const changeText = priceDiff > 0 ? `(▲ +GH₵ ${priceDiff})` : priceDiff < 0 ? `(▼ -GH₵ ${Math.abs(priceDiff)})` : "";

  const dispatchedLog = await Promise.all(
    targets.map(async (sub) => {
      const text = `[AgriFarm Alert] PRICE UPDATE: ${payload.crop} at ${payload.market} updated to GH₵ ${payload.newPrice} per 100kg ${changeText}. Ref: agrifarm.gh`;
      
      let deliveryStatus = "DELIVERED (SIMULATED)";
      try {
        const res = await sendRealTwilioSms({ to: sub.phone_number, body: text });
        if (res.status === "sent") {
          deliveryStatus = `SENT VIA TWILIO (SID: ${res.sid?.slice(0, 10)}...)`;
        }
      } catch (err) {
        deliveryStatus = `ERROR: ${err instanceof Error ? err.message : "Delivery failed"}`;
      }

      return {
        id: sub.id,
        phone_number: sub.phone_number,
        message: text,
        sent_at: new Date().toISOString(),
        status: deliveryStatus,
      };
    })
  );

  return {
    count: dispatchedLog.length,
    dispatchedLog,
  };
}
