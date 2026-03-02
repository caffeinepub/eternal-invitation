import { createContext, useContext } from "react";

interface AdminSessionContextValue {
  sessionToken: string;
}

export const AdminSessionContext = createContext<AdminSessionContextValue>({
  sessionToken: "",
});

export function useAdminSessionContext(): AdminSessionContextValue {
  return useContext(AdminSessionContext);
}
