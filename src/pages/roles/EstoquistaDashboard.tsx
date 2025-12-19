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
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Boxes, ClipboardCheck, PackageOpen, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function EstoquistaDashboard() {
  const balancesQuery = useQuery({ queryKey: ["stockBalances"], queryFn: api.stock.listBalances });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: api.products.list });
  const movementsQuery = useQuery({ queryKey: ["movements"], queryFn: api.movements.list });

  const loading = balancesQuery.isLoading || productsQuery.isLoading || movementsQuery.isLoading;
  const balances = balancesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const movements = movementsQuery.data ?? [];

  const lowStock = balances.filter((b) => {
    const product = products.find((p) => p.id === b.productId);
    if (!product) return false;
    return b.saldo < product.estoqueMinimo;
  });

  const entradasRecentes = movements.filter((m) => m.tipo === "entrada").slice(0, 3);
  const saidasRecentes = movements.filter((m) => m.tipo !== "entrada").slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <Boxes className="h-4 w-4 text-primary" />
          Painel do estoquista
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Estoque e movimentações</h1>
        <p className="text-muted-foreground">
          Acompanhe saldos, receba mercadorias e confirme saídas para pedidos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Itens abaixo do mínimo"
          value={loading ? null : String(lowStock.length)}
          helper="Priorize reposição"
        />
        <KpiCard
          title="Entradas recentes"
          value={loading ? null : String(entradasRecentes.length)}
          helper="Últimas 3 entradas"
        />
        <KpiCard
          title="Saídas recentes"
          value={loading ? null : String(saidasRecentes.length)}
          helper="Pedidos atendidos"
        />
        <KpiCard
          title="SKU catalogados"
          value={loading ? null : String(products.length)}
          helper="Produtos ativos"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Itens críticos</CardTitle>
              <p className="text-sm text-muted-foreground">SKU abaixo do mínimo cadastrado.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/estoque/produtos">Ver produtos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-28 w-full" />
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum item em alerta.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>SKU</TableHead>
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
                        <TableCell className="text-muted-foreground">{b.sku}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Atalhos</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/estoque/movimentacoes">Movimentar estoque</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full gap-2">
              <Link to="/estoque/produtos/novo">
                <PackageOpen className="h-4 w-4" />
                Registrar entrada
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link to="/estoque/movimentacoes">
                <Truck className="h-4 w-4" />
                Confirmar saída
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.slice(0, 6).map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-muted-foreground">
                      {new Date(m.criadoEm).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="font-medium">{m.produto}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={m.tipo === "entrada" ? "badge-success" : "badge-info"}
                      >
                        {m.tipo === "entrada" ? "Entrada" : "Saída"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{m.quantidade} un.</TableCell>
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
