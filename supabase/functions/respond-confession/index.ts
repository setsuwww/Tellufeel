import { withSupabase } from "npm:@supabase/server@^1";
import { hashToken } from "../_shared/hash.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // "https://uni.vercel.app",
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
          response,
          reason,
        } = body;

        if (
          typeof cuid !== "string" ||
          typeof token !== "string" ||
          typeof response !== "string"
        ) {
          return Response.json(
            {
              error: "cuid, token, and response are required.",
            },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        if (
          cuid.length > 100 ||
          token.length > 128 ||
          reason?.length > 1000
        ) {
          return Response.json(
            { error: "Invalid request." },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        if (
          !cuid.trim() ||
          !token.trim()
        ) {
          return Response.json(
            {
              error: "cuid and token are required.",
            },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        if (
          response !== "MAU" &&
          response !== "NGGA_MAU"
        ) {
          return Response.json(
            {
              error: "Invalid response.",
            },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        if (
          response === "NGGA_MAU" &&
          (
            typeof reason !== "string" ||
            !reason.trim()
          )
        ) {
          return Response.json(
            {
              error:
                "Reason is required for NGGA_MAU.",
            },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        if (
          response === "MAU" &&
          reason !== undefined &&
          reason !== null
        ) {
          return Response.json(
            {
              error:
                "Reason must be empty for MAU.",
            },
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        const tokenHash = await hashToken(token);

        const {
          data: confession,
          error: confessionError,
        } = await ctx.supabaseAdmin
          .from("confessions")
          .select("id")
          .eq("cuid", cuid)
          .eq(
            "recipient_token_hash",
            tokenHash,
          )
          .maybeSingle();

        if (confessionError) {
          console.error(confessionError);

          return Response.json(
            {
              error:
                "Failed to validate confession.",
            },
            {
              status: 500,
              headers: corsHeaders,
            },
          );
        }

        if (!confession) {
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
          data: insertedResponse,
          error: responseError,
        } = await ctx.supabaseAdmin
          .from("confession_responses")
          .insert({
            confession_id: confession.id,
            response,
            reason:
              response === "NGGA_MAU"
                ? reason.trim()
                : null,
          })
          .select(
            "id, confession_id, response, reason, created_at",
          )
          .single();

        if (responseError) {
          if (
            responseError.code === "23505"
          ) {
            return Response.json(
              {
                error:
                  "This confession has already been answered.",
              },
              {
                status: 409,
                headers: corsHeaders,
              },
            );
          }

          console.error(responseError);

          return Response.json(
            {
              error:
                "Failed to save response.",
            },
            {
              status: 500,
              headers: corsHeaders,
            },
          );
        }

        return Response.json(
          {
            success: true,
            response: {
              id: insertedResponse.id,
              confessionId:
                insertedResponse.confession_id,
              response:
                insertedResponse.response,
              reason:
                insertedResponse.reason,
              createdAt:
                insertedResponse.created_at,
            },
          },
          {
            status: 201,
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
