import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrencyBRL, formatDateBR } from "@/lib/format";
import type { Order, OrderStatus } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, LineChart, RefreshCcw, ShoppingBag } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Link } from "react-router-dom";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const statusLabel: Record<OrderStatus, string> = {
  novo: "Novo",
  separacao: "Separação",
  producao: "Produção",
  pronto: "Pronto",
  em_rota: "Em rota",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const statusBadge: Record<OrderStatus, string> = {
  novo: "badge-info",
  separacao: "badge-warning",
  producao: "badge-warning",
  pronto: "badge-success",
  em_rota: "badge-info",
  entregue: "badge-success",
  cancelado: "badge-danger",
};

export default function GerenteDashboard() {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery<Order[]>({ queryKey: ["orders"], queryFn: api.orders.list });
  const invoicesQuery = useQuery({ queryKey: ["invoices"], queryFn: api.invoices.list });

  const updateStatusMutation = useMutation({
    mutationFn: (payload: { id: string; status: OrderStatus }) =>
      api.orders.update(payload.id, { status: payload.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const orders = ordersQuery.data ?? [];
  const invoices = invoicesQuery.data ?? [];
  const loading = ordersQuery.isLoading || invoicesQuery.isLoading;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const entreguesMes = orders.filter(
    (o) => o.status === "entregue" && new Date(o.entregaEm) >= monthStart,
  );
  const faturamentoMes = entreguesMes.reduce((sum, o) => sum + o.total, 0);
  const pedidosPendentes = orders.filter(
    (o) => !["entregue", "cancelado"].includes(o.status),
  );
  const ticketMedio = entreguesMes.length ? faturamentoMes / entreguesMes.length : 0;
  const recebiveis = invoices.filter((i) => i.status !== "paga").reduce((sum, i) => sum + i.valor, 0);

  const chartData = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(startOfDay(now));
    day.setDate(day.getDate() - (6 - idx));
    const total = orders
      .filter((o) => o.status === "entregue" && isSameDay(new Date(o.entregaEm), day))
      .reduce((sum, o) => sum + o.total, 0);
    return {
      dia: day.toLocaleDateString("pt-BR", { weekday: "short" }),
      faturamento: total,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <LineChart className="h-4 w-4 text-accent" />
          Painel do gerente
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Performance comercial</h1>
        <p className="text-muted-foreground">
          Acompanhe vendas por vendedor, pedidos pendentes e recepção de pagamentos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Faturamento do mês" value={loading ? null : formatCurrencyBRL(faturamentoMes)} />
        <KpiCard title="Pedidos pendentes" value={loading ? null : String(pedidosPendentes.length)} />
        <KpiCard title="Ticket médio" value={loading ? null : formatCurrencyBRL(ticketMedio)} />
        <KpiCard title="Recebíveis" value={loading ? null : formatCurrencyBRL(recebiveis)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Faturamento (7 dias)</CardTitle>
              <p className="text-sm text-muted-foreground">Entregas concluídas e faturadas.</p>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="dia" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(v) => formatCurrencyBRL(Number(v))}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "10px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="faturamento"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent) / 0.18)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Pedidos por etapa</CardTitle>
            <Button variant="outline" size="icon" onClick={() => ordersQuery.refetch()}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {["novo", "separacao", "producao", "pronto", "em_rota"].map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              const labelMap: Record<string, string> = {
                novo: "Novos",
                separacao: "Separação",
                producao: "Produção",
                pronto: "Pronto",
                em_rota: "Em rota",
              };
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{labelMap[status]}</span>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Pedidos aguardando ação</CardTitle>
            <p className="text-sm text-muted-foreground">
              Aprove ou avance pedidos para o time de vendas e estoque.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/vendas/pedidos">
              <ShoppingBag className="h-4 w-4" />
              Ver pedidos
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosPendentes.slice(0, 6).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.numero}</TableCell>
                    <TableCell>{order.cliente}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[order.status]}>
                        {statusLabel[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrencyBRL(order.total)}</TableCell>
                    <TableCell>{formatDateBR(order.entregaEm)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: order.id, status: "em_rota" })
                        }
                      >
                        <DollarSign className="h-4 w-4" />
                        Liberar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string | null }) {
  return (
    <Card className="kpi-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {value === null ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
      </CardContent>
    </Card>
  );
}
