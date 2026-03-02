import {
  Calendar,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useListSelectionsSession } from "../../../hooks/useQueries";

export function SelectionsTab() {
  const { data: selections = [], isLoading } = useListSelectionsSession();

  function formatDate(ts: bigint) {
    const ms = Number(ts / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">
          Customer Selections
          {selections.length > 0 && (
            <span className="ml-3 font-body text-sm text-muted-foreground font-normal">
              ({selections.length} total)
            </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : selections.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-sm">
          <div className="text-4xl mb-4">📋</div>
          <p className="font-display text-xl text-muted-foreground mb-2">
            No selections yet
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Customer selections will appear here when they choose a design.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {selections.map((sel) => (
            <div
              key={sel.id.toString()}
              className="card-luxury rounded-sm p-6 hover:shadow-luxury-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    {sel.customerName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-gold flex-shrink-0" />
                      <a
                        href={`mailto:${sel.email}`}
                        className="font-body text-sm text-foreground hover:text-gold transition-colors"
                      >
                        {sel.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-gold flex-shrink-0" />
                      <a
                        href={`tel:${sel.phone}`}
                        className="font-body text-sm text-foreground"
                      >
                        {sel.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                      Selected Design
                    </span>
                  </div>
                  <p className="font-display text-base font-semibold text-gold mb-3">
                    {sel.designName}
                  </p>
                  {sel.brideGroomNames && (
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={13} className="text-gold flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">
                        {sel.brideGroomNames}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gold flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">
                      {sel.eventDate}
                    </span>
                  </div>
                </div>

                {/* Message & Date */}
                <div>
                  {sel.message && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageSquare size={13} className="text-gold" />
                        <span className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                          Message
                        </span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground line-clamp-3">
                        {sel.message}
                      </p>
                    </div>
                  )}
                  <p className="font-body text-xs text-muted-foreground mt-auto">
                    Submitted: {formatDate(sel.submittedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
