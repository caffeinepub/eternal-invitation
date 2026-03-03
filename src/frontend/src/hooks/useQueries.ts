import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  CustomerSelection,
  Design,
  SiteSettings,
} from "../backend.d";
import { getAdminSession, setAdminSession } from "../utils/adminSession";
import { useActor } from "./useActor";

// ─── Categories ─────────────────────────────────────────────────────────────

export function useListCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCategory(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Category | null>({
    queryKey: ["category", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getCategory(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      displayOrder,
      coverImage,
    }: {
      name: string;
      description: string;
      displayOrder: bigint;
      coverImage: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCategory(name, description, displayOrder, coverImage);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      displayOrder,
      coverImage,
    }: {
      id: bigint;
      name: string;
      description: string;
      displayOrder: bigint;
      coverImage: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCategory(
        id,
        name,
        description,
        displayOrder,
        coverImage,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

// ─── Designs ─────────────────────────────────────────────────────────────────

export function useListDesigns() {
  const { actor, isFetching } = useActor();
  return useQuery<Design[]>({
    queryKey: ["designs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDesigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListDesignsByCategory(categoryId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Design[]>({
    queryKey: ["designs", "category", categoryId?.toString()],
    queryFn: async () => {
      if (!actor || categoryId === undefined) return [];
      return actor.listDesignsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && categoryId !== undefined,
  });
}

export function useCreateDesign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      name,
      description,
      price,
      videoUrl,
    }: {
      categoryId: bigint;
      name: string;
      description: string;
      price: string;
      videoUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDesign(categoryId, name, description, price, videoUrl);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useUpdateDesign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      categoryId,
      name,
      description,
      price,
      videoUrl,
    }: {
      id: bigint;
      categoryId: bigint;
      name: string;
      description: string;
      price: string;
      videoUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDesign(
        id,
        categoryId,
        name,
        description,
        price,
        videoUrl,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useDeleteDesign() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteDesign(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

// ─── Selections ───────────────────────────────────────────────────────────────

export function useCreateSelection() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      designId,
      designName,
      customerName,
      email,
      phone,
      brideGroomNames,
      eventDate,
      message,
    }: {
      designId: bigint;
      designName: string;
      customerName: string;
      email: string;
      phone: string;
      brideGroomNames: string;
      eventDate: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createSelection(
        designId,
        designName,
        customerName,
        email,
        phone,
        brideGroomNames,
        eventDate,
        message,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["selections"] });
    },
  });
}

export function useListSelections() {
  const { actor, isFetching } = useActor();
  return useQuery<CustomerSelection[]>({
    queryKey: ["selections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSelections();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) {
        return {
          tagline:
            "Timeless Digital Invitations for Moments That Last Forever.",
          contactEmail: "",
          contactPhone: "",
          whatsappLink: "",
          facebookLink: "",
          instagramLink: "",
          twitterLink: "",
        };
      }
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSiteSettings(
        settings.tagline,
        settings.contactEmail,
        settings.contactPhone,
        settings.whatsappLink,
        settings.facebookLink,
        settings.instagramLink,
        settings.twitterLink,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["siteSettings"] });
    },
  });
}

// ─── Admin (legacy Internet Identity – kept for backward compat) ──────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) return "guest";
      try {
        const role = await actor.getCallerUserRole();
        if (typeof role === "object" && role !== null) {
          const key = Object.keys(role)[0];
          return key ?? "guest";
        }
        return String(role);
      } catch {
        return "guest";
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useInitializeAuth() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("Not connected");
      return actor._initializeAccessControlWithSecret(token);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["isCallerAdmin"] });
      void qc.invalidateQueries({ queryKey: ["callerUserRole"] });
    },
  });
}

export function useInitializeSeedData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.initialize();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

// ─── New Email/OTP Admin Auth ─────────────────────────────────────────────────

