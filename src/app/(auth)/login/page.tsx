import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <Card className="glass-card border-border/60">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
        <CardDescription>Access your workspace with email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href={ROUTES.register}
            className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
