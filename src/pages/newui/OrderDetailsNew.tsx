import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Item = { produto: string; quantidade: number; preco: number };

type OrderDetail = {
  numero: string;
  cliente: string;
  endereco: string;
  status: string;
  itens: Item[];
  nfeGerada: boolean;
};

// Detalhes do pedido com ações de NF-e e impressão.
export default function OrderDetailsNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Integração de API: fetch `/api/orders/${id}`
    setTimeout(() => {
      setOrder({
        numero: "JM-2025-001",
        cliente: "Maria Silva",
        endereco: "Av. Central, 100 - São Paulo/SP",
        status: "Pendente",
        itens: [
          { produto: "Kit maternidade", quantidade: 1, preco: 289.9 },
          { produto: "Manta algodão", quantidade: 1, preco: 119.9 },
        ],
        nfeGerada: false,
      });
      setLoading(false);
    }, 600);
  }, [id]);

  const total = order?.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0) ?? 0;

  const emitNfe = async () => {
    setMessage(null);
    // Integração de API: emitir NF-e
    // fetch(`/api/orders/${id}/nfe`, { method: "POST" })
    setMessage("NF-e emitida com sucesso (mock).");
  };

  if (loading) return <p className="text-sm text-neutral-600">Carregando pedido...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!order) return <p className="text-sm text-neutral-600">Pedido não encontrado.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333]">Pedido {order.numero}</h1>
          <p className="text-sm text-neutral-600">Cliente: {order.cliente}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/orders")}>
          Voltar
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Itens</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#F8DCE2]/50">
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.itens.map((i) => (
                <TableRow key={i.produto}>
                  <TableCell>{i.produto}</TableCell>
                  <TableCell>{i.quantidade}</TableCell>
                  <TableCell>R$ {i.preco.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="text-right font-semibold">
                  Total
                </TableCell>
                <TableCell className="font-semibold">R$ {total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entrega e status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Endereço:</strong> {order.endereco}
          </p>
          <p>
            <strong>Status atual:</strong> {order.status}
          </p>
          {message && <p className="text-green-700">{message}</p>}
          <div className="flex gap-3">
            <Button variant="outline">Imprimir nota</Button>
            {!order.nfeGerada && (
              <Button className="bg-[#6C63FF] hover:bg-[#594ee0]" onClick={emitNfe}>
                Emitir NF-e
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
