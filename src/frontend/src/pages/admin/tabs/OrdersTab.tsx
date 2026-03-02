import {
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Loader2,
  Mail,
  PauseCircle,
  Phone,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CustomerSelection } from "../../../backend.d";
import { useListSelectionsSession } from "../../../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "New Request" | "In Progress" | "Completed" | "On Hold";

interface OrderAnnotation {
  orderName: string;
  orderDate: string;
  status: OrderStatus;
}

type AnnotationsMap = Record<string, OrderAnnotation>;

const LS_KEY = "eternal_order_annotations";

const STATUS_OPTIONS: OrderStatus[] = [
  "New Request",
  "In Progress",
  "Completed",
  "On Hold",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadAnnotations(): AnnotationsMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AnnotationsMap) : {};
  } catch {
    return {};
  }
}

function saveAnnotations(map: AnnotationsMap) {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

function formatDate(ts: bigint) {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "New Request":
      return "bg-gray-100 text-gray-600 border-gray-200";
    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "On Hold":
      return "bg-red-50 text-red-600 border-red-200";
  }
}

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case "New Request":
      return <Sparkles size={12} />;
    case "In Progress":
      return <Clock size={12} />;
    case "Completed":
      return <CheckCircle2 size={12} />;
    case "On Hold":
      return <PauseCircle size={12} />;
  }
}

function sortSelections(
  selections: CustomerSelection[],
  annotations: AnnotationsMap,
): CustomerSelection[] {
  const priority: Record<OrderStatus, number> = {
    "New Request": 0,
    "In Progress": 1,
    "On Hold": 2,
    Completed: 3,
  };
  return [...selections].sort((a, b) => {
    const aStatus = annotations[a.id.toString()]?.status ?? "New Request";
    const bStatus = annotations[b.id.toString()]?.status ?? "New Request";
    return (priority[aStatus] ?? 0) - (priority[bStatus] ?? 0);
  });
}

// ─── Order Card ───────────────────────────────────────────────────────────────

interface OrderCardProps {
  selection: CustomerSelection;
  annotation: OrderAnnotation;
  onSave: (id: string, annotation: OrderAnnotation) => void;
}

function OrderCard({ selection, annotation, onSave }: OrderCardProps) {
  const [orderName, setOrderName] = useState(annotation.orderName);
  const [orderDate, setOrderDate] = useState(annotation.orderDate);
  const [status, setStatus] = useState<OrderStatus>(annotation.status);

  // Sync if annotation changes (e.g., initial load)
  useEffect(() => {
    setOrderName(annotation.orderName);
    setOrderDate(annotation.orderDate);
    setStatus(annotation.status);
  }, [annotation.orderName, annotation.orderDate, annotation.status]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(selection.id.toString(), { orderName, orderDate, status });
  }

  return (
    <div className="card-luxury rounded-sm overflow-hidden">
      {/* Status stripe */}
      <div
        className={`h-1 w-full ${
          status === "Completed"
            ? "bg-emerald-400"
            : status === "In Progress"
              ? "bg-amber-400"
              : status === "On Hold"
                ? "bg-red-400"
                : "bg-gray-300"
        }`}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
              {selection.customerName}
            </h3>
            <p className="font-display text-base text-gold mt-0.5">
              {selection.designName}
            </p>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium border ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            {status}
          </span>
        </div>

        {/* Customer details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="space-y-2">
            <a
              href={`mailto:${selection.email}`}
              className="flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors group"
            >
              <Mail size={13} className="text-gold flex-shrink-0" />
              <span className="truncate group-hover:underline">
                {selection.email}
              </span>
            </a>
            <a
              href={`tel:${selection.phone}`}
              className="flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors"
            >
              <Phone size={13} className="text-gold flex-shrink-0" />
              {selection.phone}
            </a>
          </div>
          <div className="space-y-2">
            {selection.brideGroomNames && (
              <div className="flex items-center gap-2">
                <Heart size={13} className="text-gold flex-shrink-0" />
                <span className="font-body text-sm text-foreground">
                  {selection.brideGroomNames}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-gold flex-shrink-0" />
              <span className="font-body text-sm text-foreground">
                {selection.eventDate}
              </span>
            </div>
          </div>
        </div>

        <p className="font-body text-xs text-muted-foreground mb-4">
          Submitted: {formatDate(selection.submittedAt)}
        </p>

        {/* Admin Notes separator */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gold/30" />
          <span className="font-body text-xs text-gold tracking-widest uppercase">
            Admin Notes
          </span>
          <div className="h-px flex-1 bg-gold/30" />
        </div>

        {/* Admin annotation form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`order-name-${selection.id}`}
                className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
              >
                Order Name
              </label>
              <input
                id={`order-name-${selection.id}`}
                type="text"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="e.g. Ahmed & Sara Wedding"
                className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div>
              <label
                htmlFor={`order-date-${selection.id}`}
                className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
              >
                Delivery Date
              </label>
              <input
                id={`order-date-${selection.id}`}
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`order-status-${selection.id}`}
              className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
            >
              Status
            </label>
            <select
              id={`order-status-${selection.id}`}
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full sm:w-48 px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase"
            >
              <Save size={13} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

export function OrdersTab() {
  const { data: selections = [], isLoading } = useListSelectionsSession();
  const [annotations, setAnnotations] = useState<AnnotationsMap>({});

  useEffect(() => {
    setAnnotations(loadAnnotations());
  }, []);

  function handleSave(id: string, annotation: OrderAnnotation) {
    const updated = { ...annotations, [id]: annotation };
    setAnnotations(updated);
    saveAnnotations(updated);
    toast.success("Order updated");
  }

  function getAnnotation(id: string): OrderAnnotation {
    return (
      annotations[id] ?? {
        orderName: "",
        orderDate: "",
        status: "New Request",
      }
    );
  }

  const sorted = sortSelections(selections, annotations);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl text-foreground">Orders</h2>
          {selections.length > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold text-ivory font-body text-xs font-semibold">
              {selections.length}
            </span>
          )}
        </div>
        <p className="font-body text-xs text-muted-foreground hidden sm:block">
          Add internal names, delivery dates, and statuses to each order.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : selections.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-sm">
          <div className="text-4xl mb-4">📋</div>
          <p className="font-display text-xl text-muted-foreground mb-2">
            No orders yet
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-xs mx-auto">
            When customers select a design, their requests will appear here for
            you to manage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((sel) => (
            <OrderCard
              key={sel.id.toString()}
              selection={sel}
              annotation={getAnnotation(sel.id.toString())}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
