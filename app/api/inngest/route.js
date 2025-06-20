export const runtime = "nodejs";
import { serve } from "inngest/next";
import { inngest } from "@/Config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [],
});


