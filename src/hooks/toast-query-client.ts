// toast-query-client.ts
import { useQueryClient } from "@tanstack/vue-query";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export const useMutationResources = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();
  return { queryClient, toast, router, route };
};
