import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TCardType = {
  cardTypeId: number;
  organization: string;
  country: string;
  bankCardBin: string;
  type: string;
  typeStr: string;
  cardName: string;
  cardDesc: string;
  cardPrice: string;
  cardPriceCurrency: string;
  support: string[];
  supportHolderRegin: string[];
  supportHolderAreaCode: string[];
  needCardHolder: boolean;
  needDepositForActiveCard: boolean;
  depositAmountMinQuotaForActiveCard: string;
  depositAmountMaxQuotaForActiveCard: string;
  fiatCurrency: string;
  maxCount: number;
  status: string;
  rechargeCurrency: string;
  rechargeMinQuota: number;
  rechargeMaxQuota: number;
  rechargeFeeRate: number;
  rechargeFixedFee: number;
  rechargeDigital: number;
  enableActiveCard: boolean;
  enableDeposit: boolean;
  enableFreeze: boolean;
  enableUnFreeze: boolean;
};

/* Response */
export type TGetCardTypesResponse = TBaseResponse & {
  data: TCardType[];
};

/* Hook */
export const useGetCardTypes = ({
  onError,
  refetchInterval,
}: TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCardTypes'],
    onError,
    refetchInterval,
    queryFn: async () => {
      const response = await axios.get(`${cardAppApiUrl}/v2/cards/types`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const cardTypes: TGetCardTypesResponse = response.data;
      return cardTypes.data;
    },
  });
};
