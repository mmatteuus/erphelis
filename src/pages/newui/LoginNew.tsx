import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Página de login com validação básica e placeholders de integração.
export default function LoginNew() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const validate = () => {
    let ok = true;
    setErrorEmail(null);
    setErrorPassword(null);
    if (!email || !email.includes("@")) {
      setErrorEmail("Informe um e-mail válido");
      ok = false;
    }
    if (!password) {
      setErrorPassword("Senha é obrigatória");
      ok = false;
    }
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFeedback(null);
    // Integração de API: autenticar e criar sessão
    // fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setFeedback("Login realizado com sucesso");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8DCE2]/40 via-white to-[#A6D5D0]/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Entrar no ERP João e Maria</CardTitle>
          <CardDescription>Acesse com suas credenciais para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Campo de email com label acessível */}
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                aria-invalid={!!errorEmail}
              />
              {errorEmail && <p className="text-sm text-red-600">{errorEmail}</p>}
            </div>

            {/* Campo de senha com label acessível */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a className="text-sm text-[#6C63FF] hover:underline" href="/forgot-password">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={!!errorPassword}
              />
              {errorPassword && <p className="text-sm text-red-600">{errorPassword}</p>}
            </div>

            {/* Botão principal + estados de carregamento */}
            <Button type="submit" className="w-full bg-[#6C63FF] hover:bg-[#594ee0]" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {feedback && <p className="text-sm text-green-700">{feedback}</p>}
            {false && <p className="text-sm text-red-600">Mensagem de erro da API</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
