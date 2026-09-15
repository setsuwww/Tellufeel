import { withSupabase } from "npm:@supabase/server";
import { hashToken } from "../_shared/hash.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

export default {
  fetch: withSupabase(
    { auth: "none" },
    async (req, ctx) => {
      if (req.method === "OPTIONS") {
        return new Response("ok", {
          headers: corsHeaders,
        });
      }

      if (req.method !== "POST") {
        return Response.json(
          {
            error: "Method not allowed.",
          },
          {
            status: 405,
            headers: corsHeaders,
          },
        );
      }

      try {
        const body = await req.json();

        const {
          cuid,
          token,
        } = body;

        if (
          typeof cuid !== "string" ||
          typeof token !== "string" ||
          !cuid.trim() ||
          !token.trim()
        ) {
          return Response.json(
            {
              error:
                "cuid and token are required.",
            },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        if (cuid.length > 100 || token.length > 128) {
          return Response.json(
            { error: "Invalid request." },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        const tokenHash =
          await hashToken(token);

        const {
          data,
          error,
        } = await ctx.supabaseAdmin
          .from("confessions")
          .select(`
                        id,
                        cuid,
                        sender_name,
                        recipient_name,
                        message,
                        created_at
                    `)
          .eq("cuid", cuid)
          .eq(
            "recipient_token_hash",
            tokenHash,
          )
          .maybeSingle();

        if (error) {
          console.error(error);

          return Response.json(
            {
              error:
                "Failed to fetch confession.",
            },
            {
              status: 500,
              headers: corsHeaders,
            },
          );
        }

        if (!data) {
          return Response.json(
            {
              error:
                "Invalid confession or token.",
            },
            {
              status: 401,
              headers: corsHeaders,
            },
          );
        }

        const {
          data: responseData,
          error: responseError,
        } = await ctx.supabaseAdmin
          .from("confession_responses")
          .select(`
            response,
            reason,
            created_at
          `)
          .eq("confession_id", data.id)
          .maybeSingle();

        if (responseError) {
          console.error(responseError);

          return Response.json(
            {
              error:
                "Failed to fetch confession response.",
            },
            {
              status: 500,
              headers: corsHeaders,
            },
          );
        }

        return Response.json(
          {
            confession: {
              id: data.id,
              cuid: data.cuid,
              senderName: data.sender_name,
              recipientName: data.recipient_name,
              message: data.message,
              createdAt: data.created_at,
              response: responseData
                ? {
                  response: responseData.response,
                  reason: responseData.reason,
                  createdAt: responseData.created_at,
                }
                : null,
            },
          },
          {
            status: 200,
            headers: corsHeaders,
          },
        );
      } catch (error) {
        console.error(error);

        return Response.json(
          {
            error: "Invalid request.",
          },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }
    },
  ),
};
