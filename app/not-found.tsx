import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center pb-24 pt-40">
      <div className="container-page">
        <p className="label text-berry">404</p>
        <h1 className="mt-6 max-w-2xl font-display text-display text-ink">This page does not exist.</h1>
        <p className="mt-6 max-w-lg text-lead text-body">The link may be old, or the address mistyped.</p>
        <div className="mt-10">
          <ButtonLink href="/" arrow>
            Back to the home page
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
