import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SummaryRow = { dia: string; vendas: number; pedidos: number };

// Relatórios simples com período, gráfico placeholder e tabela.
export default function ReportsNew() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SummaryRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Estado inicial opcional
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Integração de API: fetch(`/api/reports?inicio=${inicio}&fim=${fim}`)
    setTimeout(() => {
      setRows([
        { dia: "2025-12-18", vendas: 12450, pedidos: 32 },
        { dia: "2025-12-19", vendas: 9800, pedidos: 28 },
      ]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#333]">Relatórios</h1>
        <p className="text-sm text-neutral-600">Selecione o período para gerar resultados.</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Período</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-3 items-end" onSubmit={handleGenerate}>
            <div className="space-y-1">
              <Label htmlFor="inicio">Início</Label>
              <Input id="inicio" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fim">Fim</Label>
              <Input id="fim" type="date" value={fim} onChange={(e) => setFim(e.target.value)} required />
            </div>
            <div>
              <Button type="submit" className="bg-[#6C63FF] hover:bg-[#594ee0]" disabled={loading}>
                {loading ? "Gerando..." : "Gerar"}
              </Button>
            </div>
          </form>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de vendas por dia</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-neutral-600">Gerando...</p>
          ) : (
            <div className="h-48 rounded-lg border border-dashed border-[#A6D5D0]/60 flex items-center justify-center text-sm text-neutral-500">
              {/* Substituir por gráfico real com dados de /api/reports */}
              Gráfico aqui (integre com biblioteca de chart)
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabela resumida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg">
            <Table>
              <TableHeader className="bg-[#F8DCE2]/50">
                <TableRow>
                  <TableHead>Dia</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Pedidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-sm text-neutral-600">
                      Nenhum dado para o período.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.dia}>
                    <TableCell>{r.dia}</TableCell>
                    <TableCell>R$ {r.vendas.toFixed(2)}</TableCell>
                    <TableCell>{r.pedidos}</TableCell>
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
