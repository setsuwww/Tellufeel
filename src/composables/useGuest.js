import { ref } from "vue";
import { supabase } from "@/lib/supabase";

const user = ref(null);
const loading = ref(true);

export function useGuest() {
    const initializeGuest = async () => {
        loading.value = true;

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session?.user) {
                user.value = session.user;
                return user.value;
            }

            const { data, error } = await supabase.auth.signInAnonymously();

            if (error) {
                throw error;
            }

            user.value = data.user;

            return user.value;
        } catch (error) {
            console.error("Guest initialization failed:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        user,
        loading,
        initializeGuest,
    };
}
