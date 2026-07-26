import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/Button";
import { StlModelsShowcase } from "@/components/StlModelsShowcase";
import { FootwearShowcase, type FootwearProduct } from "@/components/FootwearShowcase";
import { getProject, projects, toolProjects } from "@/data/projects";
import {
  FOOTWEAR_PRODUCT_IMAGES,
  INFLATABLE_DESIGN_ITEM_IMAGES,
  PRODUCT_DESIGN_ITEM_IMAGES,
  PROJECT_COVERS,
  PROJECTS_WITH_EXAMPLES,
  PROJECTS_WITH_FOOTWEAR_GALLERY,
  PROJECTS_WITH_INFLATABLE_GALLERY,
  PROJECTS_WITH_PRODUCT_GALLERY,
  WEB_EXAMPLE_GROUP_IMAGES,
} from "@/data/project-media";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

type WebExample = {
  title: string;
  description: string;
};

type ExampleGroup = {
  label: string;
  examples: WebExample[];
};

export function generateStaticParams() {
  return [...projects, ...toolProjects].map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectDetail slug={slug} />;
}

function ProjectDetail({ slug }: { slug: string }) {
  const t = useTranslations(`projects.items.${slug}`);
  const tCommon = useTranslations("common");

  const title = t("title");
  const description = t("description");
  const category = t("category");
  const cover = PROJECT_COVERS[slug];
  const showExamples = (PROJECTS_WITH_EXAMPLES as readonly string[]).includes(slug);
  const showFootwearGallery = (PROJECTS_WITH_FOOTWEAR_GALLERY as readonly string[]).includes(
    slug,
  );
  const showProductGallery = (PROJECTS_WITH_PRODUCT_GALLERY as readonly string[]).includes(slug);
  const showInflatableGallery = (PROJECTS_WITH_INFLATABLE_GALLERY as readonly string[]).includes(
    slug,
  );

  let exampleGroups: ExampleGroup[] = [];
  let examplesTitle = "";
  let footwearProducts: FootwearProduct[] = [];
  let productDesignProducts: FootwearProduct[] = [];
  let inflatableProducts: FootwearProduct[] = [];
  let galleryTitle = "";
  let gallerySubtitle = "";

  if (showExamples) {
    examplesTitle = t("examplesTitle");
    exampleGroups = t.raw("exampleGroups") as ExampleGroup[];
  }

  if (showFootwearGallery) {
    galleryTitle = t("galleryTitle");
    gallerySubtitle = t("gallerySubtitle");
    footwearProducts = t.raw("products") as FootwearProduct[];
  }

  if (showProductGallery) {
    galleryTitle = t("galleryTitle");
    gallerySubtitle = t("gallerySubtitle");
    productDesignProducts = t.raw("products") as FootwearProduct[];
  }

  if (showInflatableGallery) {
    galleryTitle = t("galleryTitle");
    gallerySubtitle = t("gallerySubtitle");
    inflatableProducts = t.raw("products") as FootwearProduct[];
  }

  const hasExamples = showExamples && exampleGroups.length > 0;
  const hasFootwearGallery = showFootwearGallery && footwearProducts.length > 0;
  const hasProductGallery = showProductGallery && productDesignProducts.length > 0;
  const hasInflatableGallery = showInflatableGallery && inflatableProducts.length > 0;

  return (
    <article className="mx-auto w-full min-w-0 max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/projetos"
        className="mb-8 inline-flex text-sm text-text-muted transition-colors hover:text-text"
      >
        ← {tCommon("backToProjects")}
      </Link>

      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand-light">
        {category}
      </span>

      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
        {title}
      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-muted">{description}</p>

      {cover && (
        <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl border border-border shadow-xl shadow-black/30 ring-1 ring-white/5">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
      )}

      {slug === "3d-models" && <StlModelsShowcase />}

      {hasFootwearGallery && (
        <FootwearShowcase
          title={galleryTitle}
          subtitle={gallerySubtitle}
          products={footwearProducts}
          imagesById={FOOTWEAR_PRODUCT_IMAGES}
        />
      )}

      {hasProductGallery && (
        <FootwearShowcase
          title={galleryTitle}
          subtitle={gallerySubtitle}
          products={productDesignProducts}
          imagesById={PRODUCT_DESIGN_ITEM_IMAGES}
        />
      )}

      {hasInflatableGallery && (
        <FootwearShowcase
          title={galleryTitle}
          subtitle={gallerySubtitle}
          products={inflatableProducts}
          imagesById={INFLATABLE_DESIGN_ITEM_IMAGES}
        />
      )}

      {hasExamples ? (
        <div className="mt-12 space-y-12">
          <h2 className="font-display text-xl font-semibold text-text">
            {examplesTitle}
          </h2>
          {exampleGroups.map((group, groupIndex) => (
            <div key={group.label}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
                <h3 className="shrink-0 text-sm font-medium tracking-wide text-accent uppercase">
                  {group.label}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-l from-accent/50 to-transparent" />
              </div>
              <ul className="grid min-w-0 gap-6 sm:grid-cols-2">
                {group.examples.map((example, exampleIndex) => {
                  const image =
                    slug === "web-design"
                      ? WEB_EXAMPLE_GROUP_IMAGES[groupIndex]?.[exampleIndex]
                      : undefined;

                  return (
                    <li
                      key={example.title}
                      className="card-shine min-w-0 overflow-hidden rounded-2xl border border-border bg-surface-elevated"
                    >
                      {image && (
                        <div className="relative aspect-[3/2] w-full">
                          <Image
                            src={image}
                            alt={example.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-medium text-text">{example.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-text-muted">
                          {example.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !cover &&
        !hasFootwearGallery &&
        !hasProductGallery &&
        !hasInflatableGallery &&
        slug !== "3d-models" && (
          <div className="mt-10 flex aspect-video items-center justify-center rounded-2xl border border-border bg-surface-elevated">
            <p className="text-sm text-text-muted">
              {tCommon("comingSoon")} — {tCommon("projectImagesSoon")}
            </p>
          </div>
        )
      )}

      <div className="mt-10">
        <Button href="/contato">{tCommon("getInTouch")}</Button>
      </div>
    </article>
  );
}
