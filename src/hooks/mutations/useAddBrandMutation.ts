import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { toast } from "sonner";
import { kyClient, strip } from "@/lib/api";
import type { ApiError } from "@/lib/api";
import { invalidateBrandsQuery } from "@/hooks/queries";

const addBrand = async (name: string): Promise<void> => {
  await kyClient
    .post(strip("products/brands/create/"), { json: { name } })
    .json<void>();
};

const useAddBrandMutation = (
  options?: UseMutationOptions<void, HTTPError<ApiError>, string>,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};

  return useMutation<void, HTTPError<ApiError>, string>({
    mutationFn: addBrand,
    onSuccess: (...args) => {
      invalidateBrandsQuery();
      toast.success("Brand added");
      onSuccess?.(...args);
    },
    onError: async (error, ...args) => {
      const body = await error.response.json<ApiError>().catch(() => null);
      toast.error(body?.error || "Failed to add brand");
      onError?.(error, ...args);
    },
    ...restOptions,
  });
};

export default useAddBrandMutation;
