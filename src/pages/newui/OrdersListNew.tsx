import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Link, useNavigate } from "react-router-dom";

type Order = {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  status: string;
  total: number;
};

const STATUS = ["Pendente", "Pago", "Enviado", "Concluído"];

// Listagem de pedidos com filtros e ações.
export default function OrdersListNew() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    // Integração de API: listar pedidos
    // fetch("/api/orders").then(res => res.json()).then(setOrders)
    setTimeout(() => {
      setOrders([
        { id: "1", numero: "JM-2025-001", cliente: "Maria Silva", data: "2025-12-19", status: "Pendente", total: 409.8 },
        { id: "2", numero: "JM-2025-002", cliente: "João Santos", data: "2025-12-19", status: "Pago", total: 219.7 },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333]">Pedidos</h1>
          <p className="text-sm text-neutral-600">/orders</p>
        </div>
      </div>

      <div className="w-64 space-y-1">
        <Label>Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <p className="text-sm text-neutral-600">Carregando pedidos...</p>}

      <div className="overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-[#F8DCE2]/50">
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-sm text-neutral-600">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            )}
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.numero}</TableCell>
                <TableCell>{o.cliente}</TableCell>
                <TableCell>{o.data}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>R$ {o.total.toFixed(2)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${o.id}`)}>
                    Ver detalhes
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#6C63FF] hover:bg-[#594ee0]"
                    onClick={() => {
                      // Integração de API: marcar como enviado
                      // fetch(`/api/orders/${o.id}/ship`, { method: "POST" })
                      setOrders((prev) =>
                        prev.map((ord) => (ord.id === o.id ? { ...ord, status: "Enviado" } : ord)),
                      );
                    }}
                  >
                    Marcar como enviado
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
