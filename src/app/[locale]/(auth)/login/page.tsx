'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(t('errors.invalidCredentials'));
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('loginTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('loginSubtitle')}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('password')}</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-11"
          />
        </div>

        <Button type="submit" className="h-11 w-full bg-[#FC4C02] text-[15px] text-white hover:bg-[#e04400]" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('login')
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/signup" className="font-medium text-primary transition-colors hover:text-primary/80">
          {t('signup')}
        </Link>
      </div>
    </div>
  );
}
