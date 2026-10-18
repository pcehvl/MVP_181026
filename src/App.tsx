import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Product-neutral application shell.
 *
 * This component exists only to verify the technical stack (React, TypeScript,
 * Vite, Tailwind CSS, shadcn/ui, Lucide). It deliberately contains no product
 * functionality, copy, schema or fixtures. Product scope is defined separately
 * by the Product Owner through the product artifacts in `product/`.
 */
function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" />
        <span className="text-sm font-medium">Harness ready</span>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight">Application Shell</h1>

      <p className="max-w-md text-balance text-muted-foreground">
        Product-neutral technical shell used to verify the development stack.
        Product scope, requirements and backlog are managed separately and are
        not defined by this shell.
      </p>

      <Button type="button" className="mt-2">
        Stack verified
        <ArrowRight className="ml-1" aria-hidden="true" data-icon="inline-end" />
      </Button>
    </main>
  )
}

export default App
