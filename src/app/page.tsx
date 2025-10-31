import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-4xl flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Next.js + Radix + shadcn/ui
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            A modern stack with beautiful, accessible components
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Next.js 15</CardTitle>
              <CardDescription>
                The React framework for production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Built with App Router, TypeScript, and Tailwind CSS for a modern development experience.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radix UI</CardTitle>
              <CardDescription>
                Unstyled, accessible components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Low-level UI component library with a focus on accessibility, customization, and developer experience.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Explore Primitives
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui</CardTitle>
              <CardDescription>
                Beautifully designed components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Copy and paste components built with Radix UI and Tailwind CSS. Fully customizable and accessible.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Components
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Ready to build something amazing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Start building your design system with this powerful stack. All components are ready to use.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button className="flex-1">Get Started</Button>
              <Button variant="secondary" className="flex-1">
                Documentation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
