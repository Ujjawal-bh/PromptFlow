import { requireUser } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSettingsForm } from "@/features/settings/profile-settings-form";
import { PasswordSettingsForm } from "@/features/settings/password-settings-form";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageHeader title="Settings" description="Manage your profile and account security." />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Signed in as {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSettingsForm defaultName={user.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Password</CardTitle>
          <CardDescription>Use a strong passphrase and store it in a password manager.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
