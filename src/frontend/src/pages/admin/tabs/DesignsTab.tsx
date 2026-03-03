import { HttpAgent } from "@icp-sdk/core/agent";
import {
  CheckCircle2,
  Edit3,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Design } from "../../../backend.d";
import { Switch } from "../../../components/ui/switch";
import { loadConfig } from "../../../config";
import { useAdminSessionContext } from "../../../contexts/AdminSessionContext";
import { useInternetIdentity } from "../../../hooks/useInternetIdentity";
import {
  useCreateDesignSession,
  useDeleteDesignSession,
  useListCategories,
  useListDesigns,
  useUpdateDesignSession,
} from "../../../hooks/useQueries";
import { StorageClient } from "../../../utils/StorageClient";
import { getShowPrice, setShowPrice } from "../../../utils/designShowPrice";

interface DesignForm {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  videoUrl: string;
  showPrice: boolean;
}

const emptyForm: DesignForm = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  videoUrl: "",
  showPrice: true,
};

export function DesignsTab() {
  const { sessionToken } = useAdminSessionContext();
  const { identity } = useInternetIdentity();
  const { data: designs = [], isLoading } = useListDesigns();
  const { data: categories = [] } = useListCategories();
  const createMut = useCreateDesignSession();
  const updateMut = useUpdateDesignSession();
  const deleteMut = useDeleteDesignSession();

  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState<DesignForm>(emptyForm);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [editForm, setEditForm] = useState<DesignForm>(emptyForm);

  // Upload state for new form
  const [newUploadProgress, setNewUploadProgress] = useState<number | null>(
    null,
  );
  const [newUploadFilename, setNewUploadFilename] = useState<string>("");

  // Upload state for edit form
  const [editUploadProgress, setEditUploadProgress] = useState<number | null>(
    null,
  );
  const [editUploadFilename, setEditUploadFilename] = useState<string>("");

  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  function getCategoryName(id: bigint) {
    return categories.find((c) => c.id === id)?.name || id.toString();
  }

  async function createStorageClient(): Promise<StorageClient> {
    const config = await loadConfig();
    const agent = new HttpAgent({
      identity: identity ?? undefined,
      host: config.backend_host,
    });
    if (config.backend_host?.includes("localhost")) {
      await agent.fetchRootKey().catch(console.warn);
    }
    return new StorageClient(
      "designs",
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );
  }

  async function handleVideoUpload(
    file: File,
    setProgress: (p: number | null) => void,
    setFilename: (f: string) => void,
    onUrl: (url: string) => void,
  ) {
    setFilename(file.name);
    setProgress(0);
    try {
      const storageClient = await createStorageClient();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setProgress(pct),
      );
      const url = await storageClient.getDirectURL(hash);
      onUrl(url);
      setProgress(100);
      toast.success("Video uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Video upload failed");
      setProgress(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.categoryId) return;
    try {
      const created = await createMut.mutateAsync({
        sessionToken,
        categoryId: BigInt(newForm.categoryId),
        name: newForm.name.trim(),
        description: newForm.description.trim(),
        price: newForm.price.trim(),
        videoUrl: newForm.videoUrl.trim(),
      });
      // Save showPrice for the new design
      if (created && "id" in created) {
        setShowPrice((created as Design).id.toString(), newForm.showPrice);
      }
      toast.success("Design created");
      setNewForm(emptyForm);
      setNewUploadProgress(null);
      setNewUploadFilename("");
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
      setShowPrice(editId.toString(), editForm.showPrice);
      toast.success("Design updated");
      setEditId(null);
      setEditUploadProgress(null);
      setEditUploadFilename("");
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
    setEditUploadProgress(null);
    setEditUploadFilename(d.videoUrl ? "Existing video" : "");
    setEditForm({
      categoryId: d.categoryId.toString(),
      name: d.name,
      description: d.description,
      price: d.price,
      videoUrl: d.videoUrl,
      showPrice: getShowPrice(d.id.toString()),
    });
  }

  const VideoUploadField = ({
    currentUrl,
    uploadProgress,
    uploadFilename,
    fileInputRef,
    onFileSelect,
    fieldId,
  }: {
    currentUrl: string;
    uploadProgress: number | null;
    uploadFilename: string;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileSelect: (file: File) => void;
    fieldId: string;
  }) => (
    <div>
      <label
        htmlFor={fieldId}
        className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
      >
        Design Video
      </label>

      <div className="space-y-2">
        {/* Upload button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="design.upload_button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-sm border border-gold/40 bg-gold/5 text-gold hover:bg-gold/10 font-body text-xs tracking-widest uppercase transition-colors"
          >
            <Upload size={13} />
            {uploadFilename ? "Change Video" : "Upload Video"}
          </button>
          {uploadFilename && uploadProgress === 100 && (
            <span className="flex items-center gap-1.5 font-body text-xs text-green-600">
              <CheckCircle2 size={13} />
              {uploadFilename}
            </span>
          )}
          {uploadFilename && uploadProgress === null && (
            <span className="font-body text-xs text-muted-foreground truncate max-w-36">
              📹 {uploadFilename}
            </span>
          )}
        </div>

        {/* Hidden file input */}
        <input
          id={fieldId}
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />

        {/* Progress bar */}
        {uploadProgress !== null && uploadProgress < 100 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-muted-foreground">
                Uploading...
              </span>
              <span className="font-body text-xs text-gold">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Current video URL display (when editing existing) */}
        {currentUrl &&
          uploadProgress === null &&
          uploadFilename === "Existing video" && (
            <p className="font-body text-xs text-muted-foreground">
              Current video saved. Upload a new file to replace it.
            </p>
          )}
      </div>
    </div>
  );

  const DesignFormFields = ({
    form,
    setForm,
    onSubmit,
    isPending,
    onCancel,
    title,
    uploadProgress,
    uploadFilename,
    fileInputRef,
    onVideoUpload,
    fieldPrefix,
  }: {
    form: DesignForm;
    setForm: (f: DesignForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    onCancel: () => void;
    title: string;
    uploadProgress: number | null;
    uploadFilename: string;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onVideoUpload: (file: File) => void;
    fieldPrefix: string;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`${fieldPrefix}-category`}
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Category *
          </label>
          <select
            id={`${fieldPrefix}-category`}
            data-ocid="design.select"
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
            htmlFor={`${fieldPrefix}-name`}
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Design Name *
          </label>
          <input
            id={`${fieldPrefix}-name`}
            data-ocid="design.input"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Golden Rose Wedding"
            className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            required
          />
        </div>

        {/* Price field with Show Price toggle */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor={`${fieldPrefix}-price`}
              className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
            >
              Price
            </label>
            <input
              id={`${fieldPrefix}-price`}
              data-ocid="design.price.input"
              type="text"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. $49"
              disabled={!form.showPrice}
              className="w-full px-3 py-2 rounded-sm border border-input bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* Show Price Toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id={`${fieldPrefix}-show-price`}
              data-ocid="design.price.switch"
              checked={form.showPrice}
              onCheckedChange={(checked) =>
                setForm({ ...form, showPrice: checked })
              }
            />
            <label
              htmlFor={`${fieldPrefix}-show-price`}
              className="font-body text-xs text-muted-foreground tracking-wide cursor-pointer select-none"
            >
              {form.showPrice ? (
                <span className="text-gold font-medium">
                  Show Price to Customers
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <EyeOff size={12} />
                  Price Hidden from Customers
                </span>
              )}
            </label>
          </div>
        </div>

        {/* Video upload field */}
        <VideoUploadField
          currentUrl={form.videoUrl}
          uploadProgress={uploadProgress}
          uploadFilename={uploadFilename}
          fileInputRef={fileInputRef}
          onFileSelect={onVideoUpload}
          fieldId={`${fieldPrefix}-video`}
        />

        <div className="md:col-span-2">
          <label
            htmlFor={`${fieldPrefix}-desc`}
            className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1 block"
          >
            Description
          </label>
          <textarea
            id={`${fieldPrefix}-desc`}
            data-ocid="design.textarea"
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
          data-ocid="design.submit_button"
          disabled={
            isPending || (uploadProgress !== null && uploadProgress < 100)
          }
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
          data-ocid="design.cancel_button"
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
          data-ocid="design.open_modal_button"
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
            onCancel={() => {
              setShowAdd(false);
              setNewUploadProgress(null);
              setNewUploadFilename("");
              setNewForm(emptyForm);
            }}
            title="New Design"
            uploadProgress={newUploadProgress}
            uploadFilename={newUploadFilename}
            fileInputRef={newFileInputRef}
            onVideoUpload={(file) =>
              handleVideoUpload(
                file,
                setNewUploadProgress,
                setNewUploadFilename,
                (url) => setNewForm((prev) => ({ ...prev, videoUrl: url })),
              )
            }
            fieldPrefix="new"
          />
        </div>
      )}

      {isLoading ? (
        <div
          className="flex items-center justify-center py-12"
          data-ocid="design.loading_state"
        >
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : designs.length === 0 ? (
        <div
          className="text-center py-16 border-2 border-dashed border-border rounded-sm"
          data-ocid="design.empty_state"
        >
          <p className="font-display text-xl text-muted-foreground mb-2">
            No designs yet
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Click "Add Design" to start building your collection.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="design.list">
          {designs.map((design: Design, index: number) => {
            const showPriceFlag = getShowPrice(design.id.toString());
            return (
              <div
                key={design.id.toString()}
                data-ocid={`design.item.${index + 1}`}
                className="card-luxury rounded-sm p-5"
              >
                {editId === design.id ? (
                  <DesignFormFields
                    form={editForm}
                    setForm={setEditForm}
                    onSubmit={handleUpdate}
                    isPending={updateMut.isPending}
                    onCancel={() => {
                      setEditId(null);
                      setEditUploadProgress(null);
                      setEditUploadFilename("");
                    }}
                    title={`Editing: ${design.name}`}
                    uploadProgress={editUploadProgress}
                    uploadFilename={editUploadFilename}
                    fileInputRef={editFileInputRef}
                    onVideoUpload={(file) =>
                      handleVideoUpload(
                        file,
                        setEditUploadProgress,
                        setEditUploadFilename,
                        (url) =>
                          setEditForm((prev) => ({ ...prev, videoUrl: url })),
                      )
                    }
                    fieldPrefix="edit"
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-display text-base font-semibold text-foreground">
                          {design.name}
                        </h3>
                        <span className="font-body text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                          {getCategoryName(design.categoryId)}
                        </span>
                        {!showPriceFlag && (
                          <span className="flex items-center gap-1 font-body text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            <EyeOff size={10} />
                            Price Hidden
                          </span>
                        )}
                      </div>
                      {design.description && (
                        <p className="font-body text-xs text-muted-foreground truncate mb-1">
                          {design.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        {design.price && showPriceFlag && (
                          <span className="flex items-center gap-1 font-body text-xs text-gold">
                            <Tag size={11} />
                            {design.price}
                          </span>
                        )}
                        {design.price && !showPriceFlag && (
                          <span className="flex items-center gap-1 font-body text-xs text-muted-foreground line-through">
                            <Tag size={11} />
                            {design.price}
                          </span>
                        )}
                        {design.videoUrl && (
                          <span className="font-body text-xs text-muted-foreground">
                            📹 Video attached
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        data-ocid={`design.edit_button.${index + 1}`}
                        onClick={() => startEdit(design)}
                        className="p-2 rounded-sm text-muted-foreground hover:text-gold hover:bg-gold/10 transition"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`design.delete_button.${index + 1}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
