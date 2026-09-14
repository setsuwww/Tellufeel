it("rejects an empty message", () => {
    expect(
        validateConfession({
            senderName: "Dirman",
            recipientName: "Tri",
            message: "",
        }),
    ).toBe(false);
});
