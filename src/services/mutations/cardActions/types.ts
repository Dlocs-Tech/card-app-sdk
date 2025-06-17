export type ICard = {
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

export type ICardActionsProps = {
  userId: number;
  cardId: number;
  clientRemark?: string;
};

export type ICardActionsResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: ICard;
};
