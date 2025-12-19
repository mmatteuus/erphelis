import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyBRL } from "@/lib/format";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Sparkles, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

type IntegrationStatus = "ok" | "warn" | "off";

const integrationBadges: Record<IntegrationStatus, string> = {
  ok: "badge-success",
  warn: "badge-warning",
  off: "badge-danger",
};

const integrationLabel: Record<IntegrationStatus, string> = {
  ok: "Ativo",
  warn: "Atenção",
  off: "Desativado",
};

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

export default function AdminDashboard() {
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: api.orders.list });
  const invoicesQuery = useQuery({ queryKey: ["invoices"], queryFn: api.invoices.list });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: api.products.list });
  const stockQuery = useQuery({ queryKey: ["stockBalances"], queryFn: api.stock.listBalances });

  const loading =
    ordersQuery.isLoading || invoicesQuery.isLoading || productsQuery.isLoading || stockQuery.isLoading;

  const orders = ordersQuery.data ?? [];
  const invoices = invoicesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const balances = stockQuery.data ?? [];

  const today = startOfDay(new Date());
  const vendasHoje = orders
    .filter((o) => o.status === "entregue" && isSameDay(new Date(o.entregaEm), today))
    .reduce((sum, o) => sum + o.total, 0);

  const pedidosAprovacao = orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).length;
  const nfesPendentes = invoices.filter((i) => i.status !== "paga").length;

  const lowStock = balances.filter((b) => {
    const product = products.find((p) => p.id === b.productId);
    if (!product) return false;
    return b.saldo < product.estoqueMinimo;
  });

  const auditLog = [
    { user: "Camila", action: "Aprovou pedido JM-2025-002", when: "Hoje • 09:12" },
    { user: "Rafael", action: "Atualizou limite de desconto", when: "Hoje • 08:40" },
    { user: "Sofia", action: "Incluiu novo usuário (estoquista)", when: "Ontem • 18:05" },
    { user: "Lucas", action: "Liberou emissão NF-e", when: "Ontem • 16:22" },
  ];

  const integrations: Array<{
    name: string;
    status: IntegrationStatus;
    detail: string;
  }> = [
    { name: "NF-e", status: "ok", detail: "SEFAZ SP • ambiente produção" },
    { name: "Marketplace", status: "warn", detail: "Token expira em 2 dias" },
    { name: "Gateway de pagamento", status: "ok", detail: "PIX + Cartão ativos" },
    { name: "Webhook estoque", status: "off", detail: "Revisar endpoint" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Painel do admin
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Controles e conformidade</h1>
        <p className="text-muted-foreground">
          Identidade João e Maria aplicada em todos os módulos, pronto para NF-e, auditoria e papéis.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Usuários ativos" value={loading ? null : "18"} helper="Times com acesso hoje" />
        <KpiCard
          title="Vendas do dia"
          value={loading ? null : formatCurrencyBRL(vendasHoje)}
          helper="Pedidos entregues hoje"
        />
        <KpiCard
          title="Pedidos em aprovação"
          value={loading ? null : String(pedidosAprovacao)}
          helper="Fluxos aguardando gerente"
        />
        <KpiCard
          title="NF-e pendentes"
          value={loading ? null : String(nfesPendentes)}
          helper="Notas para emissão/baixa"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Governança e acessos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Últimas ações sensíveis registradas para auditoria.
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Políticas
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((item) => (
                  <TableRow key={item.action}>
                    <TableCell className="font-medium">{item.user}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell className="text-muted-foreground">{item.when}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrações e conformidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{integration.detail}</p>
                </div>
                <Badge variant="outline" className={integrationBadges[integration.status]}>
                  {integrationLabel[integration.status]}
                </Badge>
              </div>
            ))}
            <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              Integrações prontas para API externa, NF-e e alertas no Teams/Slack.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Últimos 30 dias</span>
              <span className="font-semibold text-foreground">99,97%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Monitore uptime e SLA dos serviços críticos.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Estoques em atenção</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/estoque/movimentacoes">Ver movimentações</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-28 w-full" />
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum item abaixo do mínimo.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Mínimo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.map((b) => {
                    const product = products.find((p) => p.id === b.productId);
                    const minimo = product?.estoqueMinimo ?? 0;
                    return (
                      <TableRow key={b.productId}>
                        <TableCell className="font-medium">{b.produto}</TableCell>
                        <TableCell>{b.saldo} un.</TableCell>
                        <TableCell>{minimo} un.</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
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
