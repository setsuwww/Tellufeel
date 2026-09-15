// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("pauseIfDebug", (ms = 800) => {
    if (Cypress.expose("SLOW_MODE")) {
        cy.wait(ms);
    }
});

Cypress.Commands.add("loginAsGuest", () => {
    cy.session("anonymous-user", () => {
        cy.visit("/");

        cy.window().then(async (win) => {
            // Wait for Supabase anonymous session
            await new Promise((resolve) => {
                const checkSession = () => {
                    const supabase = win.__SUPABASE__;

                    if (supabase) {
                        resolve();
                        return;
                    }

                    setTimeout(checkSession, 100);
                };

                checkSession();
            });
        });
    });
});
