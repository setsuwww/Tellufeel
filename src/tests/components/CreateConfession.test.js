import {
    describe,
    expect,
    it,
    vi,
    beforeEach,
    afterEach,
} from "vitest";
import { mount } from "@vue/test-utils";

import CreateConfessionView from "@/views/CreateConfessionView.vue";
import { createConfession } from "@/services/confession.service";

vi.mock("@/services/confession.service", () => ({
    createConfession: vi.fn(),
}));

describe("CreateConfessionView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders confession form", () => {
        const wrapper = mount(CreateConfessionView);

        expect(
            wrapper.find('input[name="senderName"]').exists(),
        ).toBe(true);

        expect(
            wrapper.find('input[name="recipientName"]').exists(),
        ).toBe(true);

        expect(
            wrapper.find('textarea[name="message"]').exists(),
        ).toBe(true);

        expect(
            wrapper.find('button[type="submit"]').exists(),
        ).toBe(true);
    });

    it("shows validation error when fields are empty", async () => {
        const wrapper = mount(CreateConfessionView);

        await wrapper
            .find('button[type="submit"]')
            .trigger("submit");

        expect(
            wrapper.text(),
        ).toContain("Semua field wajib diisi.");

        expect(
            createConfession,
        ).not.toHaveBeenCalled();
    });

    it("submits valid confession", async () => {
        createConfession.mockResolvedValue({
            confession: {
                id: "test-id",
                cuid: "test-cuid",
            },
            creatorToken: "creator-token",
            recipientToken: "recipient-token",
        });

        const wrapper = mount(CreateConfessionView);

        await wrapper
            .find('input[name="senderName"]')
            .setValue("Dirman");

        await wrapper
            .find('input[name="recipientName"]')
            .setValue("Tri");

        await wrapper
            .find('textarea[name="message"]')
            .setValue("Hello Tri, I Love you");

        await wrapper
            .find('form')
            .trigger("submit");

        expect(createConfession).toHaveBeenCalledTimes(1);

        expect(createConfession).toHaveBeenCalledWith(
            expect.objectContaining({
                senderName: "Dirman",
                recipientName: "Tri",
                message: "Hello Tri, I Love you",
            }),
        );
    });

    it("shows success message after successful submission", async () => {
        createConfession.mockResolvedValue({
            confession: {
                id: "test-id",
                cuid: "test-cuid",
            },
            creatorToken: "creator-token",
            recipientToken: "recipient-token",
        });

        const wrapper = mount(CreateConfessionView);

        await wrapper
            .find('input[name="senderName"]')
            .setValue("Dirman");

        await wrapper
            .find('input[name="recipientName"]')
            .setValue("Tri");

        await wrapper
            .find('textarea[name="message"]')
            .setValue("Hello Tri, I Love you");

        await wrapper
            .find("form")
            .trigger("submit");

        expect(wrapper.text()).toContain(
            "Confess berhasil dibuat.",
        );
    });

    it("shows error message when submission fails", async () => {
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        createConfession.mockRejectedValue(
            new Error("Database error"),
        );

        const wrapper = mount(CreateConfessionView);

        await wrapper
            .find('input[name="senderName"]')
            .setValue("Dirman");

        await wrapper
            .find('input[name="recipientName"]')
            .setValue("Tri");

        await wrapper
            .find('textarea[name="message"]')
            .setValue("Hello Tri, I Love you");

        await wrapper
            .find("form")
            .trigger("submit");

        expect(wrapper.text()).toContain(
            "Gagal membuat confess.",
        );

        expect(consoleError).toHaveBeenCalled();

        consoleError.mockRestore();
    });
});
