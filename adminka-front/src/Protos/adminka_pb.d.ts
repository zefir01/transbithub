import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as Protos_api_pb from '../Protos/api_pb';


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
  getDealid(): number;
  setDealid(value: number): Dispute;

  getArbitorid(): string;
  setArbitorid(value: string): Dispute;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Dispute;
  hasCreatedat(): boolean;
  clearCreatedat(): Dispute;

  getPaymenttype(): string;
  setPaymenttype(value: string): Dispute;

  getFiatcurrency(): string;
  setFiatcurrency(value: string): Dispute;

  getIsbuy(): boolean;
  setIsbuy(value: boolean): Dispute;

  getFiatamount(): Protos_api_pb.Decimal | undefined;
  setFiatamount(value?: Protos_api_pb.Decimal): Dispute;
  hasFiatamount(): boolean;
  clearFiatamount(): Dispute;

  getAdownerinfo(): Protos_api_pb.UserInfo | undefined;
  setAdownerinfo(value?: Protos_api_pb.UserInfo): Dispute;
  hasAdownerinfo(): boolean;
  clearAdownerinfo(): Dispute;

  getInitiator(): Protos_api_pb.UserInfo | undefined;
  setInitiator(value?: Protos_api_pb.UserInfo): Dispute;
  hasInitiator(): boolean;
  clearInitiator(): Dispute;

  getCompleted(): boolean;
  setCompleted(value: boolean): Dispute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Dispute.AsObject;
  static toObject(includeInstance: boolean, msg: Dispute): Dispute.AsObject;
  static serializeBinaryToWriter(message: Dispute, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Dispute;
  static deserializeBinaryFromReader(message: Dispute, reader: jspb.BinaryReader): Dispute;
}

export namespace Dispute {
  export type AsObject = {
    dealid: number,
    arbitorid: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    paymenttype: string,
    fiatcurrency: string,
    isbuy: boolean,
    fiatamount?: Protos_api_pb.Decimal.AsObject,
    adownerinfo?: Protos_api_pb.UserInfo.AsObject,
    initiator?: Protos_api_pb.UserInfo.AsObject,
    completed: boolean,
  }
}

export class DisputeEvent extends jspb.Message {
  getDispute(): Dispute | undefined;
  setDispute(value?: Dispute): DisputeEvent;
  hasDispute(): boolean;
  clearDispute(): DisputeEvent;

  getKeepalive(): boolean;
  setKeepalive(value: boolean): DisputeEvent;

  getDataCase(): DisputeEvent.DataCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisputeEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DisputeEvent): DisputeEvent.AsObject;
  static serializeBinaryToWriter(message: DisputeEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisputeEvent;
  static deserializeBinaryFromReader(message: DisputeEvent, reader: jspb.BinaryReader): DisputeEvent;
}

export namespace DisputeEvent {
  export type AsObject = {
    dispute?: Dispute.AsObject,
    keepalive: boolean,
  }

  export enum DataCase { 
    DATA_NOT_SET = 0,
    DISPUTE = 1,
    KEEPALIVE = 2,
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

export class DisputeRequest extends jspb.Message {
  getDisputeid(): number;
  setDisputeid(value: number): DisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DisputeRequest): DisputeRequest.AsObject;
  static serializeBinaryToWriter(message: DisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisputeRequest;
  static deserializeBinaryFromReader(message: DisputeRequest, reader: jspb.BinaryReader): DisputeRequest;
}

export namespace DisputeRequest {
  export type AsObject = {
    disputeid: number,
  }
}

export class GiveAwayDisputeRequest extends jspb.Message {
  getDisputeid(): number;
  setDisputeid(value: number): GiveAwayDisputeRequest;

  getUserid(): string;
  setUserid(value: string): GiveAwayDisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GiveAwayDisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GiveAwayDisputeRequest): GiveAwayDisputeRequest.AsObject;
  static serializeBinaryToWriter(message: GiveAwayDisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GiveAwayDisputeRequest;
  static deserializeBinaryFromReader(message: GiveAwayDisputeRequest, reader: jspb.BinaryReader): GiveAwayDisputeRequest;
}

export namespace GiveAwayDisputeRequest {
  export type AsObject = {
    disputeid: number,
    userid: string,
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

export class Profile extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): Profile;

  getUsername(): string;
  setUsername(value: string): Profile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Profile.AsObject;
  static toObject(includeInstance: boolean, msg: Profile): Profile.AsObject;
  static serializeBinaryToWriter(message: Profile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Profile;
  static deserializeBinaryFromReader(message: Profile, reader: jspb.BinaryReader): Profile;
}

export namespace Profile {
  export type AsObject = {
    userid: string,
    username: string,
  }
}

export class GetDealRequest extends jspb.Message {
  getDealid(): number;
  setDealid(value: number): GetDealRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDealRequest): GetDealRequest.AsObject;
  static serializeBinaryToWriter(message: GetDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDealRequest;
  static deserializeBinaryFromReader(message: GetDealRequest, reader: jspb.BinaryReader): GetDealRequest;
}

export namespace GetDealRequest {
  export type AsObject = {
    dealid: number,
  }
}

