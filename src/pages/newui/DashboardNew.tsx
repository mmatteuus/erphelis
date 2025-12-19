import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Summary = {
  label: string;
  value: string;
  helper?: string;
};

// Dashboard geral com cards e espaço para gráfico.
export default function DashboardNew() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    // Integração de API: coletar métricas por papel
    // fetch("/api/dashboard").then(...)
    setTimeout(() => {
      setSummary([
        { label: "Vendas hoje", value: "R$ 12.450", helper: "Atualizado às 14:00" },
        { label: "Pedidos pendentes", value: "18" },
        { label: "Estoque baixo", value: "7 SKUs" },
        { label: "Clientes ativos", value: "1.240" },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#333]">Dashboard • João e Maria Enxoval</h1>
        <p className="text-sm text-neutral-600">
          Visão rápida por papel: admin, gerente, vendedor e estoque.
        </p>
      </div>

      {/* Links de navegação interna */}
      <div className="flex gap-3 flex-wrap">
        {[
          { href: "/admin/products", label: "Produtos" },
          { href: "/orders", label: "Pedidos" },
          { href: "/clients", label: "Clientes" },
          { href: "/estoque/movimentacoes-nova", label: "Estoque" },
          { href: "/reports", label: "Relatórios" },
        ].map((item) => (
          <Button
            key={item.href}
            asChild
            variant="outline"
            className="border-[#A6D5D0] text-[#333]"
          >
            <Link to={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          : summary.map((item) => (
              <Card key={item.label} className="shadow-sm border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-neutral-600">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-[#333]">{item.value}</p>
                  {item.helper && <p className="text-xs text-neutral-500 mt-1">{item.helper}</p>}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Placeholder de gráfico */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Faturamento semanal</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="h-48 rounded-lg border border-dashed border-[#A6D5D0]/60 flex items-center justify-center text-sm text-neutral-500">
              {/* Substituir por gráfico real (ex: recharts) alimentado por /api/dashboard/sales */}
              Gráfico aqui (integre com /api/dashboard/sales)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
