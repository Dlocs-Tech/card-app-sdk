import axios from 'axios';
import { useState, useEffect } from 'react';
import forge from 'node-forge';
import { useCardAppContext } from '../../../providers';
import { exportPublicKey, generateKeyPair } from '../../../utils';

/* Types */
export type TGetUserCardInfoProps = {
  userId: number;
  cardId: number;
  enabled?: boolean;
};

export type TBalanceInfo = {
  cardNo: string;
  amount: string;
  usedAmount: string;
  currency: string;
};

export type TUserCardInfo = {
  id: number;
  cardNo: string;
  holderId: number;
  cardNumber: string;
  cvv: string;
  validPeriod: string;
  status: string;
  statusStr: string;
  bindTime: number;
  remark: string | null;
  balanceInfo: TBalanceInfo;
};

export type TGetUserCardInfoResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TUserCardInfo;
};

/* Hook */
export const useGetUserCardInfo = ({
  userId,
  cardId,
  enabled,
}: TGetUserCardInfoProps) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userCardInfo, setUserCardInfo] = useState<Omit<
    TUserCardInfo,
    'cvv' | 'validPeriod'
  > | null>(null);
  const [sensitiveData, setSensitiveData] = useState<Pick<
    TUserCardInfo,
    'cvv' | 'validPeriod'
  > | null>(null);

  /* Internal Functions */
  const fetchCardInfo = async (publicKey: string) => {
    try {
      if (!userId) throw new Error('User ID is missing');
      if (!cardId) throw new Error('Card ID is missing');

      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${cardAppApiUrl}/banking/${userId}/cards/${cardId}?publicKey=${encodeURIComponent(publicKey)}&onlySimpleInfo=false`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const userCardInfo: TGetUserCardInfoResponse = response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cvv, validPeriod, ...cardInfo } = userCardInfo.data;

      setUserCardInfo(cardInfo);
      return userCardInfo.data;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const refetchCardInfo = async () => {
    const { publicKey: publicKeyPem } = generateKeyPair();
    const publicKey = exportPublicKey(publicKeyPem);
    fetchCardInfo(publicKey);
  };

  const getSensitiveData = async (timeOut: number = 30000) => {
    try {
      setLoading(true);
      setError(null);
      const { publicKey: publicKeyPem, privateKey } = generateKeyPair();
      const publicKey = exportPublicKey(publicKeyPem);
      const cardInfo = await fetchCardInfo(publicKey);
      if (!cardInfo) throw new Error('Card Info is missing');

      const encryptedCvv = forge.util.decode64(cardInfo.cvv);
      const decryptedCvv = privateKey.decrypt(encryptedCvv, 'RSA-OAEP');

      const encryptedValidPeriod = forge.util.decode64(cardInfo.validPeriod);
      const decryptedValidPeriod = privateKey.decrypt(
        encryptedValidPeriod,
        'RSA-OAEP'
      );

      const cardSensitiveData = {
        cvv: decryptedCvv,
        validPeriod: decryptedValidPeriod,
      };

      setSensitiveData(cardSensitiveData);
      setTimeout(() => setSensitiveData(null), timeOut);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  /* Effects */
  useEffect(() => {
    if (!enabled || loading) return;
    refetchCardInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, cardId, enabled]);

  /* Return */
  return {
    userCardInfo,
    error,
    loading,
    getSensitiveData,
    refetchCardInfo,
    sensitiveData,
  };
};
