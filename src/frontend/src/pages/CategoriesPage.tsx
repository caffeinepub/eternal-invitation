import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useListCategories } from "../hooks/useQueries";

const categoryImages: Record<string, string> = {
  wedding: "💍",
  engagement: "💑",
  birthday: "🎂",
  "baby shower": "👶",
  anniversary: "🌹",
  corporate: "🏛️",
};

function getCategoryEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(categoryImages)) {
    if (lower.includes(key)) return emoji;
  }
  return "✨";
}

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useListCategories();

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
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Collections
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-ivory font-light mb-4">
              Invitation{" "}
              <span className="gold-text-gradient italic font-semibold">
                Categories
              </span>
            </h1>
            <div className="divider-gold mt-6 mb-6 opacity-60" />
            <p className="font-body text-ivory/70 text-lg max-w-xl mx-auto">
              Explore our curated collections, crafted for every beautiful
              occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
                <div
                  key={key}
                  className="h-64 rounded-sm bg-ivory-mid animate-pulse"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-display text-2xl text-foreground mb-2">
                Categories Coming Soon
              </h3>
              <p className="font-body text-muted-foreground">
                We're preparing beautiful collections for you.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map((cat) => (
                <motion.div key={cat.id.toString()} variants={itemVariants}>
                  <Link
                    to="/categories/$categoryId"
                    params={{ categoryId: cat.id.toString() }}
                    className="group block h-full"
                  >
                    <article className="card-luxury rounded-sm overflow-hidden h-full flex flex-col transition-all duration-300">
                      {/* Card Top — cover image (9:16) or emoji fallback */}
                      {cat.coverImage ? (
                        <div className="aspect-[9/16] overflow-hidden w-full">
                          <img
                            src={cat.coverImage}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 p-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-ivory to-ivory-mid">
                          <span className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                            {getCategoryEmoji(cat.name)}
                          </span>
                        </div>
                      )}
                      {/* Name + description below image/emoji */}
                      <div className="px-6 pt-5 pb-3 text-center">
                        <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                          {cat.name}
                        </h2>
                        {cat.description && (
                          <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      {/* Card Footer */}
                      <div className="px-8 py-4 border-t border-border flex items-center justify-between mt-auto">
                        <span className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                          View Designs
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-gold group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
