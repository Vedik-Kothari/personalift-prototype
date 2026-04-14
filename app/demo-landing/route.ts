import { SAMPLE_PAGE_HTML } from "@/lib/personalization/sample-page";

export async function GET() {
  return new Response(SAMPLE_PAGE_HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
