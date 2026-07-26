import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-neutral-400">Pagina nao encontrada.</p>
      <Link
        href="/pt"
        className="mt-8 rounded-full bg-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-300"
      >
        Ir para o inicio
      </Link>
    </div>
  );
}