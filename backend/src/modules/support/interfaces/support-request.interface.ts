export type ID = number;

export interface GetChatListParams {
  user: ID | null;
  isActive: boolean;
}

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<any[]>;
  sendMessage(data: SendMessageDto): Promise<any>;
  getMessages(supportRequest: ID): Promise<any[]>;
  subscribe(
    handler: (supportRequest: any, message: any) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<any>;
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
