import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useCardAppContext } from "../../../providers";
import { API_URL } from "../../../constants";

/* Types */
export type TGetUserProps = {
  email: string;
}

export type TGetUserResponse = {
  email: string;
  id: 0;
  businessId: 0;
  holderId: 0;
  role: string;
  isVerified: true;
  address: string;
  card: string[];
  createdAt: Date;
  updatedAt: Date;
}

/* Hook */
export const useGetUserById = ({ email }: TGetUserProps) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ["getUser"],
    refetchInterval: 1000,
    queryFn: async () => {
      if (!email) throw new Error("Email is missing");

      const response = await axios.get(`${API_URL}/user`, {
        params: { email },
        headers: { "x-api-key": cardAppApiKey },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch user info");
      }

      const user: TGetUserResponse = response.data;
      return user;
    },
    enabled: !!email,
  });
};