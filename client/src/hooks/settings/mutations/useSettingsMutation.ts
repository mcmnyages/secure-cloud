import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { settingsService } from "@/api/services/settingsService";

import type {
  UpdateUserRequest,
  UpdateProfileRequest,
  UpdateUserSettingsRequest, 
  UpdatePasswordRequest
} from "@/types/settingsTypes";


export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserRequest) => settingsService.updateUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update profile details.");
    }
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      settingsService.updateUserProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });

      toast.success("Profile updated.");
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserSettingsRequest) =>
      settingsService.updateUserSettings(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });

      toast.success("Settings updated.");
    },
  });
};

export const useUpdatePassword=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(payload: UpdatePasswordRequest)=>
            settingsService.updatePassword(payload),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:["user-settings","me"]
            });
            toast.success("Password Updated Successfully!")
        },
        onError:()=>{
          toast.error("Password Not Updated!")
        }
    });
};