import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as api_pb from './api_pb';


export class GetDisputesRequest extends jspb.Message {
  getSkip(): number;
  setSkip(value: number): GetDisputesRequest;

  getTake(): number;
  setTake(value: number): GetDisputesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDisputesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDisputesRequest): GetDisputesRequest.AsObject;
  static serializeBinaryToWriter(message: GetDisputesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDisputesRequest;
  static deserializeBinaryFromReader(message: GetDisputesRequest, reader: jspb.BinaryReader): GetDisputesRequest;
}

export namespace GetDisputesRequest {
  export type AsObject = {
    skip: number,
    take: number,
  }
}

export class Dispute extends jspb.Message {
  getDeal(): api_pb.Deal | undefined;
  setDeal(value?: api_pb.Deal): Dispute;
  hasDeal(): boolean;
  clearDeal(): Dispute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Dispute.AsObject;
  static toObject(includeInstance: boolean, msg: Dispute): Dispute.AsObject;
  static serializeBinaryToWriter(message: Dispute, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Dispute;
  static deserializeBinaryFromReader(message: Dispute, reader: jspb.BinaryReader): Dispute;
}

export namespace Dispute {
  export type AsObject = {
    deal?: api_pb.Deal.AsObject,
  }
}

export class DisputeEvent extends jspb.Message {
  getCreated(): Dispute | undefined;
  setCreated(value?: Dispute): DisputeEvent;
  hasCreated(): boolean;
  clearCreated(): DisputeEvent;

  getInwork(): Dispute | undefined;
  setInwork(value?: Dispute): DisputeEvent;
  hasInwork(): boolean;
  clearInwork(): DisputeEvent;

  getReceived(): Dispute | undefined;
  setReceived(value?: Dispute): DisputeEvent;
  hasReceived(): boolean;
  clearReceived(): DisputeEvent;

  getKeepalive(): boolean;
  setKeepalive(value: boolean): DisputeEvent;

  getTypeCase(): DisputeEvent.TypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisputeEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DisputeEvent): DisputeEvent.AsObject;
  static serializeBinaryToWriter(message: DisputeEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisputeEvent;
  static deserializeBinaryFromReader(message: DisputeEvent, reader: jspb.BinaryReader): DisputeEvent;
}

export namespace DisputeEvent {
  export type AsObject = {
    created?: Dispute.AsObject,
    inwork?: Dispute.AsObject,
    received?: Dispute.AsObject,
    keepalive: boolean,
  }

  export enum TypeCase { 
    TYPE_NOT_SET = 0,
    CREATED = 1,
    INWORK = 2,
    RECEIVED = 3,
    KEEPALIVE = 4,
  }
}

export class GetDisputesResponse extends jspb.Message {
  getDisputesList(): Array<Dispute>;
  setDisputesList(value: Array<Dispute>): GetDisputesResponse;
  clearDisputesList(): GetDisputesResponse;
  addDisputes(value?: Dispute, index?: number): Dispute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDisputesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDisputesResponse): GetDisputesResponse.AsObject;
  static serializeBinaryToWriter(message: GetDisputesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDisputesResponse;
  static deserializeBinaryFromReader(message: GetDisputesResponse, reader: jspb.BinaryReader): GetDisputesResponse;
}

export namespace GetDisputesResponse {
  export type AsObject = {
    disputesList: Array<Dispute.AsObject>,
  }
}

export class ReleaseDisputeRequest extends jspb.Message {
  getDisputeid(): number;
  setDisputeid(value: number): ReleaseDisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReleaseDisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReleaseDisputeRequest): ReleaseDisputeRequest.AsObject;
  static serializeBinaryToWriter(message: ReleaseDisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReleaseDisputeRequest;
  static deserializeBinaryFromReader(message: ReleaseDisputeRequest, reader: jspb.BinaryReader): ReleaseDisputeRequest;
}

export namespace ReleaseDisputeRequest {
  export type AsObject = {
    disputeid: number,
  }
}

export class SupportAccount extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): SupportAccount;

  getId(): string;
  setId(value: string): SupportAccount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SupportAccount.AsObject;
  static toObject(includeInstance: boolean, msg: SupportAccount): SupportAccount.AsObject;
  static serializeBinaryToWriter(message: SupportAccount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SupportAccount;
  static deserializeBinaryFromReader(message: SupportAccount, reader: jspb.BinaryReader): SupportAccount;
}

export namespace SupportAccount {
  export type AsObject = {
    username: string,
    id: string,
  }
}

export class GetSupportAccountsResponse extends jspb.Message {
  getSupportaccountsList(): Array<SupportAccount>;
  setSupportaccountsList(value: Array<SupportAccount>): GetSupportAccountsResponse;
  clearSupportaccountsList(): GetSupportAccountsResponse;
  addSupportaccounts(value?: SupportAccount, index?: number): SupportAccount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSupportAccountsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSupportAccountsResponse): GetSupportAccountsResponse.AsObject;
  static serializeBinaryToWriter(message: GetSupportAccountsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSupportAccountsResponse;
  static deserializeBinaryFromReader(message: GetSupportAccountsResponse, reader: jspb.BinaryReader): GetSupportAccountsResponse;
}

export namespace GetSupportAccountsResponse {
  export type AsObject = {
    supportaccountsList: Array<SupportAccount.AsObject>,
  }
}

export class TransferDisputeRequest extends jspb.Message {
  getDisputeid(): number;
  setDisputeid(value: number): TransferDisputeRequest;

  getSupportaccountid(): string;
  setSupportaccountid(value: string): TransferDisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferDisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferDisputeRequest): TransferDisputeRequest.AsObject;
  static serializeBinaryToWriter(message: TransferDisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferDisputeRequest;
  static deserializeBinaryFromReader(message: TransferDisputeRequest, reader: jspb.BinaryReader): TransferDisputeRequest;
}

export namespace TransferDisputeRequest {
  export type AsObject = {
    disputeid: number,
    supportaccountid: string,
  }
}

export class CompleteDisputeRequest extends jspb.Message {
  getDisputeid(): number;
  setDisputeid(value: number): CompleteDisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteDisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteDisputeRequest): CompleteDisputeRequest.AsObject;
  static serializeBinaryToWriter(message: CompleteDisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteDisputeRequest;
  static deserializeBinaryFromReader(message: CompleteDisputeRequest, reader: jspb.BinaryReader): CompleteDisputeRequest;
}

export namespace CompleteDisputeRequest {
  export type AsObject = {
    disputeid: number,
  }
}

export class CancelDisputeRequest extends jspb.Message {
  getDisputeid(): number;
  setDisputeid(value: number): CancelDisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelDisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CancelDisputeRequest): CancelDisputeRequest.AsObject;
  static serializeBinaryToWriter(message: CancelDisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelDisputeRequest;
  static deserializeBinaryFromReader(message: CancelDisputeRequest, reader: jspb.BinaryReader): CancelDisputeRequest;
}

export namespace CancelDisputeRequest {
  export type AsObject = {
    disputeid: number,
  }
}

