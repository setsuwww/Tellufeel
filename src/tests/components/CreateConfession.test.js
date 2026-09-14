it("generates a unique token", () => {
    const tokenA = generateToken();
    const tokenB = generateToken();

    expect(tokenA).not.toBe(tokenB);
});
