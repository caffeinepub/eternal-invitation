import { Edit3, Loader2, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "../../../backend.d";
import { useAdminSessionContext } from "../../../contexts/AdminSessionContext";
import {
  useCreateCategorySession,
  useDeleteCategorySession,
  useInitializeSeedDataSession,
  useListCategories,
  useUpdateCategorySession,
} from "../../../hooks/useQueries";

interface EditState {
  id: bigint;
  name: string;
  description: string;
  displayOrder: string;
  coverImage: string;
}

const categoryEmojiMap: Record<string, string> = {
  wedding: "💍",
  engagement: "💑",
  birthday: "🎂",
  "baby shower": "👶",
  anniversary: "🌹",
  corporate: "🏛️",
};

function getCategoryEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(categoryEmojiMap)) {
    if (lower.includes(key)) return emoji;
  }
  return "✨";
}

export function CategoriesTab() {
  const { sessionToken } = useAdminSessionContext();
  const { data: categories = [], isLoading } = useListCategories();
  const createMut = useCreateCategorySession();
  const updateMut = useUpdateCategorySession();
  const deleteMut = useDeleteCategorySession();
  const seedMut = useInitializeSeedDataSession();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCoverImage, setNewCoverImage] = useState("");
  const [editState, setEditState] = useState<EditState | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const maxOrder = categories.reduce(
        (m, c) => (c.displayOrder > m ? c.displayOrder : m),
        BigInt(0),
      );
      await createMut.mutateAsync({
        sessionToken,
        name: newName.trim(),
        description: newDesc.trim(),
        displayOrder: maxOrder + BigInt(1),
        coverImage: newCoverImage.trim(),
      });
      toast.success("Category created");
      setNewName("");
      setNewDesc("");
      setNewCoverImage("");
      setShowAdd(false);
    } catch {
      toast.error("Failed to create category");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editState) return;
    try {
      await updateMut.mutateAsync({
        sessionToken,
        id: editState.id,
        name: editState.name.trim(),
        description: editState.description.trim(),
        displayOrder: BigInt(editState.displayOrder || "0"),
        coverImage: editState.coverImage.trim(),
      });
      toast.success("Category updated");
      setEditState(null);
    } catch {
      toast.error("Failed to update category");
    }
  }

  async function handleDelete(id: bigint) {
    if (
      !window.confirm(
        "Delete this category? All its designs will remain but be unassigned.",
      )
    )
      return;
    try {
      await deleteMut.mutateAsync({ sessionToken, id });
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">Categories</h2>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase"
        >
          <Plus size={14} />
          Add New Section
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <form
          onSubmit={handleCreate}
          className="card-luxury rounded-sm p-6 mb-6 border-l-4 border-l-gold/60"
        >
          <h3 className="font-display text-lg text-foreground mb-1">
            Add New Section
          </h3>
          <p className="font-body text-xs text-muted-foreground mb-5">
            Each section is a category that groups invitation designs together.
          </p>

          {/* Cover Image — first & most prominent */}
          <div className="mb-5 p-4 bg-ivory-mid/60 rounded-sm border border-gold/20">
            <label
              htmlFor="cat-cover"
              className="font-body text-sm font-semibold text-foreground tracking-wide mb-1 block"
            >
              Section Cover Image
              <span className="ml-2 font-normal text-xs text-gold normal-case">
                9:16 portrait · paste an image URL
              </span>
            </label>
            <input
              id="cat-cover"
              type="url"
              value={newCoverImage}
              onChange={(e) => setNewCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            {newCoverImage && (
              <div className="mt-3" style={{ maxWidth: "120px" }}>
                <p className="font-body text-xs text-muted-foreground mb-1">
                  Preview
                </p>
                <div className="aspect-[9/16] overflow-hidden rounded-sm border-2 border-gold/40 shadow-sm">
                  <img
                    src={newCoverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            {!newCoverImage && (
              <div
                className="mt-3 flex items-center justify-center rounded-sm border-2 border-dashed border-gold/30 bg-ivory text-muted-foreground"
                style={{ width: "120px", height: "213px" }}
              >
                <span className="font-body text-xs text-center px-2">
                  Cover image preview
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="cat-name"
                className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
              >
                Section Name *
              </label>
              <input
                id="cat-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Wedding Invitations"
                className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cat-desc"
                className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
              >
                Description
              </label>
              <input
                id="cat-desc"
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Short description"
                className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMut.isPending}
              className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase disabled:opacity-60"
            >
              {createMut.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="btn-outline-gold flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-sm">
          <p className="font-display text-xl text-muted-foreground mb-2">
            No categories yet
          </p>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Click "Add New Section" to create one, or seed the 7 default
            invitation categories.
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await seedMut.mutateAsync(sessionToken);
                toast.success("Default categories and sample designs added!");
              } catch {
                toast.error(
                  "Failed to seed categories. Please add them manually.",
                );
              }
            }}
            disabled={seedMut.isPending}
            className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-body text-xs tracking-widest uppercase disabled:opacity-60"
          >
            {seedMut.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Seed Default Categories
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat: Category) => (
            <div key={cat.id.toString()} className="card-luxury rounded-sm p-5">
              {editState?.id === cat.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  {/* Cover Image — first & prominent */}
                  <div className="p-4 bg-ivory-mid/60 rounded-sm border border-gold/20">
                    <label
                      htmlFor="edit-cat-cover"
                      className="font-body text-sm font-semibold text-foreground tracking-wide mb-1 block"
                    >
                      Section Cover Image
                      <span className="ml-2 font-normal text-xs text-gold normal-case">
                        9:16 portrait · paste an image URL
                      </span>
                    </label>
                    <input
                      id="edit-cat-cover"
                      type="url"
                      value={editState.coverImage}
                      onChange={(e) =>
                        setEditState(
                          (prev) =>
                            prev && { ...prev, coverImage: e.target.value },
                        )
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    {editState.coverImage ? (
                      <div className="mt-3" style={{ maxWidth: "120px" }}>
                        <p className="font-body text-xs text-muted-foreground mb-1">
                          Preview
                        </p>
                        <div className="aspect-[9/16] overflow-hidden rounded-sm border-2 border-gold/40 shadow-sm">
                          <img
                            src={editState.coverImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="mt-3 flex items-center justify-center rounded-sm border-2 border-dashed border-gold/30 bg-ivory text-muted-foreground"
                        style={{ width: "120px", height: "213px" }}
                      >
                        <span className="font-body text-xs text-center px-2">
                          Cover image preview
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label
                        htmlFor={`edit-name-${editState.id}`}
                        className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
                      >
                        Section Name *
                      </label>
                      <input
                        id={`edit-name-${editState.id}`}
                        type="text"
                        value={editState.name}
                        onChange={(e) =>
                          setEditState(
                            (prev) => prev && { ...prev, name: e.target.value },
                          )
                        }
                        className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-desc-${editState.id}`}
                        className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
                      >
                        Description
                      </label>
                      <input
                        id={`edit-desc-${editState.id}`}
                        type="text"
                        value={editState.description}
                        onChange={(e) =>
                          setEditState(
                            (prev) =>
                              prev && {
                                ...prev,
                                description: e.target.value,
                              },
                          )
                        }
                        placeholder="Description"
                        className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-order-${editState.id}`}
                        className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
                      >
                        Display Order
                      </label>
                      <input
                        id={`edit-order-${editState.id}`}
                        type="number"
                        value={editState.displayOrder}
                        onChange={(e) =>
                          setEditState(
                            (prev) =>
                              prev && {
                                ...prev,
                                displayOrder: e.target.value,
                              },
                          )
                        }
                        placeholder="Display order"
                        className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updateMut.isPending}
                      className="btn-gold flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-body text-xs tracking-widest uppercase disabled:opacity-60"
                    >
                      {updateMut.isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditState(null)}
                      className="btn-outline-gold flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-body text-xs tracking-widest uppercase"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {cat.coverImage ? (
                      <div
                        className="flex-shrink-0 overflow-hidden rounded-sm border border-border"
                        style={{ width: "48px", height: "64px" }}
                      >
                        <img
                          src={cat.coverImage}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-sm bg-ivory-mid border border-border"
                        style={{ width: "48px", height: "64px" }}
                      >
                        <span className="text-2xl">
                          {getCategoryEmoji(cat.name)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="font-body text-xs text-muted-foreground mt-0.5 truncate">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-muted-foreground">
                      Order: {cat.displayOrder.toString()}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditState({
                          id: cat.id,
                          name: cat.name,
                          description: cat.description,
                          displayOrder: cat.displayOrder.toString(),
                          coverImage: cat.coverImage,
                        })
                      }
                      className="p-2 rounded-sm text-muted-foreground hover:text-gold hover:bg-gold/10 transition"
                      aria-label="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteMut.isPending}
                      className="p-2 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition disabled:opacity-50"
                      aria-label="Delete"
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
