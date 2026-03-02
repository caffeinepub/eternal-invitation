import {
  Facebook,
  Globe,
  Instagram,
  Loader2,
  Mail,
  Phone,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiWhatsapp, SiX } from "react-icons/si";
import { toast } from "sonner";
import type { SiteSettings } from "../../../backend.d";
import { useAdminSessionContext } from "../../../contexts/AdminSessionContext";
import {
  useGetSiteSettings,
  useUpdateSiteSettingsSession,
} from "../../../hooks/useQueries";

export function SettingsTab() {
  const { sessionToken } = useAdminSessionContext();
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateMut = useUpdateSiteSettingsSession();

  const [form, setForm] = useState<SiteSettings>({
    tagline: "",
    contactEmail: "",
    contactPhone: "",
    whatsappLink: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
  });

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateMut.mutateAsync({ sessionToken, settings: form });
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  function setField(key: keyof SiteSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={28} className="text-gold animate-spin" />
      </div>
    );
  }

  const fields: {
    key: keyof SiteSettings;
    label: string;
    placeholder: string;
    type?: string;
    icon: React.ReactNode;
    isTextarea?: boolean;
  }[] = [
    {
      key: "tagline",
      label: "Tagline",
      placeholder:
        "Timeless Digital Invitations for Moments That Last Forever.",
      icon: <Globe size={14} className="text-gold" />,
      isTextarea: true,
    },
    {
      key: "contactEmail",
      label: "Contact Email",
      placeholder: "hello@eternalinvitation.com",
      type: "email",
      icon: <Mail size={14} className="text-gold" />,
    },
    {
      key: "contactPhone",
      label: "Contact Phone",
      placeholder: "+1 (555) 000-0000",
      type: "tel",
      icon: <Phone size={14} className="text-gold" />,
    },
    {
      key: "whatsappLink",
      label: "WhatsApp Link",
      placeholder: "https://wa.me/15550001234",
      type: "url",
      icon: <SiWhatsapp size={14} className="text-gold" />,
    },
    {
      key: "facebookLink",
      label: "Facebook Link",
      placeholder: "https://facebook.com/eternalinvitation",
      type: "url",
      icon: <Facebook size={14} className="text-gold" />,
    },
    {
      key: "instagramLink",
      label: "Instagram Link",
      placeholder: "https://instagram.com/eternalinvitation",
      type: "url",
      icon: <Instagram size={14} className="text-gold" />,
    },
    {
      key: "twitterLink",
      label: "X (Twitter) Link",
      placeholder: "https://x.com/eternalinvite",
      type: "url",
      icon: <SiX size={14} className="text-gold" />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-foreground">Site Settings</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Update your site content and contact information.
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={`st-${field.key}`}
              className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
            >
              {field.icon}
              {field.label}
            </label>
            {field.isTextarea ? (
              <textarea
                id={`st-${field.key}`}
                value={form[field.key]}
                onChange={(e) => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-4 py-3 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition resize-none"
              />
            ) : (
              <input
                id={`st-${field.key}`}
                type={field.type || "text"}
                value={form[field.key]}
                onChange={(e) => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition"
              />
            )}
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={updateMut.isPending}
            className="btn-gold flex items-center gap-2 px-6 py-3 rounded-sm font-body text-sm tracking-widest uppercase font-medium disabled:opacity-60"
          >
            {updateMut.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {updateMut.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