export function useIsAdminSetup() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdminSetup"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminSetup();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useVerifyAdminSession() {
  const { actor, isFetching } = useActor();
  const token = getAdminSession();
  return useQuery<boolean>({
    queryKey: ["adminSession", token],
    queryFn: async () => {
      if (!actor || !token) return false;
      return actor.verifyAdminSession(token);
    },
    enabled: !!actor && !isFetching && !!token,
    retry: false,
  });
}

export function useAdminSignup() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      passwordHash,
    }: {
      email: string;
      passwordHash: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminSignup(email, passwordHash);
    },
  });
}

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      passwordHash,
    }: {
      email: string;
      passwordHash: string;
    }): Promise<string> => {
      if (!actor) throw new Error("Not connected");
      const token = await actor.adminLogin(email, passwordHash);
      setAdminSession(token);
      return token;
    },
  });
}

export function useRequestAdminOtp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      passwordHash,
    }: {
      email: string;
      passwordHash: string;
    }): Promise<string> => {
      if (!actor) throw new Error("Not connected");
      return actor.requestAdminOtp(email, passwordHash);
    },
  });
}

export function useVerifyAdminOtp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      otp,
    }: {
      email: string;
      otp: string;
    }): Promise<string> => {
      if (!actor) throw new Error("Not connected");
      const token = await actor.verifyAdminOtp(email, otp);
      setAdminSession(token);
      return token;
    },
  });
}

export function useAdminLogout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: string): Promise<void> => {
      if (!actor) return;
      await actor.adminLogout(token);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminSession"] });
    },
  });
}

// ─── Session-based CRUD mutations ────────────────────────────────────────────

export function useCreateCategorySession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      name,
      description,
      displayOrder,
      coverImage,
    }: {
      sessionToken: string;
      name: string;
      description: string;
      displayOrder: bigint;
      coverImage: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCategoryWithSession(
        sessionToken,
        name,
        description,
        displayOrder,
        coverImage,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategorySession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      id,
      name,
      description,
      displayOrder,
      coverImage,
    }: {
      sessionToken: string;
      id: bigint;
      name: string;
      description: string;
      displayOrder: bigint;
      coverImage: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCategoryWithSession(
        sessionToken,
        id,
        name,
        description,
        displayOrder,
        coverImage,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategorySession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      id,
    }: {
      sessionToken: string;
      id: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCategoryWithSession(sessionToken, id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useCreateDesignSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      categoryId,
      name,
      description,
      price,
      videoUrl,
    }: {
      sessionToken: string;
      categoryId: bigint;
      name: string;
      description: string;
      price: string;
      videoUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDesignWithSession(
        sessionToken,
        categoryId,
        name,
        description,
        price,
        videoUrl,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useUpdateDesignSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      id,
      categoryId,
      name,
      description,
      price,
      videoUrl,
    }: {
      sessionToken: string;
      id: bigint;
      categoryId: bigint;
      name: string;
      description: string;
      price: string;
      videoUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDesignWithSession(
        sessionToken,
        id,
        categoryId,
        name,
        description,
        price,
        videoUrl,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useDeleteDesignSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      id,
    }: {
      sessionToken: string;
      id: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteDesignWithSession(sessionToken, id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useListSelectionsSession() {
  const { actor, isFetching } = useActor();
  const token = getAdminSession();
  return useQuery<CustomerSelection[]>({
    queryKey: ["selections", "session", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      return actor.listSelectionsWithSession(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useUpdateSiteSettingsSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionToken,
      settings,
    }: {
      sessionToken: string;
      settings: SiteSettings;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSiteSettingsWithSession(
        sessionToken,
        settings.tagline,
        settings.contactEmail,
        settings.contactPhone,
        settings.whatsappLink,
        settings.facebookLink,
        settings.instagramLink,
        settings.twitterLink,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["siteSettings"] });
    },
  });
}

export function useInitializeSeedDataSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionToken: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.initializeSeedData(sessionToken);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
      void qc.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}
