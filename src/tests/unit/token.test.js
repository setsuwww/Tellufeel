import { describe, expect, it } from "vitest";
import { generateToken } from "@/utils/token";

describe("generateToken", () => {
    it("generates a token", () => {
        const token = generateToken();

        expect(token).toBeTruthy();
    });

    it("generates a 64-character hexadecimal token", () => {
        const token = generateToken();

        expect(token).toHaveLength(64);
        expect(token).toMatch(/^[0-9a-f]+$/);
    });

    it("generates unique tokens", () => {
        const tokenA = generateToken();
        const tokenB = generateToken();

        expect(tokenA).not.toBe(tokenB);
    });
});
