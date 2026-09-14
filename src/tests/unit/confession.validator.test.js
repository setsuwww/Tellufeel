import { describe, expect, it } from "vitest";
import { validateConfession } from "@/validators/confession.validator";

describe("validateConfession", () => {
    const validData = {
        senderName: "Andra",
        recipientName: "Agent S",
        message: "Kamu mau ga jadi pacarku?",
    };

    it("accepts valid confession data", () => {
        expect(
            validateConfession(validData),
        ).toBe(true);
    });

    it("rejects empty sender name", () => {
        expect(
            validateConfession({
                ...validData,
                senderName: "",
            }),
        ).toBe(false);
    });

    it("rejects empty recipient name", () => {
        expect(
            validateConfession({
                ...validData,
                recipientName: "",
            }),
        ).toBe(false);
    });

    it("rejects empty message", () => {
        expect(
            validateConfession({
                ...validData,
                message: "",
            }),
        ).toBe(false);
    });

    it("rejects whitespace-only values", () => {
        expect(
            validateConfession({
                senderName: "   ",
                recipientName: "Ayu",
                message: "Hello",
            }),
        ).toBe(false);
    });
});
