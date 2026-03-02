import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Design {
    id: bigint;
    categoryId: bigint;
    name: string;
    description: string;
    price: string;
    videoUrl: string;
}
export interface Category {
    id: bigint;
    displayOrder: bigint;
    name: string;
    description: string;
    coverImage: string;
}
export interface SiteSettings {
    instagramLink: string;
    tagline: string;
    whatsappLink: string;
    twitterLink: string;
    contactEmail: string;
    facebookLink: string;
    contactPhone: string;
}
export interface CustomerSelection {
    id: bigint;
    customerName: string;
    submittedAt: bigint;
    email: string;
    designId: bigint;
    message: string;
    brideGroomNames: string;
    phone: string;
    designName: string;
    eventDate: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminLogout(token: string): Promise<void>;
    adminSignup(email: string, passwordHash: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(sessionToken: string, newPasswordHash: string): Promise<void>;
    createCategory(name: string, description: string, displayOrder: bigint, coverImage: string): Promise<Category>;
    createCategoryWithSession(sessionToken: string, name: string, description: string, displayOrder: bigint, coverImage: string): Promise<Category>;
    createDesign(categoryId: bigint, name: string, description: string, price: string, videoUrl: string): Promise<Design>;
    createDesignWithSession(sessionToken: string, categoryId: bigint, name: string, description: string, price: string, videoUrl: string): Promise<Design>;
    createSelection(designId: bigint, designName: string, customerName: string, email: string, phone: string, brideGroomNames: string, eventDate: string, message: string): Promise<CustomerSelection>;
    deleteCategory(id: bigint): Promise<void>;
    deleteCategoryWithSession(sessionToken: string, id: bigint): Promise<void>;
    deleteDesign(id: bigint): Promise<void>;
    deleteDesignWithSession(sessionToken: string, id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(id: bigint): Promise<Category | null>;
    getDesign(id: bigint): Promise<Design | null>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    initializeSeedData(sessionToken: string): Promise<void>;
    isAdminSetup(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    listDesigns(): Promise<Array<Design>>;
    listDesignsByCategory(categoryId: bigint): Promise<Array<Design>>;
    listSelections(): Promise<Array<CustomerSelection>>;
    listSelectionsWithSession(sessionToken: string): Promise<Array<CustomerSelection>>;
    requestAdminOtp(email: string, passwordHash: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: bigint, name: string, description: string, displayOrder: bigint, coverImage: string): Promise<void>;
    updateCategoryWithSession(sessionToken: string, id: bigint, name: string, description: string, displayOrder: bigint, coverImage: string): Promise<void>;
    updateDesign(id: bigint, categoryId: bigint, name: string, description: string, price: string, videoUrl: string): Promise<void>;
    updateDesignWithSession(sessionToken: string, id: bigint, categoryId: bigint, name: string, description: string, price: string, videoUrl: string): Promise<void>;
    updateSiteSettings(tagline: string, contactEmail: string, contactPhone: string, whatsappLink: string, facebookLink: string, instagramLink: string, twitterLink: string): Promise<void>;
    updateSiteSettingsWithSession(sessionToken: string, tagline: string, contactEmail: string, contactPhone: string, whatsappLink: string, facebookLink: string, instagramLink: string, twitterLink: string): Promise<void>;
    verifyAdminOtp(email: string, otp: string): Promise<string>;
    verifyAdminSession(token: string): Promise<boolean>;
}
