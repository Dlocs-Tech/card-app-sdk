export type TGetUserProps = {
  email: string;
};

export type TGetUserByIdProps = {
  id: number;
};

export type TCardHolders = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  cardTypeId: number;
};

export type TCards = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  cardNo: string;
  userId: number;
};

export type TUser = {
  email: string;
  id: number;
  businessId: number;
  role: string;
  isVerified: true;
  address: string;
  card: TCards[];
  cardHolder: TCardHolders[];
  createdAt: Date;
  updatedAt: Date;
};

export type TGetUserResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TUser;
};
