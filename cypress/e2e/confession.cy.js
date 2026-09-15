describe("Confession Flow", () => {
    it("creates confession and recipient chooses MAU", () => {
        cy.visit("/");

        cy.pauseIfDebug();

        cy.contains("Iya").click();

        cy.pauseIfDebug();

        cy.get('input[name="senderName"]')
            .type("Andre");

        cy.pauseIfDebug();

        cy.get('input[name="recipientName"]')
            .type("Andriana");

        cy.pauseIfDebug();

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.pauseIfDebug();

        cy.get('button[type="submit"]')
            .click();

        cy.pauseIfDebug(1500);

        cy.contains("Confess berhasil dibuat")
            .should("be.visible");

        cy.pauseIfDebug();

        cy.get('input[readonly]')
            .invoke("val")
            .should("include", "/c/")
            .then((recipientUrl) => {
                expect(recipientUrl)
                    .to.contain("?token=");

                cy.pauseIfDebug();

                cy.visit(recipientUrl);
            });

        cy.pauseIfDebug(1500);

        cy.contains("Andre")
            .should("be.visible");

        cy.contains("Andriana")
            .should("be.visible");

        cy.contains("Kamu mau ga jadi pacarku?")
            .should("be.visible");

        cy.pauseIfDebug();

        cy.contains("Mau")
            .click();

        cy.pauseIfDebug(1500);

        cy.contains("Jawaban kamu sudah dikirim.")
            .should("be.visible");
    });

    it("creates confession and recipient chooses NGGA_MAU", () => {
        cy.visit("/");

        cy.contains("Iya").click();

        cy.get('input[name="senderName"]')
            .type("Andre");

        cy.get('input[name="recipientName"]')
            .type("Andriana");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get('button[type="submit"]')
            .click();

        cy.contains("Confess berhasil dibuat")
            .should("be.visible");

        cy.get('input[readonly]')
            .invoke("val")
            .then((recipientUrl) => {
                cy.visit(recipientUrl);
            });

        cy.contains("Ngga Mau")
            .click();

        cy.get("textarea")
            .should("be.visible")
            .type("Maaf, kayaknya kita lebih cocok jadi teman.");

        cy.contains("Kirim alasan")
            .click();

        cy.contains(
            "Jawaban dan alasan kamu sudah dikirim.",
        ).should("be.visible");
    });

    it("rejects empty confession", () => {
        cy.visit("/");

        cy.contains("Iya").click();

        cy.get('button[type="submit"]')
            .click();

        cy.contains("Semua field wajib diisi.")
            .should("be.visible");
    });

    it("requires reason when choosing NGGA_MAU", () => {
        cy.visit("/");

        cy.contains("Iya").click();

        cy.get('input[name="senderName"]')
            .type("Rifqi");

        cy.get('input[name="recipientName"]')
            .type("Ayu");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get('button[type="submit"]')
            .click();

        cy.get('input[readonly]')
            .invoke("val")
            .then((recipientUrl) => {
                cy.visit(recipientUrl);
            });

        cy.contains("Ngga Mau")
            .click();

        cy.contains("Kirim alasan")
            .click();

        cy.contains("Alasan wajib diisi.")
            .should("be.visible");
    });

    it("prevents duplicate response", () => {
        cy.visit("/");

        cy.contains("Iya").click();

        cy.get('input[name="senderName"]')
            .type("Rifqi");

        cy.get('input[name="recipientName"]')
            .type("Ayu");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get('button[type="submit"]')
            .click();

        cy.get('input[readonly]')
            .invoke("val")
            .then((recipientUrl) => {
                cy.visit(recipientUrl);
            });

        cy.contains("Mau")
            .click();

        cy.contains("Jawaban kamu sudah dikirim.")
            .should("be.visible");

        cy.reload();

        cy.contains("Mau")
            .click();

        cy.contains(
            "This confession has already been answered.",
        ).should("be.visible");
    });

    it("rejects invalid recipient token", () => {
        cy.visit(
            "/c/test-invalid?token=invalid-token",
        );

        cy.contains("Confess tidak ditemukan")
            .should("be.visible");
    });

    it("rejects recipient access without token", () => {
        cy.visit(
            "/c/test-invalid",
        );

        cy.contains("Confess tidak ditemukan")
            .should("be.visible");
    });

    it("creator can see only their own confession", () => {
        cy.visit("/");

        cy.contains("Iya").click();

        cy.get('input[name="senderName"]')
            .type("Rifqi");

        cy.get('input[name="recipientName"]')
            .type("Ayu");

        cy.get('textarea[name="message"]')
            .type("Ini confession milik Rifqi.");

        cy.get('button[type="submit"]')
            .click();

        cy.contains(
            "Confess berhasil dibuat",
        ).should("be.visible");

        cy.visit("/dashboard");

        cy.contains("Ini confession milik Rifqi.")
            .should("be.visible");
    });
});
