import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Movement = {
  id: string;
  produto: string;
  quantidade: number;
  tipo: string;
  motivo: string;
  data: string;
};

// Tela de movimentação de estoque com registro e histórico.
export default function StockMovementNew() {
  const [products, setProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("venda");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [history, setHistory] = useState<Movement[]>([]);

  useEffect(() => {
    // Integração de API: buscar produtos para o select
    // fetch("/api/products").then(...)
    setProducts(["Kit maternidade", "Body algodão", "Naninha"]);
    // Integração de API: histórico
    setHistory([
      { id: "1", produto: "Kit maternidade", quantidade: 2, tipo: "entrada", motivo: "ajuste", data: "2025-12-18" },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    // Integração de API: registrar movimentação
    // fetch("/api/stock/movements", { method: "POST", body: JSON.stringify(...) })
    setTimeout(() => {
      setHistory((prev) => [
        {
          id: String(prev.length + 1),
          produto: selectedProduct,
          quantidade: quantity,
          tipo: quantity >= 0 ? "entrada" : "saída",
          motivo: reason,
          data: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      setLoading(false);
      setFeedback("Movimentação registrada");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333]">Movimentação de Estoque</h1>
          <p className="text-sm text-neutral-600">/estoque/movimentacoes-nova</p>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Registrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-4" onSubmit={handleSubmit}>
            <div className="space-y-1 sm:col-span-2">
              <Label>Produto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Ex: 5 (positivo entrada, negativo saída)"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Motivo</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="perda">Perda</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {feedback && <p className="text-sm text-green-700 sm:col-span-4">{feedback}</p>}
            {false && <p className="text-sm text-red-600 sm:col-span-4">Erro ao registrar</p>}
            <div className="sm:col-span-4">
              <Button type="submit" className="bg-[#6C63FF] hover:bg-[#594ee0]" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg">
            <Table>
              <TableHeader className="bg-[#F8DCE2]/50">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-sm text-neutral-600">
                      Nenhuma movimentação ainda
                    </TableCell>
                  </TableRow>
                )}
                {history.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.data}</TableCell>
                    <TableCell>{m.produto}</TableCell>
                    <TableCell>{m.tipo}</TableCell>
                    <TableCell>{m.quantidade}</TableCell>
                    <TableCell>{m.motivo}</TableCell>
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
