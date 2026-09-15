import { createRouter, createWebHistory } from "vue-router";

import WelcomeView from "@/views/WelcomeView.vue";
import CreateConfessionView from "@/views/CreateConfessionView.vue";
import RecipientView from "@/views/RecipientView.vue";
import DashboardView from "@/views/DashboardView.vue";

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: "/",
            name: "welcome",
            component: WelcomeView,
        },
        {
            path: "/create",
            name: "create-confession",
            component: CreateConfessionView,
        },
        {
            path: "/c/:cuid",
            name: "recipient",
            component: RecipientView,
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: DashboardView,
        },
    ],
});

export default router;
