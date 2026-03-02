import { Edit3, Loader2, Plus, Save, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Design } from "../../../backend.d";
import { useAdminSessionContext } from "../../../contexts/AdminSessionContext";
import {
  useCreateDesignSession,
  useDeleteDesignSession,
  useListCategories,
  useListDesigns,
  useUpdateDesignSession,
} from "../../../hooks/useQueries";

interface DesignForm {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  videoUrl: string;
}

const emptyForm: DesignForm = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  videoUrl: "",
};

export function DesignsTab() {
  const { sessionToken } = useAdminSessionContext();
  const { data: designs = [], isLoading } = useListDesigns();
  const { data: categories = [] } = useListCategories();
  const createMut = useCreateDesignSession();
  const updateMut = useUpdateDesignSession();
  const deleteMut = useDeleteDesignSession();

  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState<DesignForm>(emptyForm);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [editForm, setEditForm] = useState<DesignForm>(emptyForm);

  function getCategoryName(id: bigint) {
    return categories.find((c) => c.id === id)?.name || id.toString();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.categoryId) return;
    try {
      await createMut.mutateAsync({
        sessionToken,
        categoryId: BigInt(newForm.categoryId),
        name: newForm.name.trim(),
        description: newForm.description.trim(),
        price: newForm.price.trim(),
        videoUrl: newForm.videoUrl.trim(),
      });
      toast.success("Design created");
      setNewForm(emptyForm);
      setShowAdd(false);
    } catch {
      toast.error("Failed to create design");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    try {
      await updateMut.mutateAsync({
        sessionToken,
        id: editId,
        categoryId: BigInt(editForm.categoryId),
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price: editForm.price.trim(),
        videoUrl: editForm.videoUrl.trim(),
      });
      toast.success("Design updated");
      setEditId(null);
    } catch {
      toast.error("Failed to update design");
    }
  }

  async function handleDelete(id: bigint) {
    if (!window.confirm("Delete this design?")) return;
    try {
      await deleteMut.mutateAsync({ sessionToken, id });
      toast.success("Design deleted");
    } catch {
      toast.error("Failed to delete design");
    }
  }

  function startEdit(d: Design) {
    setEditId(d.id);
    setEditForm({
      categoryId: d.categoryId.toString(),
      name: d.name,
      description: d.description,
      price: d.price,
      videoUrl: d.videoUrl,
    });
  }

  const DesignFormFields = ({
    form,
    setForm,
    onSubmit,
    isPending,
    onCancel,
    title,
  }: {
    form: DesignForm;
    setForm: (f: DesignForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    onCancel: () => void;
    title: string;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="df-category"
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Category *
          </label>
          <select
            id="df-category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id.toString()} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="df-name"
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Design Name *
          </label>
          <input
            id="df-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Golden Rose Wedding"
            className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            required
          />
        </div>
        <div>
          <label
            htmlFor="df-price"
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Price
          </label>
          <input
            id="df-price"
            type="text"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. $49"
            className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label
            htmlFor="df-video"
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Video URL
          </label>
          <input
            id="df-video"
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://youtube.com/..."
            className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="df-desc"
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Description
          </label>
          <textarea
            id="df-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe this design..."
            rows={2}
            className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">Designs</h2>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase"
        >
          <Plus size={14} />
          Add Design
        </button>
      </div>

      {showAdd && (
        <div className="card-luxury rounded-sm p-6 mb-6">
          <DesignFormFields
            form={newForm}
            setForm={setNewForm}
            onSubmit={handleCreate}
            isPending={createMut.isPending}
            onCancel={() => setShowAdd(false)}
            title="New Design"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-sm">
          <p className="font-display text-xl text-muted-foreground mb-2">
            No designs yet
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Click "Add Design" to start building your collection.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {designs.map((design: Design) => (
            <div
              key={design.id.toString()}
              className="card-luxury rounded-sm p-5"
            >
              {editId === design.id ? (
                <DesignFormFields
                  form={editForm}
                  setForm={setEditForm}
                  onSubmit={handleUpdate}
                  isPending={updateMut.isPending}
                  onCancel={() => setEditId(null)}
                  title={`Editing: ${design.name}`}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {design.name}
                      </h3>
                      <span className="font-body text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                        {getCategoryName(design.categoryId)}
                      </span>
                    </div>
                    {design.description && (
                      <p className="font-body text-xs text-muted-foreground truncate mb-1">
                        {design.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      {design.price && (
                        <span className="flex items-center gap-1 font-body text-xs text-gold">
                          <Tag size={11} />
                          {design.price}
                        </span>
                      )}
                      {design.videoUrl && (
                        <span className="font-body text-xs text-muted-foreground truncate max-w-48">
                          📹 {design.videoUrl}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(design)}
                      className="p-2 rounded-sm text-muted-foreground hover:text-gold hover:bg-gold/10 transition"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(design.id)}
                      disabled={deleteMut.isPending}
                      className="p-2 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
