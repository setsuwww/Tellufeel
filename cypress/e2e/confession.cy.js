describe("Confession Flow", () => {
    it("creates confession and recipient chooses MAU", () => {
        cy.visit("/");

        cy.get("[data-cy='create-confession']")
            .click();

        cy.get('input[name="senderName"]')
            .type("Andre");

        cy.get('input[name="recipientName"]')
            .type("Andriana");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get("[data-cy='create-confession-submit']")
            .click();

        cy.get("[data-cy='confession-success']", {
            timeout: 10000,
        })
            .should("exist");

        cy.get("[data-cy='recipient-url']")
            .invoke("val")
            .should("include", "/c/")
            .then((recipientUrl) => {
                expect(recipientUrl)
                    .to.contain("?token=");

                cy.visit(recipientUrl);
            });

        cy.contains("Andre", {
            timeout: 10000,
        }).should("be.visible");

        cy.contains("Andriana")
            .should("be.visible");

        cy.contains(
            "Kamu mau ga jadi pacarku?",
        ).should("be.visible");

        cy.get("[data-cy='response-yes']", {
            timeout: 10000,
        })
            .should("be.visible")
            .click();

        cy.get("[data-cy='response-success']", {
            timeout: 10000,
        })
            .should("be.visible");
    });

    it("creates confession and recipient chooses NGGA_MAU", () => {
        cy.visit("/");

        cy.get("[data-cy='create-confession']")
            .click();

        cy.get('input[name="senderName"]')
            .type("Andre");

        cy.get('input[name="recipientName"]')
            .type("Andriana");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get("[data-cy='create-confession-submit']")
            .click();

        cy.get("[data-cy='confession-success']", {
            timeout: 10000,
        })
            .should("exist");

        cy.get("[data-cy='recipient-url']")
            .invoke("val")
            .should("include", "/c/")
            .then((recipientUrl) => {
                expect(recipientUrl)
                    .to.contain("?token=");

                cy.visit(recipientUrl);
            });

        cy.get("[data-cy='response-no']", {
            timeout: 10000,
        })
            .should("be.visible")
            .click();

        cy.get("[data-cy='submit-reason']", {
            timeout: 10000,
        })
            .should("be.visible");

        cy.get("textarea")
            .should("be.visible")
            .type(
                "Maaf, kayaknya kita lebih cocok jadi teman.",
            );

        cy.get("[data-cy='submit-reason']")
            .click();

        cy.get("[data-cy='response-success']", {
            timeout: 10000,
        })
            .should("be.visible");
    });

    it("rejects empty confession", () => {
        cy.visit("/");

        cy.get("[data-cy='create-confession']")
            .click();

        cy.get("[data-cy='create-confession-submit']")
            .click();

        cy.contains(
            "Semua field wajib diisi.",
        ).should("be.visible");
    });

    it("requires reason when choosing NGGA_MAU", () => {
        cy.visit("/");

        cy.get("[data-cy='create-confession']")
            .click();

        cy.get('input[name="senderName"]')
            .type("Rifqi");

        cy.get('input[name="recipientName"]')
            .type("Ayu");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get("[data-cy='create-confession-submit']")
            .click();

        cy.get("[data-cy='confession-success']", {
            timeout: 10000,
        })
            .should("exist");

        cy.get("[data-cy='recipient-url']")
            .invoke("val")
            .should("include", "/c/")
            .then((recipientUrl) => {
                expect(recipientUrl)
                    .to.contain("?token=");

                cy.visit(recipientUrl);
            });

        cy.get("[data-cy='response-no']", {
            timeout: 10000,
        })
            .should("be.visible")
            .click();

        cy.get("[data-cy='submit-reason']", {
            timeout: 10000,
        })
            .should("be.visible");

        cy.get("[data-cy='submit-reason']")
            .should("be.disabled");
    });

    it("prevents duplicate response", () => {
        cy.visit("/");

        cy.get("[data-cy='create-confession']")
            .click();

        cy.get('input[name="senderName"]')
            .type("Rifqi");

        cy.get('input[name="recipientName"]')
            .type("Ayu");

        cy.get('textarea[name="message"]')
            .type("Kamu mau ga jadi pacarku?");

        cy.get("[data-cy='create-confession-submit']")
            .click();

        cy.get("[data-cy='confession-success']", {
            timeout: 10000,
        })
            .should("exist");

        cy.get("[data-cy='recipient-url']")
            .invoke("val")
            .should("include", "/c/")
            .then((recipientUrl) => {
                expect(recipientUrl)
                    .to.contain("?token=");

                cy.visit(recipientUrl);
            });

        cy.get("[data-cy='response-yes']", {
            timeout: 10000,
        })
            .should("be.visible")
            .click();

        cy.get("[data-cy='response-success']", {
            timeout: 10000,
        })
            .should("be.visible");

        cy.reload();

        cy.get("[data-cy='response-success']", {
            timeout: 10000,
        })
            .should("be.visible");

        cy.get("[data-cy='response-yes']")
            .should("not.exist");

        cy.get("[data-cy='response-no']")
            .should("not.exist");
    });

    it("rejects invalid recipient token", () => {
        cy.visit(
            "/c/test-invalid?token=invalid-token",
        );

        cy.contains(
            "Confess tidak ditemukan",
        ).should("be.visible");
    });

    it("rejects recipient access without token", () => {
        cy.visit("/c/test-invalid");

        cy.contains(
            "Confess tidak ditemukan",
        ).should("be.visible");
    });

    it("creator can see only their own confession", () => {
        cy.visit("/");

        cy.get("[data-cy='create-confession']")
            .click();

        cy.get('input[name="senderName"]')
            .type("Rifqi");

        cy.get('input[name="recipientName"]')
            .type("Ayu");

        cy.get('textarea[name="message"]')
            .type("Ini confession milik Rifqi.");

        cy.get("[data-cy='create-confession-submit']")
            .click();

        cy.get("[data-cy='confession-success']", {
            timeout: 10000,
        })
            .should("exist");

        cy.visit("/dashboard");

        cy.contains(
            "Ini confession milik Rifqi.",
        ).should("be.visible");
    });
});
