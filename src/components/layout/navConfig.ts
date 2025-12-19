import {
  DollarSign,
  FileBarChart2,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
};

export const navItems: NavItem[] = [
  {
    title: "Painéis",
    icon: LayoutDashboard,
    children: [
      { title: "Visão geral", href: "/dashboard" },
      { title: "Admin", href: "/admin" },
      { title: "Gerente", href: "/gerente" },
      { title: "Vendedor", href: "/vendedor" },
      { title: "Estoquista", href: "/estoquista" },
    ],
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    children: [
      { title: "Pedidos", href: "/vendas/pedidos" },
      { title: "Novo pedido", href: "/vendas/pedidos/novo" },
    ],
  },
  {
    title: "Estoque",
    icon: Warehouse,
    children: [
      { title: "Produtos", href: "/estoque/produtos" },
      { title: "Novo produto", href: "/estoque/produtos/novo" },
      { title: "Movimentações", href: "/estoque/movimentacoes" },
    ],
  },
  {
    title: "Cadastros",
    icon: Users,
    children: [
      { title: "Clientes", href: "/clientes" },
      { title: "Fornecedores", href: "/fornecedores" },
    ],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    children: [
      { title: "Contas a receber", href: "/financeiro/contas-a-receber" },
      { title: "Contas a pagar", href: "/financeiro/contas-a-pagar" },
    ],
  },
  { title: "Relatórios", href: "/relatorios", icon: FileBarChart2 },
  { title: "Configurações", href: "/configuracoes", icon: Settings },
];
