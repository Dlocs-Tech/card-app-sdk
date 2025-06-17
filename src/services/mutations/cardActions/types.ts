export type TCard = {
  orderNo: string;
  merchantOrderNo: string;
  cardNo: string;
  currency: string;
  amount: string;
  fee: string;
  receivedAmount: string;
  receivedCurrency: string;
  type: string;
  status: string;
  remark: string;
  transactionTime: number;
};

export type TCardActionsProps = {
  userId: number;
  cardId: number;
  clientRemark?: string;
};

export type TCardActionsResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TCard;
};
