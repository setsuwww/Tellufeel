import { describe, expect, it } from "vitest";
import { hashToken } from "@/utils/hash";

describe("hashToken", () => {
    it("returns a SHA-256 hexadecimal hash", async () => {
        const hash = await hashToken("hello-world");

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    it("returns the same hash for the same token", async () => {
        const token = "my-secret-token";

        const hashA = await hashToken(token);
        const hashB = await hashToken(token);

        expect(hashA).toBe(hashB);
    });

    it("returns different hashes for different tokens", async () => {
        const hashA = await hashToken("token-a");
        const hashB = await hashToken("token-b");

        expect(hashA).not.toBe(hashB);
    });
});
