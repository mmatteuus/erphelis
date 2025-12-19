import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyBRL, formatDateBR } from "@/lib/format";
import type { Order } from "@/mock";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ClipboardList, HandCoins, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const sellerAssignments: Record<string, string> = {
  o_001: "Julia Campos",
  o_002: "Rafael Lima",
  o_003: "Julia Campos",
};

const statusLabel: Record<Order["status"], string> = {
  novo: "Novo",
  separacao: "Separação",
  producao: "Produção",
  pronto: "Pronto",
  em_rota: "Em rota",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const statusBadge: Record<Order["status"], string> = {
  novo: "badge-info",
  separacao: "badge-warning",
  producao: "badge-warning",
  pronto: "badge-success",
  em_rota: "badge-info",
  entregue: "badge-success",
  cancelado: "badge-danger",
};

const followUps = [
  { cliente: "Maria Silva", motivo: "Acompanhar entrega JM-2025-001", quando: "Hoje • 15h" },
  { cliente: "João Santos", motivo: "Enviar proposta de assinatura", quando: "Amanhã • 09h" },
  { cliente: "Empresa Alfa", motivo: "Cobrar NF-e pendente", quando: "Amanhã • 14h" },
];

export default function VendedorDashboard() {
  const currentSeller = "Julia Campos";
  const ordersQuery = useQuery<Order[]>({ queryKey: ["orders"], queryFn: api.orders.list });
  const loading = ordersQuery.isLoading;
  const orders = ordersQuery.data ?? [];

  const myOrders = orders.filter((o) => sellerAssignments[o.id] === currentSeller);
  const ativos = myOrders.filter((o) => !["entregue", "cancelado"].includes(o.status));
  const entregues = myOrders.filter((o) => o.status === "entregue");
  const faturamentoMes = entregues.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <HandCoins className="h-4 w-4 text-primary" />
          Painel do vendedor
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Seus pedidos e follow-ups</h1>
        <p className="text-muted-foreground">
          Acompanhe entregas, crie novos pedidos e mantenha o relacionamento com clientes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Pedidos ativos" value={loading ? null : String(ativos.length)} helper="Em andamento" />
        <KpiCard
          title="Faturamento (mês)"
          value={loading ? null : formatCurrencyBRL(faturamentoMes)}
          helper="Pedidos entregues"
        />
        <KpiCard
          title="Follow-ups"
          value={String(followUps.length)}
          helper="Clientes com ações hoje/amanhã"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Meus pedidos</CardTitle>
              <p className="text-sm text-muted-foreground">Pedidos atribuídos para {currentSeller}.</p>
            </div>
            <Button asChild className="gap-2">
              <Link to="/vendas/pedidos/novo">
                <ArrowUpRight className="h-4 w-4" />
                Novo pedido
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : myOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum pedido atribuído.</p>
            ) : (
              myOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border p-3 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.numero}</span>
                      <Badge variant="outline" className={statusBadge[order.status]}>
                        {statusLabel[order.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.cliente} • Entrega {formatDateBR(order.entregaEm)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrencyBRL(order.total)}</div>
                    <Button asChild size="sm" variant="ghost" className="mt-2">
                      <Link to="/vendas/pedidos">Abrir</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-ups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {followUps.map((item) => (
              <div key={item.cliente} className="rounded-lg border p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.cliente}</span>
                  <Badge variant="outline" className="badge-info">
                    {item.quando}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.motivo}</p>
                <Button asChild size="sm" variant="ghost" className="gap-2">
                  <Link to="/clientes">
                    <HeartHandshake className="h-4 w-4" />
                    Ver cliente
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Atalhos do vendedor</CardTitle>
            <p className="text-sm text-muted-foreground">
              Crie pedidos, registre pagamentos e envie propostas rapidamente.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/vendas/pedidos">
              <ClipboardList className="h-4 w-4" />
              Pedidos
            </Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}

function KpiCard({ title, value, helper }: { title: string; value: string | null; helper: string }) {
  return (
    <Card className="kpi-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {value === null ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
        <p className="text-xs text-muted-foreground mt-1">{helper}</p>
      </CardContent>
    </Card>
  );
}
