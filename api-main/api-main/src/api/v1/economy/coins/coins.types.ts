export interface IncrementBodyRequest {
  userId: string;
  incrementBy: number;
};

export interface DecrementBodyRequest {
  userId: string;
  decrementBy: number;
};

export interface TransferBodyRequest {
  senderUserId: string;
  receiverUserId: string;
  coins: number;
};