import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

type Client = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  ultimaCompra: string;
};

// Listagem e formulário simples para clientes.
export default function ClientsNew() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", endereco: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Integração de API: listar clientes
    // fetch("/api/clients")
    setTimeout(() => {
      setClients([
        { id: "1", nome: "Maria Silva", telefone: "(11) 99999-0000", email: "maria@example.com", cidade: "São Paulo", ultimaCompra: "2025-12-18" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.email || !form.endereco) {
      setError("Preencha todos os campos");
      return;
    }
    setError(null);
    setSuccess(null);
    // Integração de API: criar cliente
    // fetch("/api/clients", { method: "POST", body: JSON.stringify(form) })
    setClients((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        cidade: form.endereco,
        ultimaCompra: new Date().toISOString().slice(0, 10),
      },
    ]);
    setSuccess("Cliente salvo com sucesso");
    setForm({ nome: "", telefone: "", email: "", endereco: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333]">Clientes</h1>
          <p className="text-sm text-neutral-600">/clients</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Voltar ao dashboard
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Adicionar cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input value={form.telefone} onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Endereço completo</Label>
              <Input value={form.endereco} onChange={(e) => setForm((p) => ({ ...p, endereco: e.target.value }))} required />
            </div>
            {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
            {success && <p className="text-sm text-green-700 sm:col-span-2">{success}</p>}
            <div className="sm:col-span-2">
              <Button type="submit" className="bg-[#6C63FF] hover:bg-[#594ee0]">
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-neutral-600">Carregando clientes...</p>}
          <div className="overflow-auto border rounded-lg mt-2">
            <Table>
              <TableHeader className="bg-[#F8DCE2]/50">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Última compra</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-sm text-neutral-600">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                )}
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell>{c.telefone}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.cidade}</TableCell>
                    <TableCell>{c.ultimaCompra}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        Ver/Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
