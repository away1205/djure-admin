export type DetailTransactionType = {
  description: string;
  price: number;
  quantity: number | string;
  totalPrice: number;
  transactionID?: number;
};

export type TransactionType = {
  id: number;
  transactionProof: string;
  transactionType: string;
  createdBy: number;
  createdAt: string | Date;
  amount: number;
  description: string;
};
