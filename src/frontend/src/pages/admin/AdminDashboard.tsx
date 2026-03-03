import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ClipboardList,
  LayoutGrid,
  Loader2,
  LogOut,
  Palette,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { AdminSessionContext } from "../../contexts/AdminSessionContext";
import { useAdminLogout, useVerifyAdminSession } from "../../hooks/useQueries";
import { clearAdminSession, getAdminSession } from "../../utils/adminSession";
import { CategoriesTab } from "./tabs/CategoriesTab";
import { DesignsTab } from "./tabs/DesignsTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { SelectionsTab } from "./tabs/SelectionsTab";
import { SettingsTab } from "./tabs/SettingsTab";

export function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionToken = getAdminSession() ?? "";
  const { data: isValid, isLoading: checkingSession } = useVerifyAdminSession();
  const logoutMut = useAdminLogout();

  useEffect(() => {
    if (!sessionToken) {
      void navigate({ to: "/admin/login" });
      return;
    }
    if (!checkingSession && isValid === false) {
      clearAdminSession();
      void navigate({ to: "/admin/login" });
    }
  }, [sessionToken, checkingSession, isValid, navigate]);

  async function handleLogout() {
    try {
      await logoutMut.mutateAsync(sessionToken);
    } finally {
      clearAdminSession();
      void queryClient.invalidateQueries({ queryKey: ["adminSession"] });
      void navigate({ to: "/" });
    }
  }

  if (!sessionToken || checkingSession) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-gold animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isValid === false) {
    return null;
  }

  return (
    <AdminSessionContext.Provider value={{ sessionToken }}>
      <main className="min-h-screen bg-ivory">
        {/* Admin Header */}
        <div className="bg-foreground border-b border-gold/20 pt-16">
          <div className="container mx-auto px-6 max-w-7xl py-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl text-ivory">
                Admin Dashboard
              </h1>
              <p className="font-body text-xs text-ivory/40 mt-1 tracking-wider">
                Eternal Invitation — Management Console
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={logoutMut.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-sm border border-ivory/20 text-ivory/60 hover:text-ivory hover:border-ivory/40 transition font-body text-xs tracking-widest uppercase disabled:opacity-50"
            >
              {logoutMut.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-6 max-w-7xl py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Tabs defaultValue="categories">
              <TabsList className="mb-8 bg-ivory-mid border border-border rounded-sm p-1 flex gap-1 w-full max-w-3xl">
                {[
                  {
                    value: "categories",
                    label: "Categories",
                    icon: <LayoutGrid size={14} />,
                  },
                  {
                    value: "designs",
                    label: "Designs",
                    icon: <Palette size={14} />,
                  },
                  {
                    value: "selections",
                    label: "Selections",
                    icon: <Users size={14} />,
                  },
                  {
                    value: "orders",
                    label: "Orders",
                    icon: <ClipboardList size={14} />,
                  },
                  {
                    value: "settings",
                    label: "Settings",
                    icon: <Settings size={14} />,
                  },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 flex items-center justify-center gap-2 font-body text-xs tracking-wider uppercase py-2 rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-ivory data-[state=active]:shadow-sm transition-all"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="categories">
                <CategoriesTab />
              </TabsContent>
              <TabsContent value="designs">
                <DesignsTab />
              </TabsContent>
              <TabsContent value="selections">
                <SelectionsTab />
              </TabsContent>
              <TabsContent value="orders">
                <OrdersTab />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </AdminSessionContext.Provider>
  );
}
