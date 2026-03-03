import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Play, Tag } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useGetCategory, useListDesignsByCategory } from "../hooks/useQueries";
import { getShowPrice } from "../utils/designShowPrice";

export function CategoryDetailPage() {
  const { categoryId } = useParams({ from: "/categories/$categoryId" });
  const id = BigInt(categoryId);

  const { data: category, isLoading: catLoading } = useGetCategory(id);
  const { data: designs = [], isLoading: designsLoading } =
    useListDesignsByCategory(id);

  const isLoading = catLoading || designsLoading;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <main>
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 font-body text-xs text-ivory/50 hover:text-gold transition-colors tracking-widest uppercase mb-6"
            >
              <ArrowLeft size={14} />
              All Categories
            </Link>
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Collection
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-ivory font-light">
              {catLoading ? (
                <span className="opacity-40">Loading...</span>
              ) : (
                <>
                  {category?.name || "Category"}
                  <span className="gold-text-gradient italic font-semibold">
                    {" "}
                    Designs
                  </span>
                </>
              )}
            </h1>
            {category?.description && (
              <p className="font-body text-ivory/70 mt-4 text-lg max-w-2xl">
                {category.description}
              </p>
            )}
            <div className="divider-gold mt-6 opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
                <div key={key} className="rounded-sm overflow-hidden">
                  <div className="h-56 bg-ivory-mid animate-pulse" />
                  <div className="p-6 bg-card">
                    <div className="h-5 w-40 bg-ivory-mid animate-pulse rounded mb-2" />
                    <div className="h-4 w-28 bg-ivory-mid animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : designs.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="font-display text-2xl text-foreground mb-2">
                No Designs Yet
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Beautiful designs for this category are coming soon.
              </p>
              <Link
                to="/categories"
                className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-sm font-body text-sm tracking-widest uppercase"
              >
                <ArrowLeft size={14} />
                Browse Other Categories
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {designs.map((design) => (
                <motion.div key={design.id.toString()} variants={itemVariants}>
                  <article className="card-luxury rounded-sm overflow-hidden flex flex-col transition-all duration-300 group h-full">
                    {/* Video / Preview */}
                    <div className="relative bg-foreground/5 overflow-hidden">
                      {design.videoUrl ? (
                        design.videoUrl.includes("youtube.com") ||
                        design.videoUrl.includes("youtu.be") ? (
                          <div className="relative aspect-video">
                            <iframe
                              src={design.videoUrl
                                .replace("watch?v=", "embed/")
                                .replace("youtu.be/", "youtube.com/embed/")}
                              title={design.name}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-[9/16]">
                            <video
                              src={design.videoUrl}
                              controls
                              loop
                              muted
                              className="w-full h-full object-cover"
                            >
                              <track kind="captions" />
                            </video>
                          </div>
                        )
                      ) : (
                        <div className="aspect-[9/16] flex items-center justify-center bg-gradient-to-br from-ivory-dark to-ivory-mid">
                          <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <Play size={20} className="text-gold ml-0.5" />
                            </div>
                            <span className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                              Preview Available Soon
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Design Info */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                        {design.name}
                      </h3>
                      {design.description && (
                        <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {design.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        {getShowPrice(design.id.toString()) ? (
                          <div className="flex items-center gap-1.5">
                            <Tag size={13} className="text-gold" />
                            <span className="font-display text-lg font-semibold text-gold">
                              {design.price || "Contact for Price"}
                            </span>
                          </div>
                        ) : (
                          <div />
                        )}
                        <Link
                          to="/design/$designId/select"
                          params={{ designId: design.id.toString() }}
                          search={{ name: design.name }}
                          className="btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase"
                        >
                          Select Design
                        </Link>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
