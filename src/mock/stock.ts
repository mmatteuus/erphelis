import type { StockMovement } from "./types";

export const stockBalances: Array<{
  productId: string;
  sku: string;
  produto: string;
  saldo: number;
}> = [
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
  {
    productId: "p_kit_banho",
    sku: "BABY-KIT-BANHO",
    produto: "Kit banho suave para bebê",
    saldo: 11,
  },
  {
    productId: "p_body_algodao",
    sku: "BABY-BODY-ALG",
    produto: "Body algodão orgânico (P/M/G)",
    saldo: 26,
  },
  {
    productId: "p_naninha",
    sku: "BABY-NANINHA",
    produto: "Naninha lullaby macia",
    saldo: 20,
  },
];

export const movements: StockMovement[] = [
  {
    id: "m_001",
    tipo: "entrada",
    productId: "p_kit_boa_vinda",
    sku: "BABY-KIT-BOAS",
    produto: "Kit maternidade boas-vindas",
    quantidade: 12,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T09:20:00.000Z",
  },
  {
    id: "m_002",
    tipo: "entrada",
    productId: "p_manta_bebe",
    sku: "BABY-MANTA-ALG",
    produto: "Manta algodão para bebê",
    quantidade: 20,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T09:30:00.000Z",
  },
  {
    id: "m_003",
    tipo: "entrada",
    productId: "p_pelucia_ovelha",
    sku: "BABY-PLUSH-OVL",
    produto: "Pelúcia ovelhinha antialérgica",
    quantidade: 24,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T09:40:00.000Z",
  },
  {
    id: "m_004",
    tipo: "entrada",
    productId: "p_kit_banho",
    sku: "BABY-KIT-BANHO",
    produto: "Kit banho suave para bebê",
    quantidade: 18,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T10:00:00.000Z",
  },
  {
    id: "m_005",
    tipo: "entrada",
    productId: "p_body_algodao",
    sku: "BABY-BODY-ALG",
    produto: "Body algodão orgânico (P/M/G)",
    quantidade: 30,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T10:10:00.000Z",
  },
  {
    id: "m_006",
    tipo: "entrada",
    productId: "p_naninha",
    sku: "BABY-NANINHA",
    produto: "Naninha lullaby macia",
    quantidade: 28,
    motivo: "Compra - Linha bebê",
    criadoEm: "2025-12-17T10:20:00.000Z",
  },
];
