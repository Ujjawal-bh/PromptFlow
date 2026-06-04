import Link from "next/link";
import { RegisterForm } from "@/features/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <Card className="glass-card border-border/60">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">Create account</CardTitle>
        <CardDescription>Start organizing prompts across projects in minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={ROUTES.login}
            className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
