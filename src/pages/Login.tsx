import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { usePreferencesStore, type UserRole } from "@/store/preferences";

const roles: { value: UserRole; label: string; helper: string }[] = [
  { value: "admin", label: "Admin", helper: "Configuração e segurança" },
  { value: "gerente", label: "Gerente", helper: "KPIs, aprovações e NF-e" },
  { value: "vendedor", label: "Vendedor", helper: "Pedidos e follow-up" },
  { value: "estoquista", label: "Estoquista", helper: "Entradas e contagens" },
];

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentRole } = usePreferencesStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("gerente");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    toast({
      title: "Login realizado",
      description: "Bem-vindo ao ERP João e Maria.",
    });

    setCurrentRole(role);
    navigate(`/${role}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/60 via-background to-primary/40 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-2 items-center">
        <div className="hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 text-primary px-4 py-2 text-sm font-semibold shadow-sm">
            <Sparkles className="h-4 w-4" />
            ERP João e Maria
          </div>
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Uma experiência por papel: admin, gerente, vendedor e estoquista.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Painéis responsivos, identidade mint & blush e fluxo pronto para integração com
            APIs de NF-e, estoque e vendas. Navegue por módulos sem perder contexto.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((item) => (
              <div
                key={item.value}
                className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm"
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-lg shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle>Acessar</CardTitle>
            <CardDescription>
              Use qualquer e-mail/senha para explorar o ERP João e Maria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@joaoemaria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label>Entrar como</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      className={`rounded-lg border px-3 py-2 text-left transition-all ${
                        role === item.value
                          ? "border-primary bg-primary/15 shadow-sm"
                          : "border-muted bg-background hover:border-primary/50"
                      }`}
                      aria-pressed={role === item.value}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                        {role === item.value && <ShieldCheck className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.helper}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo: qualquer e-mail e senha funcionam.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
