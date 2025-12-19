import type { StockMovement } from "./types";

export const stockBalances: Array<{
  productId: string;
  sku: string;
  produto: string;
  saldo: number;
}> = [
  {
    productId: "p_rosa_vermelha",
    sku: "FLR-ROSA-VERM",
    produto: "Rosa vermelha (un.)",
    saldo: 96,
  },
  {
    productId: "p_orquidea",
    sku: "FLR-ORQ-PHAL",
    produto: "Orquídea phalaenopsis",
    saldo: 5,
  },
  {
    productId: "p_cesta_cafe",
    sku: "CST-CAF-001",
    produto: "Cesta café da manhã",
    saldo: 3,
  },
  {
    productId: "p_buque_12_rosas",
    sku: "FLR-BUQ-012",
    produto: "Buquê 12 rosas vermelhas",
    saldo: 7,
  },
  {
    productId: "p_urso_pelucia",
    sku: "PRS-URSO-PEQ",
    produto: "Urso de pelúcia (P)",
    saldo: 12,
  },
  {
    productId: "p_cartao",
    sku: "ADD-CARTAO",
    produto: "Cartão personalizado",
    saldo: 64,
  },
  {
    productId: "p_kit_boa_vinda",
    sku: "BABY-KIT-BOAS",
    produto: "Kit maternidade boas-vindas",
    saldo: 9,
  },
  {
    productId: "p_manta_bebe",
    sku: "BABY-MANTA-ALG",
    produto: "Manta algodão para bebê",
    saldo: 14,
  },
  {
    productId: "p_pelucia_ovelha",
    sku: "BABY-PLUSH-OVL",
    produto: "Pelúcia ovelhinha antialérgica",
    saldo: 18,
  },
];

export const movements: StockMovement[] = [
  {
    id: "m_001",
    tipo: "entrada",
    productId: "p_rosa_vermelha",
    sku: "FLR-ROSA-VERM",
    produto: "Rosa vermelha (un.)",
    quantidade: 120,
    motivo: "Compra - Fazenda das Rosas",
    criadoEm: "2025-12-18T09:00:00.000Z",
  },
  {
    id: "m_002",
    tipo: "saida",
    productId: "p_rosa_vermelha",
    sku: "FLR-ROSA-VERM",
    produto: "Rosa vermelha (un.)",
    quantidade: 24,
    motivo: "Pedido JM-2025-001",
    criadoEm: "2025-12-19T12:30:00.000Z",
  },
  {
    id: "m_003",
    tipo: "entrada",
    productId: "p_urso_pelucia",
    sku: "PRS-URSO-PEQ",
    produto: "Urso de pelúcia (P)",
    quantidade: 20,
    motivo: "Reposição - Pelúcias Fofas",
    criadoEm: "2025-12-15T11:10:00.000Z",
  },
  {
    id: "m_004",
    tipo: "entrada",
    productId: "p_kit_boa_vinda",
    sku: "BABY-KIT-BOAS",
    produto: "Kit maternidade boas-vindas",
    quantidade: 12,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T09:20:00.000Z",
  },
  {
    id: "m_005",
    tipo: "entrada",
    productId: "p_manta_bebe",
    sku: "BABY-MANTA-ALG",
    produto: "Manta algodão para bebê",
    quantidade: 20,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T09:30:00.000Z",
  },
  {
    id: "m_006",
    tipo: "entrada",
    productId: "p_pelucia_ovelha",
    sku: "BABY-PLUSH-OVL",
    produto: "Pelúcia ovelhinha antialérgica",
    quantidade: 24,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T09:40:00.000Z",
  },
];
