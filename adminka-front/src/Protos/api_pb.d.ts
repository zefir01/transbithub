import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class Decimal extends jspb.Message {
  getUnits(): number;
  setUnits(value: number): Decimal;

  getNanos(): number;
  setNanos(value: number): Decimal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Decimal.AsObject;
  static toObject(includeInstance: boolean, msg: Decimal): Decimal.AsObject;
  static serializeBinaryToWriter(message: Decimal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Decimal;
  static deserializeBinaryFromReader(message: Decimal, reader: jspb.BinaryReader): Decimal;
}

export namespace Decimal {
  export type AsObject = {
    units: number,
    nanos: number,
  }
}

export class BoughtOptions extends jspb.Message {
  getAutopricerecalcs(): number;
  setAutopricerecalcs(value: number): BoughtOptions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoughtOptions.AsObject;
  static toObject(includeInstance: boolean, msg: BoughtOptions): BoughtOptions.AsObject;
  static serializeBinaryToWriter(message: BoughtOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoughtOptions;
  static deserializeBinaryFromReader(message: BoughtOptions, reader: jspb.BinaryReader): BoughtOptions;
}

export namespace BoughtOptions {
  export type AsObject = {
    autopricerecalcs: number,
  }
}

export class Variables extends jspb.Message {
  getVariablesMap(): jspb.Map<string, Decimal>;
  clearVariablesMap(): Variables;

  getKeepalive(): boolean;
  setKeepalive(value: boolean): Variables;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Variables.AsObject;
  static toObject(includeInstance: boolean, msg: Variables): Variables.AsObject;
  static serializeBinaryToWriter(message: Variables, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Variables;
  static deserializeBinaryFromReader(message: Variables, reader: jspb.BinaryReader): Variables;
}

export namespace Variables {
  export type AsObject = {
    variablesMap: Array<[string, Decimal.AsObject]>,
    keepalive: boolean,
  }
}

export class TimeTableItem extends jspb.Message {
  getDay(): string;
  setDay(value: string): TimeTableItem;

  getStart(): number;
  setStart(value: number): TimeTableItem;

  getEnd(): number;
  setEnd(value: number): TimeTableItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeTableItem.AsObject;
  static toObject(includeInstance: boolean, msg: TimeTableItem): TimeTableItem.AsObject;
  static serializeBinaryToWriter(message: TimeTableItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeTableItem;
  static deserializeBinaryFromReader(message: TimeTableItem, reader: jspb.BinaryReader): TimeTableItem;
}

export namespace TimeTableItem {
  export type AsObject = {
    day: string,
    start: number,
    end: number,
  }
}

export class AdvertisementData extends jspb.Message {
  getEquation(): string;
  setEquation(value: string): AdvertisementData;

  getMinamount(): Decimal | undefined;
  setMinamount(value?: Decimal): AdvertisementData;
  hasMinamount(): boolean;
  clearMinamount(): AdvertisementData;

  getMaxamount(): Decimal | undefined;
  setMaxamount(value?: Decimal): AdvertisementData;
  hasMaxamount(): boolean;
  clearMaxamount(): AdvertisementData;

  getMessage(): string;
  setMessage(value: string): AdvertisementData;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): AdvertisementData;
  hasCreatedat(): boolean;
  clearCreatedat(): AdvertisementData;

  getCountry(): string;
  setCountry(value: string): AdvertisementData;

  getPaymenttype(): string;
  setPaymenttype(value: string): AdvertisementData;

  getFiatcurrency(): string;
  setFiatcurrency(value: string): AdvertisementData;

  getIsbuy(): boolean;
  setIsbuy(value: boolean): AdvertisementData;

  getIsenabled(): boolean;
  setIsenabled(value: boolean): AdvertisementData;

  getTimetableList(): Array<TimeTableItem>;
  setTimetableList(value: Array<TimeTableItem>): AdvertisementData;
  clearTimetableList(): AdvertisementData;
  addTimetable(value?: TimeTableItem, index?: number): TimeTableItem;

  getMonitorliquidity(): boolean;
  setMonitorliquidity(value: boolean): AdvertisementData;

  getNotanonymous(): boolean;
  setNotanonymous(value: boolean): AdvertisementData;

  getTrusted(): boolean;
  setTrusted(value: boolean): AdvertisementData;

  getTitle(): string;
  setTitle(value: string): AdvertisementData;

  getWindow(): number;
  setWindow(value: number): AdvertisementData;

  getAutopricedelayisnull(): boolean;
  setAutopricedelayisnull(value: boolean): AdvertisementData;

  getAutopricedelay(): number;
  setAutopricedelay(value: number): AdvertisementData;

  getLnfunding(): boolean;
  setLnfunding(value: boolean): AdvertisementData;

  getLndisablebalance(): boolean;
  setLndisablebalance(value: boolean): AdvertisementData;

  getAutopriceCase(): AdvertisementData.AutopriceCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdvertisementData.AsObject;
  static toObject(includeInstance: boolean, msg: AdvertisementData): AdvertisementData.AsObject;
  static serializeBinaryToWriter(message: AdvertisementData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdvertisementData;
  static deserializeBinaryFromReader(message: AdvertisementData, reader: jspb.BinaryReader): AdvertisementData;
}

export namespace AdvertisementData {
  export type AsObject = {
    equation: string,
    minamount?: Decimal.AsObject,
    maxamount?: Decimal.AsObject,
    message: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    country: string,
    paymenttype: string,
    fiatcurrency: string,
    isbuy: boolean,
    isenabled: boolean,
    timetableList: Array<TimeTableItem.AsObject>,
    monitorliquidity: boolean,
    notanonymous: boolean,
    trusted: boolean,
    title: string,
    window: number,
    autopricedelayisnull: boolean,
    autopricedelay: number,
    lnfunding: boolean,
    lndisablebalance: boolean,
  }

  export enum AutopriceCase { 
    AUTOPRICE_NOT_SET = 0,
    AUTOPRICEDELAYISNULL = 21,
    AUTOPRICEDELAY = 22,
  }
}

export class ModifyAdvertisementRequest extends jspb.Message {
  getAdvertisementid(): number;
  setAdvertisementid(value: number): ModifyAdvertisementRequest;

  getData(): AdvertisementData | undefined;
  setData(value?: AdvertisementData): ModifyAdvertisementRequest;
  hasData(): boolean;
  clearData(): ModifyAdvertisementRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModifyAdvertisementRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ModifyAdvertisementRequest): ModifyAdvertisementRequest.AsObject;
  static serializeBinaryToWriter(message: ModifyAdvertisementRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModifyAdvertisementRequest;
  static deserializeBinaryFromReader(message: ModifyAdvertisementRequest, reader: jspb.BinaryReader): ModifyAdvertisementRequest;
}

export namespace ModifyAdvertisementRequest {
  export type AsObject = {
    advertisementid: number,
    data?: AdvertisementData.AsObject,
  }
}

export class Advertisement extends jspb.Message {
  getId(): number;
  setId(value: number): Advertisement;

  getEquation(): string;
  setEquation(value: string): Advertisement;

  getMinamount(): Decimal | undefined;
  setMinamount(value?: Decimal): Advertisement;
  hasMinamount(): boolean;
  clearMinamount(): Advertisement;

  getMaxamountrequested(): Decimal | undefined;
  setMaxamountrequested(value?: Decimal): Advertisement;
  hasMaxamountrequested(): boolean;
  clearMaxamountrequested(): Advertisement;

  getMaxamountcalculated(): Decimal | undefined;
  setMaxamountcalculated(value?: Decimal): Advertisement;
  hasMaxamountcalculated(): boolean;
  clearMaxamountcalculated(): Advertisement;

  getMessage(): string;
  setMessage(value: string): Advertisement;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Advertisement;
  hasCreatedat(): boolean;
  clearCreatedat(): Advertisement;

  getCountry(): string;
  setCountry(value: string): Advertisement;

  getPaymenttype(): string;
  setPaymenttype(value: string): Advertisement;

  getFiatcurrency(): string;
  setFiatcurrency(value: string): Advertisement;

  getIsbuy(): boolean;
  setIsbuy(value: boolean): Advertisement;

  getIsenabled(): boolean;
  setIsenabled(value: boolean): Advertisement;

  getOwner(): UserInfo | undefined;
  setOwner(value?: UserInfo): Advertisement;
  hasOwner(): boolean;
  clearOwner(): Advertisement;

  getTimetableList(): Array<TimeTableItem>;
  setTimetableList(value: Array<TimeTableItem>): Advertisement;
  clearTimetableList(): Advertisement;
  addTimetable(value?: TimeTableItem, index?: number): TimeTableItem;

  getMonitorliquidity(): boolean;
  setMonitorliquidity(value: boolean): Advertisement;

  getNotanonymous(): boolean;
  setNotanonymous(value: boolean): Advertisement;

  getTrusted(): boolean;
  setTrusted(value: boolean): Advertisement;

  getTitle(): string;
  setTitle(value: string): Advertisement;

  getWindow(): number;
  setWindow(value: number): Advertisement;

  getPrice(): Decimal | undefined;
  setPrice(value?: Decimal): Advertisement;
  hasPrice(): boolean;
  clearPrice(): Advertisement;

  getCurrentstatus(): AdCurrentStatus;
  setCurrentstatus(value: AdCurrentStatus): Advertisement;

  getAutopricedelayisnull(): boolean;
  setAutopricedelayisnull(value: boolean): Advertisement;

  getAutopricedelay(): number;
  setAutopricedelay(value: number): Advertisement;

  getLnenabled(): boolean;
  setLnenabled(value: boolean): Advertisement;

  getLndisablebalance(): boolean;
  setLndisablebalance(value: boolean): Advertisement;

  getAutopriceCase(): Advertisement.AutopriceCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Advertisement.AsObject;
  static toObject(includeInstance: boolean, msg: Advertisement): Advertisement.AsObject;
  static serializeBinaryToWriter(message: Advertisement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Advertisement;
  static deserializeBinaryFromReader(message: Advertisement, reader: jspb.BinaryReader): Advertisement;
}

export namespace Advertisement {
  export type AsObject = {
    id: number,
    equation: string,
    minamount?: Decimal.AsObject,
    maxamountrequested?: Decimal.AsObject,
    maxamountcalculated?: Decimal.AsObject,
    message: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    country: string,
    paymenttype: string,
    fiatcurrency: string,
    isbuy: boolean,
    isenabled: boolean,
    owner?: UserInfo.AsObject,
    timetableList: Array<TimeTableItem.AsObject>,
    monitorliquidity: boolean,
    notanonymous: boolean,
    trusted: boolean,
    title: string,
    window: number,
    price?: Decimal.AsObject,
    currentstatus: AdCurrentStatus,
    autopricedelayisnull: boolean,
    autopricedelay: number,
    lnenabled: boolean,
    lndisablebalance: boolean,
  }

  export enum AutopriceCase { 
    AUTOPRICE_NOT_SET = 0,
    AUTOPRICEDELAYISNULL = 23,
    AUTOPRICEDELAY = 24,
  }
}

export class DeleteAdvertisementRequest extends jspb.Message {
  getId(): number;
  setId(value: number): DeleteAdvertisementRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAdvertisementRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAdvertisementRequest): DeleteAdvertisementRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteAdvertisementRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAdvertisementRequest;
  static deserializeBinaryFromReader(message: DeleteAdvertisementRequest, reader: jspb.BinaryReader): DeleteAdvertisementRequest;
}

export namespace DeleteAdvertisementRequest {
  export type AsObject = {
    id: number,
  }
}

export class ChangeAdvertisementStatusRequest extends jspb.Message {
  getAdvertisementid(): number;
  setAdvertisementid(value: number): ChangeAdvertisementStatusRequest;

  getIsenabled(): boolean;
  setIsenabled(value: boolean): ChangeAdvertisementStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeAdvertisementStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeAdvertisementStatusRequest): ChangeAdvertisementStatusRequest.AsObject;
  static serializeBinaryToWriter(message: ChangeAdvertisementStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeAdvertisementStatusRequest;
  static deserializeBinaryFromReader(message: ChangeAdvertisementStatusRequest, reader: jspb.BinaryReader): ChangeAdvertisementStatusRequest;
}

export namespace ChangeAdvertisementStatusRequest {
  export type AsObject = {
    advertisementid: number,
    isenabled: boolean,
  }
}

export class ChangeAdvertisementStatusResponse extends jspb.Message {
  getCurrentstatus(): AdCurrentStatus;
  setCurrentstatus(value: AdCurrentStatus): ChangeAdvertisementStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeAdvertisementStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeAdvertisementStatusResponse): ChangeAdvertisementStatusResponse.AsObject;
  static serializeBinaryToWriter(message: ChangeAdvertisementStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeAdvertisementStatusResponse;
  static deserializeBinaryFromReader(message: ChangeAdvertisementStatusResponse, reader: jspb.BinaryReader): ChangeAdvertisementStatusResponse;
}

export namespace ChangeAdvertisementStatusResponse {
  export type AsObject = {
    currentstatus: AdCurrentStatus,
  }
}

export class FindAdvertisementsRequest extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): FindAdvertisementsRequest;

  getCurrency(): string;
  setCurrency(value: string): FindAdvertisementsRequest;

  getPaymenttype(): string;
  setPaymenttype(value: string): FindAdvertisementsRequest;

  getFiatamount(): Decimal | undefined;
  setFiatamount(value?: Decimal): FindAdvertisementsRequest;
  hasFiatamount(): boolean;
  clearFiatamount(): FindAdvertisementsRequest;

  getCryptoamount(): Decimal | undefined;
  setCryptoamount(value?: Decimal): FindAdvertisementsRequest;
  hasCryptoamount(): boolean;
  clearCryptoamount(): FindAdvertisementsRequest;

  getIsbuy(): boolean;
  setIsbuy(value: boolean): FindAdvertisementsRequest;

  getUserid(): string;
  setUserid(value: string): FindAdvertisementsRequest;

  getSkip(): number;
  setSkip(value: number): FindAdvertisementsRequest;

  getTake(): number;
  setTake(value: number): FindAdvertisementsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FindAdvertisementsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FindAdvertisementsRequest): FindAdvertisementsRequest.AsObject;
  static serializeBinaryToWriter(message: FindAdvertisementsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FindAdvertisementsRequest;
  static deserializeBinaryFromReader(message: FindAdvertisementsRequest, reader: jspb.BinaryReader): FindAdvertisementsRequest;
}

export namespace FindAdvertisementsRequest {
  export type AsObject = {
    country: string,
    currency: string,
    paymenttype: string,
    fiatamount?: Decimal.AsObject,
    cryptoamount?: Decimal.AsObject,
    isbuy: boolean,
    userid: string,
    skip: number,
    take: number,
  }
}

export class FindAdvertisementsResponse extends jspb.Message {
  getAdvertisementsList(): Array<Advertisement>;
  setAdvertisementsList(value: Array<Advertisement>): FindAdvertisementsResponse;
  clearAdvertisementsList(): FindAdvertisementsResponse;
  addAdvertisements(value?: Advertisement, index?: number): Advertisement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FindAdvertisementsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FindAdvertisementsResponse): FindAdvertisementsResponse.AsObject;
  static serializeBinaryToWriter(message: FindAdvertisementsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FindAdvertisementsResponse;
  static deserializeBinaryFromReader(message: FindAdvertisementsResponse, reader: jspb.BinaryReader): FindAdvertisementsResponse;
}

export namespace FindAdvertisementsResponse {
  export type AsObject = {
    advertisementsList: Array<Advertisement.AsObject>,
  }
}

export class GetAdvertisementsByIdRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetAdvertisementsByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAdvertisementsByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAdvertisementsByIdRequest): GetAdvertisementsByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetAdvertisementsByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAdvertisementsByIdRequest;
  static deserializeBinaryFromReader(message: GetAdvertisementsByIdRequest, reader: jspb.BinaryReader): GetAdvertisementsByIdRequest;
}

export namespace GetAdvertisementsByIdRequest {
  export type AsObject = {
    id: number,
  }
}

export class UserInfo extends jspb.Message {
  getId(): string;
  setId(value: string): UserInfo;

  getUsername(): string;
  setUsername(value: string): UserInfo;

  getTradesavgamount(): Decimal | undefined;
  setTradesavgamount(value?: Decimal): UserInfo;
  hasTradesavgamount(): boolean;
  clearTradesavgamount(): UserInfo;

  getTradescount(): number;
  setTradescount(value: number): UserInfo;

  getCounterpartyscount(): number;
  setCounterpartyscount(value: number): UserInfo;

  getResponserate(): Decimal | undefined;
  setResponserate(value?: Decimal): UserInfo;
  hasResponserate(): boolean;
  clearResponserate(): UserInfo;

  getFirsttradedate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFirsttradedate(value?: google_protobuf_timestamp_pb.Timestamp): UserInfo;
  hasFirsttradedate(): boolean;
  clearFirsttradedate(): UserInfo;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): UserInfo;
  hasCreatedat(): boolean;
  clearCreatedat(): UserInfo;

  getLastonline(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastonline(value?: google_protobuf_timestamp_pb.Timestamp): UserInfo;
  hasLastonline(): boolean;
  clearLastonline(): UserInfo;

  getTrustedcount(): number;
  setTrustedcount(value: number): UserInfo;

  getBlockedcount(): number;
  setBlockedcount(value: number): UserInfo;

  getAvgdelayseconds(): number;
  setAvgdelayseconds(value: number): UserInfo;

  getMediandelayseconds(): number;
  setMediandelayseconds(value: number): UserInfo;

  getIntroduction(): string;
  setIntroduction(value: string): UserInfo;

  getSite(): string;
  setSite(value: string): UserInfo;

  getTimezone(): string;
  setTimezone(value: string): UserInfo;

  getIstrusted(): boolean;
  setIstrusted(value: boolean): UserInfo;

  getIsblocked(): boolean;
  setIsblocked(value: boolean): UserInfo;

  getInvoicescreatedcount(): number;
  setInvoicescreatedcount(value: number): UserInfo;

  getPaymentspayedavgamount(): Decimal | undefined;
  setPaymentspayedavgamount(value?: Decimal): UserInfo;
  hasPaymentspayedavgamount(): boolean;
  clearPaymentspayedavgamount(): UserInfo;

  getPaymentspayedcount(): number;
  setPaymentspayedcount(value: number): UserInfo;

  getPaymentsreceivedavgamount(): Decimal | undefined;
  setPaymentsreceivedavgamount(value?: Decimal): UserInfo;
  hasPaymentsreceivedavgamount(): boolean;
  clearPaymentsreceivedavgamount(): UserInfo;

  getPaymentsreceivedcount(): number;
  setPaymentsreceivedcount(value: number): UserInfo;

  getInvoiceresponserate(): Decimal | undefined;
  setInvoiceresponserate(value?: Decimal): UserInfo;
  hasInvoiceresponserate(): boolean;
  clearInvoiceresponserate(): UserInfo;

  getIsanonymous(): boolean;
  setIsanonymous(value: boolean): UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserInfo.AsObject;
  static toObject(includeInstance: boolean, msg: UserInfo): UserInfo.AsObject;
  static serializeBinaryToWriter(message: UserInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserInfo;
  static deserializeBinaryFromReader(message: UserInfo, reader: jspb.BinaryReader): UserInfo;
}

export namespace UserInfo {
  export type AsObject = {
    id: string,
    username: string,
    tradesavgamount?: Decimal.AsObject,
    tradescount: number,
    counterpartyscount: number,
    responserate?: Decimal.AsObject,
    firsttradedate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    lastonline?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    trustedcount: number,
    blockedcount: number,
    avgdelayseconds: number,
    mediandelayseconds: number,
    introduction: string,
    site: string,
    timezone: string,
    istrusted: boolean,
    isblocked: boolean,
    invoicescreatedcount: number,
    paymentspayedavgamount?: Decimal.AsObject,
    paymentspayedcount: number,
    paymentsreceivedavgamount?: Decimal.AsObject,
    paymentsreceivedcount: number,
    invoiceresponserate?: Decimal.AsObject,
    isanonymous: boolean,
  }
}

export class GetUserInfoRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetUserInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserInfoRequest): GetUserInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserInfoRequest;
  static deserializeBinaryFromReader(message: GetUserInfoRequest, reader: jspb.BinaryReader): GetUserInfoRequest;
}

export namespace GetUserInfoRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetUserInfoResponse extends jspb.Message {
  getUserinfo(): UserInfo | undefined;
  setUserinfo(value?: UserInfo): GetUserInfoResponse;
  hasUserinfo(): boolean;
  clearUserinfo(): GetUserInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserInfoResponse): GetUserInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserInfoResponse;
  static deserializeBinaryFromReader(message: GetUserInfoResponse, reader: jspb.BinaryReader): GetUserInfoResponse;
}

export namespace GetUserInfoResponse {
  export type AsObject = {
    userinfo?: UserInfo.AsObject,
  }
}

export class DealMessage extends jspb.Message {
  getId(): number;
  setId(value: number): DealMessage;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): DealMessage;
  hasCreatedat(): boolean;
  clearCreatedat(): DealMessage;

  getOwnerid(): string;
  setOwnerid(value: string): DealMessage;

  getText(): string;
  setText(value: string): DealMessage;

  getImageidsList(): Array<string>;
  setImageidsList(value: Array<string>): DealMessage;
  clearImageidsList(): DealMessage;
  addImageids(value: string, index?: number): DealMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DealMessage.AsObject;
  static toObject(includeInstance: boolean, msg: DealMessage): DealMessage.AsObject;
  static serializeBinaryToWriter(message: DealMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DealMessage;
  static deserializeBinaryFromReader(message: DealMessage, reader: jspb.BinaryReader): DealMessage;
}

export namespace DealMessage {
  export type AsObject = {
    id: number,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    ownerid: string,
    text: string,
    imageidsList: Array<string>,
  }
}

export class Feedback extends jspb.Message {
  getId(): number;
  setId(value: number): Feedback;

  getIspositive(): boolean;
  setIspositive(value: boolean): Feedback;

  getText(): string;
  setText(value: string): Feedback;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Feedback;
  hasCreatedat(): boolean;
  clearCreatedat(): Feedback;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Feedback.AsObject;
  static toObject(includeInstance: boolean, msg: Feedback): Feedback.AsObject;
  static serializeBinaryToWriter(message: Feedback, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Feedback;
  static deserializeBinaryFromReader(message: Feedback, reader: jspb.BinaryReader): Feedback;
}

export namespace Feedback {
  export type AsObject = {
    id: number,
    ispositive: boolean,
    text: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class Deal extends jspb.Message {
  getId(): number;
  setId(value: number): Deal;

  getFiatamount(): Decimal | undefined;
  setFiatamount(value?: Decimal): Deal;
  hasFiatamount(): boolean;
  clearFiatamount(): Deal;

  getCryptoamount(): Decimal | undefined;
  setCryptoamount(value?: Decimal): Deal;
  hasCryptoamount(): boolean;
  clearCryptoamount(): Deal;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Deal;
  hasCreatedat(): boolean;
  clearCreatedat(): Deal;

  getStatus(): DealStatus;
  setStatus(value: DealStatus): Deal;

  getCompletedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedat(value?: google_protobuf_timestamp_pb.Timestamp): Deal;
  hasCompletedat(): boolean;
  clearCompletedat(): Deal;

  getCanceledat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCanceledat(value?: google_protobuf_timestamp_pb.Timestamp): Deal;
  hasCanceledat(): boolean;
  clearCanceledat(): Deal;

  getDisputedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDisputedat(value?: google_protobuf_timestamp_pb.Timestamp): Deal;
  hasDisputedat(): boolean;
  clearDisputedat(): Deal;

  getIsfiatpayed(): boolean;
  setIsfiatpayed(value: boolean): Deal;

  getDisputeid(): number;
  setDisputeid(value: number): Deal;

  getAdvertisement(): Advertisement | undefined;
  setAdvertisement(value?: Advertisement): Deal;
  hasAdvertisement(): boolean;
  clearAdvertisement(): Deal;

  getAdownerinfo(): UserInfo | undefined;
  setAdownerinfo(value?: UserInfo): Deal;
  hasAdownerinfo(): boolean;
  clearAdownerinfo(): Deal;

  getInitiator(): UserInfo | undefined;
  setInitiator(value?: UserInfo): Deal;
  hasInitiator(): boolean;
  clearInitiator(): Deal;

  getMessagesList(): Array<DealMessage>;
  setMessagesList(value: Array<DealMessage>): Deal;
  clearMessagesList(): Deal;
  addMessages(value?: DealMessage, index?: number): DealMessage;

  getFee(): string;
  setFee(value: string): Deal;

  getAdownerfeedbackisnull(): boolean;
  setAdownerfeedbackisnull(value: boolean): Deal;

  getAdownerfeedback(): Feedback | undefined;
  setAdownerfeedback(value?: Feedback): Deal;
  hasAdownerfeedback(): boolean;
  clearAdownerfeedback(): Deal;

  getInitiatorfeedbackisnull(): boolean;
  setInitiatorfeedbackisnull(value: boolean): Deal;

  getInitiatorfeedback(): Feedback | undefined;
  setInitiatorfeedback(value?: Feedback): Deal;
  hasInitiatorfeedback(): boolean;
  clearInitiatorfeedback(): Deal;

  getFiatpayedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFiatpayedat(value?: google_protobuf_timestamp_pb.Timestamp): Deal;
  hasFiatpayedat(): boolean;
  clearFiatpayedat(): Deal;

  getPaymentisnull(): boolean;
  setPaymentisnull(value: boolean): Deal;

  getPayment(): InvoicePayment | undefined;
  setPayment(value?: InvoicePayment): Deal;
  hasPayment(): boolean;
  clearPayment(): Deal;

  getNowithdrawal(): boolean;
  setNowithdrawal(value: boolean): Deal;

  getPromisewithdrawal(): string;
  setPromisewithdrawal(value: string): Deal;

  getBitcoinwithdrawal(): string;
  setBitcoinwithdrawal(value: string): Deal;

  getLnwithdrawal(): string;
  setLnwithdrawal(value: string): Deal;

  getWithdrawalstatus(): Deal.WithdrawalStatusMsg | undefined;
  setWithdrawalstatus(value?: Deal.WithdrawalStatusMsg): Deal;
  hasWithdrawalstatus(): boolean;
  clearWithdrawalstatus(): Deal;

  getAdownerfeedbacknullableCase(): Deal.AdownerfeedbacknullableCase;

  getInitiatorfeedbacknullableCase(): Deal.InitiatorfeedbacknullableCase;

  getNullablepaymentCase(): Deal.NullablepaymentCase;

  getWithdrawalCase(): Deal.WithdrawalCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Deal.AsObject;
  static toObject(includeInstance: boolean, msg: Deal): Deal.AsObject;
  static serializeBinaryToWriter(message: Deal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Deal;
  static deserializeBinaryFromReader(message: Deal, reader: jspb.BinaryReader): Deal;
}

export namespace Deal {
  export type AsObject = {
    id: number,
    fiatamount?: Decimal.AsObject,
    cryptoamount?: Decimal.AsObject,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    status: DealStatus,
    completedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    canceledat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    disputedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    isfiatpayed: boolean,
    disputeid: number,
    advertisement?: Advertisement.AsObject,
    adownerinfo?: UserInfo.AsObject,
    initiator?: UserInfo.AsObject,
    messagesList: Array<DealMessage.AsObject>,
    fee: string,
    adownerfeedbackisnull: boolean,
    adownerfeedback?: Feedback.AsObject,
    initiatorfeedbackisnull: boolean,
    initiatorfeedback?: Feedback.AsObject,
    fiatpayedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    paymentisnull: boolean,
    payment?: InvoicePayment.AsObject,
    nowithdrawal: boolean,
    promisewithdrawal: string,
    bitcoinwithdrawal: string,
    lnwithdrawal: string,
    withdrawalstatus?: Deal.WithdrawalStatusMsg.AsObject,
  }

  export class WithdrawalStatusMsg extends jspb.Message {
    getStatus(): Deal.WithdrawalStatusMsg.StatusEnum;
    setStatus(value: Deal.WithdrawalStatusMsg.StatusEnum): WithdrawalStatusMsg;

    getError(): string;
    setError(value: string): WithdrawalStatusMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): WithdrawalStatusMsg.AsObject;
    static toObject(includeInstance: boolean, msg: WithdrawalStatusMsg): WithdrawalStatusMsg.AsObject;
    static serializeBinaryToWriter(message: WithdrawalStatusMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): WithdrawalStatusMsg;
    static deserializeBinaryFromReader(message: WithdrawalStatusMsg, reader: jspb.BinaryReader): WithdrawalStatusMsg;
  }

  export namespace WithdrawalStatusMsg {
    export type AsObject = {
      status: Deal.WithdrawalStatusMsg.StatusEnum,
      error: string,
    }

    export enum StatusEnum { 
      NONE = 0,
      WAITING = 1,
      STARTED = 2,
      SUCCESS = 3,
      FAILED = 4,
    }
  }


  export enum AdownerfeedbacknullableCase { 
    ADOWNERFEEDBACKNULLABLE_NOT_SET = 0,
    ADOWNERFEEDBACKISNULL = 17,
    ADOWNERFEEDBACK = 18,
  }

  export enum InitiatorfeedbacknullableCase { 
    INITIATORFEEDBACKNULLABLE_NOT_SET = 0,
    INITIATORFEEDBACKISNULL = 19,
    INITIATORFEEDBACK = 20,
  }

  export enum NullablepaymentCase { 
    NULLABLEPAYMENT_NOT_SET = 0,
    PAYMENTISNULL = 22,
    PAYMENT = 23,
  }

  export enum WithdrawalCase { 
    WITHDRAWAL_NOT_SET = 0,
    NOWITHDRAWAL = 24,
    PROMISEWITHDRAWAL = 25,
    BITCOINWITHDRAWAL = 26,
    LNWITHDRAWAL = 27,
  }
}

export class GetMyDealsRequest extends jspb.Message {
  getStatusList(): Array<DealStatus>;
  setStatusList(value: Array<DealStatus>): GetMyDealsRequest;
  clearStatusList(): GetMyDealsRequest;
  addStatus(value: DealStatus, index?: number): GetMyDealsRequest;

  getDealid(): number;
  setDealid(value: number): GetMyDealsRequest;

  getLoadcount(): number;
  setLoadcount(value: number): GetMyDealsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMyDealsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMyDealsRequest): GetMyDealsRequest.AsObject;
  static serializeBinaryToWriter(message: GetMyDealsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMyDealsRequest;
  static deserializeBinaryFromReader(message: GetMyDealsRequest, reader: jspb.BinaryReader): GetMyDealsRequest;
}

export namespace GetMyDealsRequest {
  export type AsObject = {
    statusList: Array<DealStatus>,
    dealid: number,
    loadcount: number,
  }
}

export class GetMyDealsResponse extends jspb.Message {
  getDealsList(): Array<Deal>;
  setDealsList(value: Array<Deal>): GetMyDealsResponse;
  clearDealsList(): GetMyDealsResponse;
  addDeals(value?: Deal, index?: number): Deal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMyDealsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMyDealsResponse): GetMyDealsResponse.AsObject;
  static serializeBinaryToWriter(message: GetMyDealsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMyDealsResponse;
  static deserializeBinaryFromReader(message: GetMyDealsResponse, reader: jspb.BinaryReader): GetMyDealsResponse;
}

export namespace GetMyDealsResponse {
  export type AsObject = {
    dealsList: Array<Deal.AsObject>,
  }
}

export class CreateDealRequest extends jspb.Message {
  getAdvertisementid(): number;
  setAdvertisementid(value: number): CreateDealRequest;

  getFiatamount(): Decimal | undefined;
  setFiatamount(value?: Decimal): CreateDealRequest;
  hasFiatamount(): boolean;
  clearFiatamount(): CreateDealRequest;

  getCryptoamount(): Decimal | undefined;
  setCryptoamount(value?: Decimal): CreateDealRequest;
  hasCryptoamount(): boolean;
  clearCryptoamount(): CreateDealRequest;

  getSellpromise(): string;
  setSellpromise(value: string): CreateDealRequest;

  getBuypromise(): boolean;
  setBuypromise(value: boolean): CreateDealRequest;

  getPromisepassword(): string;
  setPromisepassword(value: string): CreateDealRequest;

  getBtcwallet(): string;
  setBtcwallet(value: string): CreateDealRequest;

  getAmountCase(): CreateDealRequest.AmountCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDealRequest): CreateDealRequest.AsObject;
  static serializeBinaryToWriter(message: CreateDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDealRequest;
  static deserializeBinaryFromReader(message: CreateDealRequest, reader: jspb.BinaryReader): CreateDealRequest;
}

export namespace CreateDealRequest {
  export type AsObject = {
    advertisementid: number,
    fiatamount?: Decimal.AsObject,
    cryptoamount?: Decimal.AsObject,
    sellpromise: string,
    buypromise: boolean,
    promisepassword: string,
    btcwallet: string,
  }

  export enum AmountCase { 
    AMOUNT_NOT_SET = 0,
    FIATAMOUNT = 2,
    CRYPTOAMOUNT = 3,
  }
}

export class CreateDealLnBuyRequest extends jspb.Message {
  getAdvertisementid(): number;
  setAdvertisementid(value: number): CreateDealLnBuyRequest;

  getLninvoice(): string;
  setLninvoice(value: string): CreateDealLnBuyRequest;

  getFiatamount(): Decimal | undefined;
  setFiatamount(value?: Decimal): CreateDealLnBuyRequest;
  hasFiatamount(): boolean;
  clearFiatamount(): CreateDealLnBuyRequest;

  getCryptoamount(): Decimal | undefined;
  setCryptoamount(value?: Decimal): CreateDealLnBuyRequest;
  hasCryptoamount(): boolean;
  clearCryptoamount(): CreateDealLnBuyRequest;

  getAmountisnull(): boolean;
  setAmountisnull(value: boolean): CreateDealLnBuyRequest;

  getNullableamountCase(): CreateDealLnBuyRequest.NullableamountCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDealLnBuyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDealLnBuyRequest): CreateDealLnBuyRequest.AsObject;
  static serializeBinaryToWriter(message: CreateDealLnBuyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDealLnBuyRequest;
  static deserializeBinaryFromReader(message: CreateDealLnBuyRequest, reader: jspb.BinaryReader): CreateDealLnBuyRequest;
}

export namespace CreateDealLnBuyRequest {
  export type AsObject = {
    advertisementid: number,
    lninvoice: string,
    fiatamount?: Decimal.AsObject,
    cryptoamount?: Decimal.AsObject,
    amountisnull: boolean,
  }

  export enum NullableamountCase { 
    NULLABLEAMOUNT_NOT_SET = 0,
    FIATAMOUNT = 3,
    CRYPTOAMOUNT = 4,
    AMOUNTISNULL = 5,
  }
}

export class CreateDealLnSellRequest extends jspb.Message {
  getAdvertisementid(): number;
  setAdvertisementid(value: number): CreateDealLnSellRequest;

  getFiatamount(): Decimal | undefined;
  setFiatamount(value?: Decimal): CreateDealLnSellRequest;
  hasFiatamount(): boolean;
  clearFiatamount(): CreateDealLnSellRequest;

  getCryptoamount(): Decimal | undefined;
  setCryptoamount(value?: Decimal): CreateDealLnSellRequest;
  hasCryptoamount(): boolean;
  clearCryptoamount(): CreateDealLnSellRequest;

  getAmountCase(): CreateDealLnSellRequest.AmountCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDealLnSellRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDealLnSellRequest): CreateDealLnSellRequest.AsObject;
  static serializeBinaryToWriter(message: CreateDealLnSellRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDealLnSellRequest;
  static deserializeBinaryFromReader(message: CreateDealLnSellRequest, reader: jspb.BinaryReader): CreateDealLnSellRequest;
}

export namespace CreateDealLnSellRequest {
  export type AsObject = {
    advertisementid: number,
    fiatamount?: Decimal.AsObject,
    cryptoamount?: Decimal.AsObject,
  }

  export enum AmountCase { 
    AMOUNT_NOT_SET = 0,
    FIATAMOUNT = 2,
    CRYPTOAMOUNT = 3,
  }
}

export class GetDealByIdRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetDealByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDealByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDealByIdRequest): GetDealByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetDealByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDealByIdRequest;
  static deserializeBinaryFromReader(message: GetDealByIdRequest, reader: jspb.BinaryReader): GetDealByIdRequest;
}

export namespace GetDealByIdRequest {
  export type AsObject = {
    id: number,
  }
}

export class SendMessageRequest extends jspb.Message {
  getDealid(): number;
  setDealid(value: number): SendMessageRequest;

  getText(): string;
  setText(value: string): SendMessageRequest;

  getImageidsList(): Array<string>;
  setImageidsList(value: Array<string>): SendMessageRequest;
  clearImageidsList(): SendMessageRequest;
  addImageids(value: string, index?: number): SendMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendMessageRequest): SendMessageRequest.AsObject;
  static serializeBinaryToWriter(message: SendMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMessageRequest;
  static deserializeBinaryFromReader(message: SendMessageRequest, reader: jspb.BinaryReader): SendMessageRequest;
}

export namespace SendMessageRequest {
  export type AsObject = {
    dealid: number,
    text: string,
    imageidsList: Array<string>,
  }
}

export class SendMessageResponse extends jspb.Message {
  getMessage(): DealMessage | undefined;
  setMessage(value?: DealMessage): SendMessageResponse;
  hasMessage(): boolean;
  clearMessage(): SendMessageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendMessageResponse): SendMessageResponse.AsObject;
  static serializeBinaryToWriter(message: SendMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMessageResponse;
  static deserializeBinaryFromReader(message: SendMessageResponse, reader: jspb.BinaryReader): SendMessageResponse;
}

export namespace SendMessageResponse {
  export type AsObject = {
    message?: DealMessage.AsObject,
  }
}

export class Balance extends jspb.Message {
  getConfirmed(): Decimal | undefined;
  setConfirmed(value?: Decimal): Balance;
  hasConfirmed(): boolean;
  clearConfirmed(): Balance;

  getUnconfirmed(): Decimal | undefined;
  setUnconfirmed(value?: Decimal): Balance;
  hasUnconfirmed(): boolean;
  clearUnconfirmed(): Balance;

  getDeposited(): Decimal | undefined;
  setDeposited(value?: Decimal): Balance;
  hasDeposited(): boolean;
  clearDeposited(): Balance;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Balance.AsObject;
  static toObject(includeInstance: boolean, msg: Balance): Balance.AsObject;
  static serializeBinaryToWriter(message: Balance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Balance;
  static deserializeBinaryFromReader(message: Balance, reader: jspb.BinaryReader): Balance;
}

export namespace Balance {
  export type AsObject = {
    confirmed?: Decimal.AsObject,
    unconfirmed?: Decimal.AsObject,
    deposited?: Decimal.AsObject,
  }
}

export class Event extends jspb.Message {
  getId(): number;
  setId(value: number): Event;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Event;
  hasCreatedat(): boolean;
  clearCreatedat(): Event;

  getDealnew(): Deal | undefined;
  setDealnew(value?: Deal): Event;
  hasDealnew(): boolean;
  clearDealnew(): Event;

  getDealstatuschanged(): Deal | undefined;
  setDealstatuschanged(value?: Deal): Event;
  hasDealstatuschanged(): boolean;
  clearDealstatuschanged(): Event;

  getDealnewmessage(): Deal | undefined;
  setDealnewmessage(value?: Deal): Event;
  hasDealnewmessage(): boolean;
  clearDealnewmessage(): Event;

  getDealfiatpayed(): Deal | undefined;
  setDealfiatpayed(value?: Deal): Event;
  hasDealfiatpayed(): boolean;
  clearDealfiatpayed(): Event;

  getDealdisputecreated(): Deal | undefined;
  setDealdisputecreated(value?: Deal): Event;
  hasDealdisputecreated(): boolean;
  clearDealdisputecreated(): Event;

  getBalance(): Balance | undefined;
  setBalance(value?: Balance): Event;
  hasBalance(): boolean;
  clearBalance(): Event;

  getKeepalive(): boolean;
  setKeepalive(value: boolean): Event;

  getInvoicenew(): Invoice | undefined;
  setInvoicenew(value?: Invoice): Event;
  hasInvoicenew(): boolean;
  clearInvoicenew(): Event;

  getInvoicepayed(): Invoice | undefined;
  setInvoicepayed(value?: Invoice): Event;
  hasInvoicepayed(): boolean;
  clearInvoicepayed(): Event;

  getInvoicedeleted(): Invoice | undefined;
  setInvoicedeleted(value?: Invoice): Event;
  hasInvoicedeleted(): boolean;
  clearInvoicedeleted(): Event;

  getInvoicepaymentnew(): InvoicePayment | undefined;
  setInvoicepaymentnew(value?: InvoicePayment): Event;
  hasInvoicepaymentnew(): boolean;
  clearInvoicepaymentnew(): Event;

  getConversationnewmessage(): Conversation | undefined;
  setConversationnewmessage(value?: Conversation): Event;
  hasConversationnewmessage(): boolean;
  clearConversationnewmessage(): Event;

  getInvoicepaymentupdated(): InvoicePayment | undefined;
  setInvoicepaymentupdated(value?: InvoicePayment): Event;
  hasInvoicepaymentupdated(): boolean;
  clearInvoicepaymentupdated(): Event;

  getContentCase(): Event.ContentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    id: number,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    dealnew?: Deal.AsObject,
    dealstatuschanged?: Deal.AsObject,
    dealnewmessage?: Deal.AsObject,
    dealfiatpayed?: Deal.AsObject,
    dealdisputecreated?: Deal.AsObject,
    balance?: Balance.AsObject,
    keepalive: boolean,
    invoicenew?: Invoice.AsObject,
    invoicepayed?: Invoice.AsObject,
    invoicedeleted?: Invoice.AsObject,
    invoicepaymentnew?: InvoicePayment.AsObject,
    conversationnewmessage?: Conversation.AsObject,
    invoicepaymentupdated?: InvoicePayment.AsObject,
  }

  export enum ContentCase { 
    CONTENT_NOT_SET = 0,
    DEALNEW = 3,
    DEALSTATUSCHANGED = 4,
    DEALNEWMESSAGE = 5,
    DEALFIATPAYED = 6,
    DEALDISPUTECREATED = 7,
    BALANCE = 8,
    KEEPALIVE = 9,
    INVOICENEW = 10,
    INVOICEPAYED = 11,
    INVOICEDELETED = 12,
    INVOICEPAYMENTNEW = 13,
    CONVERSATIONNEWMESSAGE = 14,
    INVOICEPAYMENTUPDATED = 15,
  }
}

export class MarkEventsAsReadRequest extends jspb.Message {
  getIdList(): Array<number>;
  setIdList(value: Array<number>): MarkEventsAsReadRequest;
  clearIdList(): MarkEventsAsReadRequest;
  addId(value: number, index?: number): MarkEventsAsReadRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkEventsAsReadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MarkEventsAsReadRequest): MarkEventsAsReadRequest.AsObject;
  static serializeBinaryToWriter(message: MarkEventsAsReadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkEventsAsReadRequest;
  static deserializeBinaryFromReader(message: MarkEventsAsReadRequest, reader: jspb.BinaryReader): MarkEventsAsReadRequest;
}

export namespace MarkEventsAsReadRequest {
  export type AsObject = {
    idList: Array<number>,
  }
}

export class CancelDealRequest extends jspb.Message {
  getDealid(): number;
  setDealid(value: number): CancelDealRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CancelDealRequest): CancelDealRequest.AsObject;
  static serializeBinaryToWriter(message: CancelDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelDealRequest;
  static deserializeBinaryFromReader(message: CancelDealRequest, reader: jspb.BinaryReader): CancelDealRequest;
}

export namespace CancelDealRequest {
  export type AsObject = {
    dealid: number,
  }
}

export class CancelDealResponse extends jspb.Message {
  getDeal(): Deal | undefined;
  setDeal(value?: Deal): CancelDealResponse;
  hasDeal(): boolean;
  clearDeal(): CancelDealResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelDealResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CancelDealResponse): CancelDealResponse.AsObject;
  static serializeBinaryToWriter(message: CancelDealResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelDealResponse;
  static deserializeBinaryFromReader(message: CancelDealResponse, reader: jspb.BinaryReader): CancelDealResponse;
}

export namespace CancelDealResponse {
  export type AsObject = {
    deal?: Deal.AsObject,
  }
}

export class IPayedRequest extends jspb.Message {
  getDealid(): number;
  setDealid(value: number): IPayedRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IPayedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IPayedRequest): IPayedRequest.AsObject;
  static serializeBinaryToWriter(message: IPayedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IPayedRequest;
  static deserializeBinaryFromReader(message: IPayedRequest, reader: jspb.BinaryReader): IPayedRequest;
}

export namespace IPayedRequest {
  export type AsObject = {
    dealid: number,
  }
}

export class IPayedResponse extends jspb.Message {
  getDeal(): Deal | undefined;
  setDeal(value?: Deal): IPayedResponse;
  hasDeal(): boolean;
  clearDeal(): IPayedResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IPayedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IPayedResponse): IPayedResponse.AsObject;
  static serializeBinaryToWriter(message: IPayedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IPayedResponse;
  static deserializeBinaryFromReader(message: IPayedResponse, reader: jspb.BinaryReader): IPayedResponse;
}

export namespace IPayedResponse {
  export type AsObject = {
    deal?: Deal.AsObject,
  }
}

export class CreateDisputeRequest extends jspb.Message {
  getDealid(): number;
  setDealid(value: number): CreateDisputeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDisputeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDisputeRequest): CreateDisputeRequest.AsObject;
  static serializeBinaryToWriter(message: CreateDisputeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDisputeRequest;
  static deserializeBinaryFromReader(message: CreateDisputeRequest, reader: jspb.BinaryReader): CreateDisputeRequest;
}

export namespace CreateDisputeRequest {
  export type AsObject = {
    dealid: number,
  }
}

export class CreateDisputeResponse extends jspb.Message {
  getDeal(): Deal | undefined;
  setDeal(value?: Deal): CreateDisputeResponse;
  hasDeal(): boolean;
  clearDeal(): CreateDisputeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDisputeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDisputeResponse): CreateDisputeResponse.AsObject;
  static serializeBinaryToWriter(message: CreateDisputeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDisputeResponse;
  static deserializeBinaryFromReader(message: CreateDisputeResponse, reader: jspb.BinaryReader): CreateDisputeResponse;
}

export namespace CreateDisputeResponse {
  export type AsObject = {
    deal?: Deal.AsObject,
  }
}

export class SendFeedbackRequest extends jspb.Message {
  getDealid(): number;
  setDealid(value: number): SendFeedbackRequest;

  getIspositive(): boolean;
  setIspositive(value: boolean): SendFeedbackRequest;

  getText(): string;
  setText(value: string): SendFeedbackRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendFeedbackRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendFeedbackRequest): SendFeedbackRequest.AsObject;
  static serializeBinaryToWriter(message: SendFeedbackRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendFeedbackRequest;
  static deserializeBinaryFromReader(message: SendFeedbackRequest, reader: jspb.BinaryReader): SendFeedbackRequest;
}

export namespace SendFeedbackRequest {
  export type AsObject = {
    dealid: number,
    ispositive: boolean,
    text: string,
  }
}

export class GetUserFeedbacksRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): GetUserFeedbacksRequest;

  getStartid(): number;
  setStartid(value: number): GetUserFeedbacksRequest;

  getCount(): number;
  setCount(value: number): GetUserFeedbacksRequest;

  getIsdealsfeedbacks(): boolean;
  setIsdealsfeedbacks(value: boolean): GetUserFeedbacksRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserFeedbacksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserFeedbacksRequest): GetUserFeedbacksRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserFeedbacksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserFeedbacksRequest;
  static deserializeBinaryFromReader(message: GetUserFeedbacksRequest, reader: jspb.BinaryReader): GetUserFeedbacksRequest;
}

export namespace GetUserFeedbacksRequest {
  export type AsObject = {
    userid: string,
    startid: number,
    count: number,
    isdealsfeedbacks: boolean,
  }
}

export class GetUserFeedbacksResponse extends jspb.Message {
  getFeedbacksList(): Array<Feedback>;
  setFeedbacksList(value: Array<Feedback>): GetUserFeedbacksResponse;
  clearFeedbacksList(): GetUserFeedbacksResponse;
  addFeedbacks(value?: Feedback, index?: number): Feedback;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserFeedbacksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserFeedbacksResponse): GetUserFeedbacksResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserFeedbacksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserFeedbacksResponse;
  static deserializeBinaryFromReader(message: GetUserFeedbacksResponse, reader: jspb.BinaryReader): GetUserFeedbacksResponse;
}

export namespace GetUserFeedbacksResponse {
  export type AsObject = {
    feedbacksList: Array<Feedback.AsObject>,
  }
}

export class SubscribeAdvertisementChangesResponse extends jspb.Message {
  getAdvertisement(): Advertisement | undefined;
  setAdvertisement(value?: Advertisement): SubscribeAdvertisementChangesResponse;
  hasAdvertisement(): boolean;
  clearAdvertisement(): SubscribeAdvertisementChangesResponse;

  getAddeleted(): boolean;
  setAddeleted(value: boolean): SubscribeAdvertisementChangesResponse;

  getKeepalive(): boolean;
  setKeepalive(value: boolean): SubscribeAdvertisementChangesResponse;

  getContentCase(): SubscribeAdvertisementChangesResponse.ContentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeAdvertisementChangesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeAdvertisementChangesResponse): SubscribeAdvertisementChangesResponse.AsObject;
  static serializeBinaryToWriter(message: SubscribeAdvertisementChangesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeAdvertisementChangesResponse;
  static deserializeBinaryFromReader(message: SubscribeAdvertisementChangesResponse, reader: jspb.BinaryReader): SubscribeAdvertisementChangesResponse;
}

export namespace SubscribeAdvertisementChangesResponse {
  export type AsObject = {
    advertisement?: Advertisement.AsObject,
    addeleted: boolean,
    keepalive: boolean,
  }

  export enum ContentCase { 
    CONTENT_NOT_SET = 0,
    ADVERTISEMENT = 1,
    ADDELETED = 2,
    KEEPALIVE = 3,
  }
}

export class AddUserToTrustedRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): AddUserToTrustedRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddUserToTrustedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddUserToTrustedRequest): AddUserToTrustedRequest.AsObject;
  static serializeBinaryToWriter(message: AddUserToTrustedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddUserToTrustedRequest;
  static deserializeBinaryFromReader(message: AddUserToTrustedRequest, reader: jspb.BinaryReader): AddUserToTrustedRequest;
}

export namespace AddUserToTrustedRequest {
  export type AsObject = {
    userid: string,
  }
}

export class CreateUserComplaintRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): CreateUserComplaintRequest;

  getText(): string;
  setText(value: string): CreateUserComplaintRequest;

  getContact(): string;
  setContact(value: string): CreateUserComplaintRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserComplaintRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserComplaintRequest): CreateUserComplaintRequest.AsObject;
  static serializeBinaryToWriter(message: CreateUserComplaintRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserComplaintRequest;
  static deserializeBinaryFromReader(message: CreateUserComplaintRequest, reader: jspb.BinaryReader): CreateUserComplaintRequest;
}

export namespace CreateUserComplaintRequest {
  export type AsObject = {
    userid: string,
    text: string,
    contact: string,
  }
}

export class BlockUserRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): BlockUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BlockUserRequest): BlockUserRequest.AsObject;
  static serializeBinaryToWriter(message: BlockUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockUserRequest;
  static deserializeBinaryFromReader(message: BlockUserRequest, reader: jspb.BinaryReader): BlockUserRequest;
}

export namespace BlockUserRequest {
  export type AsObject = {
    userid: string,
  }
}

export class UnBlockUserRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): UnBlockUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnBlockUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnBlockUserRequest): UnBlockUserRequest.AsObject;
  static serializeBinaryToWriter(message: UnBlockUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnBlockUserRequest;
  static deserializeBinaryFromReader(message: UnBlockUserRequest, reader: jspb.BinaryReader): UnBlockUserRequest;
}

export namespace UnBlockUserRequest {
  export type AsObject = {
    userid: string,
  }
}

export class GetMyTrustedUsersResponse extends jspb.Message {
  getUsersList(): Array<UserInfo>;
  setUsersList(value: Array<UserInfo>): GetMyTrustedUsersResponse;
  clearUsersList(): GetMyTrustedUsersResponse;
  addUsers(value?: UserInfo, index?: number): UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMyTrustedUsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMyTrustedUsersResponse): GetMyTrustedUsersResponse.AsObject;
  static serializeBinaryToWriter(message: GetMyTrustedUsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMyTrustedUsersResponse;
  static deserializeBinaryFromReader(message: GetMyTrustedUsersResponse, reader: jspb.BinaryReader): GetMyTrustedUsersResponse;
}

export namespace GetMyTrustedUsersResponse {
  export type AsObject = {
    usersList: Array<UserInfo.AsObject>,
  }
}

export class RemoveFromTrustedRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): RemoveFromTrustedRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveFromTrustedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveFromTrustedRequest): RemoveFromTrustedRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveFromTrustedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveFromTrustedRequest;
  static deserializeBinaryFromReader(message: RemoveFromTrustedRequest, reader: jspb.BinaryReader): RemoveFromTrustedRequest;
}

export namespace RemoveFromTrustedRequest {
  export type AsObject = {
    userid: string,
  }
}

export class GetMyBlockedUsersResponse extends jspb.Message {
  getUsersList(): Array<UserInfo>;
  setUsersList(value: Array<UserInfo>): GetMyBlockedUsersResponse;
  clearUsersList(): GetMyBlockedUsersResponse;
  addUsers(value?: UserInfo, index?: number): UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMyBlockedUsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMyBlockedUsersResponse): GetMyBlockedUsersResponse.AsObject;
  static serializeBinaryToWriter(message: GetMyBlockedUsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMyBlockedUsersResponse;
  static deserializeBinaryFromReader(message: GetMyBlockedUsersResponse, reader: jspb.BinaryReader): GetMyBlockedUsersResponse;
}

export namespace GetMyBlockedUsersResponse {
  export type AsObject = {
    usersList: Array<UserInfo.AsObject>,
  }
}

export class IsUserTrustedRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): IsUserTrustedRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsUserTrustedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IsUserTrustedRequest): IsUserTrustedRequest.AsObject;
  static serializeBinaryToWriter(message: IsUserTrustedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsUserTrustedRequest;
  static deserializeBinaryFromReader(message: IsUserTrustedRequest, reader: jspb.BinaryReader): IsUserTrustedRequest;
}

export namespace IsUserTrustedRequest {
  export type AsObject = {
    userid: string,
  }
}

export class IsUserBlockedRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): IsUserBlockedRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsUserBlockedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IsUserBlockedRequest): IsUserBlockedRequest.AsObject;
  static serializeBinaryToWriter(message: IsUserBlockedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsUserBlockedRequest;
  static deserializeBinaryFromReader(message: IsUserBlockedRequest, reader: jspb.BinaryReader): IsUserBlockedRequest;
}

export namespace IsUserBlockedRequest {
  export type AsObject = {
    userid: string,
  }
}

export class IsUserTrustedResponse extends jspb.Message {
  getIstrusted(): boolean;
  setIstrusted(value: boolean): IsUserTrustedResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsUserTrustedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IsUserTrustedResponse): IsUserTrustedResponse.AsObject;
  static serializeBinaryToWriter(message: IsUserTrustedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsUserTrustedResponse;
  static deserializeBinaryFromReader(message: IsUserTrustedResponse, reader: jspb.BinaryReader): IsUserTrustedResponse;
}

export namespace IsUserTrustedResponse {
  export type AsObject = {
    istrusted: boolean,
  }
}

export class IsUserBlockedResponse extends jspb.Message {
  getIsblocked(): boolean;
  setIsblocked(value: boolean): IsUserBlockedResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsUserBlockedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IsUserBlockedResponse): IsUserBlockedResponse.AsObject;
  static serializeBinaryToWriter(message: IsUserBlockedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsUserBlockedResponse;
  static deserializeBinaryFromReader(message: IsUserBlockedResponse, reader: jspb.BinaryReader): IsUserBlockedResponse;
}

export namespace IsUserBlockedResponse {
  export type AsObject = {
    isblocked: boolean,
  }
}

export class Transaction extends jspb.Message {
  getId(): number;
  setId(value: number): Transaction;

  getTxid(): string;
  setTxid(value: string): Transaction;

  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): Transaction;
  hasAmount(): boolean;
  clearAmount(): Transaction;

  getConfirmations(): number;
  setConfirmations(value: number): Transaction;

  getTo(): string;
  setTo(value: string): Transaction;

  getTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTime(value?: google_protobuf_timestamp_pb.Timestamp): Transaction;
  hasTime(): boolean;
  clearTime(): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    id: number,
    txid: string,
    amount?: Decimal.AsObject,
    confirmations: number,
    to: string,
    time?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class GetTransactionsRequest extends jspb.Message {
  getIsinput(): boolean;
  setIsinput(value: boolean): GetTransactionsRequest;

  getLastid(): number;
  setLastid(value: number): GetTransactionsRequest;

  getCount(): number;
  setCount(value: number): GetTransactionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsRequest): GetTransactionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsRequest;
  static deserializeBinaryFromReader(message: GetTransactionsRequest, reader: jspb.BinaryReader): GetTransactionsRequest;
}

export namespace GetTransactionsRequest {
  export type AsObject = {
    isinput: boolean,
    lastid: number,
    count: number,
  }
}

export class GetTransactionsResponse extends jspb.Message {
  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): GetTransactionsResponse;
  clearTransactionsList(): GetTransactionsResponse;
  addTransactions(value?: Transaction, index?: number): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsResponse): GetTransactionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsResponse;
  static deserializeBinaryFromReader(message: GetTransactionsResponse, reader: jspb.BinaryReader): GetTransactionsResponse;
}

export namespace GetTransactionsResponse {
  export type AsObject = {
    transactionsList: Array<Transaction.AsObject>,
  }
}

export class GetTransactionByIdRequest extends jspb.Message {
  getTxidList(): Array<string>;
  setTxidList(value: Array<string>): GetTransactionByIdRequest;
  clearTxidList(): GetTransactionByIdRequest;
  addTxid(value: string, index?: number): GetTransactionByIdRequest;

  getIsinput(): boolean;
  setIsinput(value: boolean): GetTransactionByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionByIdRequest): GetTransactionByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionByIdRequest;
  static deserializeBinaryFromReader(message: GetTransactionByIdRequest, reader: jspb.BinaryReader): GetTransactionByIdRequest;
}

export namespace GetTransactionByIdRequest {
  export type AsObject = {
    txidList: Array<string>,
    isinput: boolean,
  }
}

export class BtcAddress extends jspb.Message {
  getLegacy(): string;
  setLegacy(value: string): BtcAddress;

  getBech32(): string;
  setBech32(value: string): BtcAddress;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BtcAddress.AsObject;
  static toObject(includeInstance: boolean, msg: BtcAddress): BtcAddress.AsObject;
  static serializeBinaryToWriter(message: BtcAddress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BtcAddress;
  static deserializeBinaryFromReader(message: BtcAddress, reader: jspb.BinaryReader): BtcAddress;
}

export namespace BtcAddress {
  export type AsObject = {
    legacy: string,
    bech32: string,
  }
}

export class GetInputAddressResponse extends jspb.Message {
  getBtcaddress(): BtcAddress | undefined;
  setBtcaddress(value?: BtcAddress): GetInputAddressResponse;
  hasBtcaddress(): boolean;
  clearBtcaddress(): GetInputAddressResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInputAddressResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInputAddressResponse): GetInputAddressResponse.AsObject;
  static serializeBinaryToWriter(message: GetInputAddressResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInputAddressResponse;
  static deserializeBinaryFromReader(message: GetInputAddressResponse, reader: jspb.BinaryReader): GetInputAddressResponse;
}

export namespace GetInputAddressResponse {
  export type AsObject = {
    btcaddress?: BtcAddress.AsObject,
  }
}

export class CreateTransactionRequest extends jspb.Message {
  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): CreateTransactionRequest;
  hasAmount(): boolean;
  clearAmount(): CreateTransactionRequest;

  getTargetaddress(): string;
  setTargetaddress(value: string): CreateTransactionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTransactionRequest): CreateTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: CreateTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTransactionRequest;
  static deserializeBinaryFromReader(message: CreateTransactionRequest, reader: jspb.BinaryReader): CreateTransactionRequest;
}

export namespace CreateTransactionRequest {
  export type AsObject = {
    amount?: Decimal.AsObject,
    targetaddress: string,
  }
}

export class GetFeesResponse extends jspb.Message {
  getFee(): Decimal | undefined;
  setFee(value?: Decimal): GetFeesResponse;
  hasFee(): boolean;
  clearFee(): GetFeesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeesResponse): GetFeesResponse.AsObject;
  static serializeBinaryToWriter(message: GetFeesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeesResponse;
  static deserializeBinaryFromReader(message: GetFeesResponse, reader: jspb.BinaryReader): GetFeesResponse;
}

export namespace GetFeesResponse {
  export type AsObject = {
    fee?: Decimal.AsObject,
  }
}

export class AllAdvertisementsStatus extends jspb.Message {
  getSalesdisabled(): boolean;
  setSalesdisabled(value: boolean): AllAdvertisementsStatus;

  getBuysdisabled(): boolean;
  setBuysdisabled(value: boolean): AllAdvertisementsStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllAdvertisementsStatus.AsObject;
  static toObject(includeInstance: boolean, msg: AllAdvertisementsStatus): AllAdvertisementsStatus.AsObject;
  static serializeBinaryToWriter(message: AllAdvertisementsStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllAdvertisementsStatus;
  static deserializeBinaryFromReader(message: AllAdvertisementsStatus, reader: jspb.BinaryReader): AllAdvertisementsStatus;
}

export namespace AllAdvertisementsStatus {
  export type AsObject = {
    salesdisabled: boolean,
    buysdisabled: boolean,
  }
}

export class IsUserExistRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): IsUserExistRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsUserExistRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IsUserExistRequest): IsUserExistRequest.AsObject;
  static serializeBinaryToWriter(message: IsUserExistRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsUserExistRequest;
  static deserializeBinaryFromReader(message: IsUserExistRequest, reader: jspb.BinaryReader): IsUserExistRequest;
}

export namespace IsUserExistRequest {
  export type AsObject = {
    username: string,
  }
}

export class IsUserExistResponse extends jspb.Message {
  getIsexist(): boolean;
  setIsexist(value: boolean): IsUserExistResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsUserExistResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IsUserExistResponse): IsUserExistResponse.AsObject;
  static serializeBinaryToWriter(message: IsUserExistResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsUserExistResponse;
  static deserializeBinaryFromReader(message: IsUserExistResponse, reader: jspb.BinaryReader): IsUserExistResponse;
}

export namespace IsUserExistResponse {
  export type AsObject = {
    isexist: boolean,
  }
}

export class Webhook extends jspb.Message {
  getClientcrt(): string;
  setClientcrt(value: string): Webhook;

  getClientkey(): string;
  setClientkey(value: string): Webhook;

  getServercrt(): string;
  setServercrt(value: string): Webhook;

  getUrl(): string;
  setUrl(value: string): Webhook;

  getRequired(): boolean;
  setRequired(value: boolean): Webhook;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Webhook.AsObject;
  static toObject(includeInstance: boolean, msg: Webhook): Webhook.AsObject;
  static serializeBinaryToWriter(message: Webhook, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Webhook;
  static deserializeBinaryFromReader(message: Webhook, reader: jspb.BinaryReader): Webhook;
}

export namespace Webhook {
  export type AsObject = {
    clientcrt: string,
    clientkey: string,
    servercrt: string,
    url: string,
    required: boolean,
  }
}

export class Invoice extends jspb.Message {
  getId(): number;
  setId(value: number): Invoice;

  getIsprivate(): boolean;
  setIsprivate(value: boolean): Invoice;

  getIsbasecrypto(): boolean;
  setIsbasecrypto(value: boolean): Invoice;

  getPrice(): Decimal | undefined;
  setPrice(value?: Decimal): Invoice;
  hasPrice(): boolean;
  clearPrice(): Invoice;

  getFiatcurrency(): string;
  setFiatcurrency(value: string): Invoice;

  getPricevariable(): string;
  setPricevariable(value: string): Invoice;

  getTtlminutes(): number;
  setTtlminutes(value: number): Invoice;

  getComment(): string;
  setComment(value: string): Invoice;

  getPiecesmin(): number;
  setPiecesmin(value: number): Invoice;

  getPiecesmax(): number;
  setPiecesmax(value: number): Invoice;

  getStatus(): Invoice.InvoiceStatus;
  setStatus(value: Invoice.InvoiceStatus): Invoice;

  getTotalpayedcrypto(): Decimal | undefined;
  setTotalpayedcrypto(value?: Decimal): Invoice;
  hasTotalpayedcrypto(): boolean;
  clearTotalpayedcrypto(): Invoice;

  getPaymentscount(): number;
  setPaymentscount(value: number): Invoice;

  getOwner(): UserInfo | undefined;
  setOwner(value?: UserInfo): Invoice;
  hasOwner(): boolean;
  clearOwner(): Invoice;

  getTargetuserisnull(): boolean;
  setTargetuserisnull(value: boolean): Invoice;

  getTargetuser(): UserInfo | undefined;
  setTargetuser(value?: UserInfo): Invoice;
  hasTargetuser(): boolean;
  clearTargetuser(): Invoice;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Invoice;
  hasCreatedat(): boolean;
  clearCreatedat(): Invoice;

  getValidto(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setValidto(value?: google_protobuf_timestamp_pb.Timestamp): Invoice;
  hasValidto(): boolean;
  clearValidto(): Invoice;

  getFee(): Decimal | undefined;
  setFee(value?: Decimal): Invoice;
  hasFee(): boolean;
  clearFee(): Invoice;

  getLimitliquidity(): boolean;
  setLimitliquidity(value: boolean): Invoice;

  getCurrentcryptoprice(): Decimal | undefined;
  setCurrentcryptoprice(value?: Decimal): Invoice;
  hasCurrentcryptoprice(): boolean;
  clearCurrentcryptoprice(): Invoice;

  getRefundisnull(): boolean;
  setRefundisnull(value: boolean): Invoice;

  getRefundpaymentid(): number;
  setRefundpaymentid(value: number): Invoice;

  getService(): Invoice.ServiceType;
  setService(value: Invoice.ServiceType): Invoice;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): Invoice;
  clearImagesList(): Invoice;
  addImages(value: string, index?: number): Invoice;

  getSecretscount(): number;
  setSecretscount(value: number): Invoice;

  getNointegration(): boolean;
  setNointegration(value: boolean): Invoice;

  getRedirect(): string;
  setRedirect(value: string): Invoice;

  getWebhook(): Webhook | undefined;
  setWebhook(value?: Webhook): Invoice;
  hasWebhook(): boolean;
  clearWebhook(): Invoice;

  getNullabletargetuserCase(): Invoice.NullabletargetuserCase;

  getNullablerefundCase(): Invoice.NullablerefundCase;

  getIntegrationCase(): Invoice.IntegrationCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Invoice.AsObject;
  static toObject(includeInstance: boolean, msg: Invoice): Invoice.AsObject;
  static serializeBinaryToWriter(message: Invoice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Invoice;
  static deserializeBinaryFromReader(message: Invoice, reader: jspb.BinaryReader): Invoice;
}

export namespace Invoice {
  export type AsObject = {
    id: number,
    isprivate: boolean,
    isbasecrypto: boolean,
    price?: Decimal.AsObject,
    fiatcurrency: string,
    pricevariable: string,
    ttlminutes: number,
    comment: string,
    piecesmin: number,
    piecesmax: number,
    status: Invoice.InvoiceStatus,
    totalpayedcrypto?: Decimal.AsObject,
    paymentscount: number,
    owner?: UserInfo.AsObject,
    targetuserisnull: boolean,
    targetuser?: UserInfo.AsObject,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    validto?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    fee?: Decimal.AsObject,
    limitliquidity: boolean,
    currentcryptoprice?: Decimal.AsObject,
    refundisnull: boolean,
    refundpaymentid: number,
    service: Invoice.ServiceType,
    imagesList: Array<string>,
    secretscount: number,
    nointegration: boolean,
    redirect: string,
    webhook?: Webhook.AsObject,
  }

  export enum InvoiceStatus { 
    ACTIVE = 0,
    PENDINGPAY = 1,
    NOPIECES = 2,
    PAYED = 3,
    DELETED = 4,
  }

  export enum ServiceType { 
    NONE = 0,
    AUTOPRICE = 1,
  }

  export enum NullabletargetuserCase { 
    NULLABLETARGETUSER_NOT_SET = 0,
    TARGETUSERISNULL = 15,
    TARGETUSER = 16,
  }

  export enum NullablerefundCase { 
    NULLABLEREFUND_NOT_SET = 0,
    REFUNDISNULL = 22,
    REFUNDPAYMENTID = 23,
  }

  export enum IntegrationCase { 
    INTEGRATION_NOT_SET = 0,
    NOINTEGRATION = 27,
    REDIRECT = 28,
    WEBHOOK = 29,
  }
}

export class CreateInvoiceRequest extends jspb.Message {
  getIsprivate(): boolean;
  setIsprivate(value: boolean): CreateInvoiceRequest;

  getIsbasecrypto(): boolean;
  setIsbasecrypto(value: boolean): CreateInvoiceRequest;

  getUsername(): string;
  setUsername(value: string): CreateInvoiceRequest;

  getPrice(): Decimal | undefined;
  setPrice(value?: Decimal): CreateInvoiceRequest;
  hasPrice(): boolean;
  clearPrice(): CreateInvoiceRequest;

  getFiatcurrency(): string;
  setFiatcurrency(value: string): CreateInvoiceRequest;

  getPricevariable(): string;
  setPricevariable(value: string): CreateInvoiceRequest;

  getTtlminutes(): number;
  setTtlminutes(value: number): CreateInvoiceRequest;

  getComment(): string;
  setComment(value: string): CreateInvoiceRequest;

  getPiecesmin(): number;
  setPiecesmin(value: number): CreateInvoiceRequest;

  getPiecesmax(): number;
  setPiecesmax(value: number): CreateInvoiceRequest;

  getLimitliquidity(): boolean;
  setLimitliquidity(value: boolean): CreateInvoiceRequest;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): CreateInvoiceRequest;
  clearImagesList(): CreateInvoiceRequest;
  addImages(value: string, index?: number): CreateInvoiceRequest;

  getSecretsList(): Array<CreateInvoiceSecretRequest>;
  setSecretsList(value: Array<CreateInvoiceSecretRequest>): CreateInvoiceRequest;
  clearSecretsList(): CreateInvoiceRequest;
  addSecrets(value?: CreateInvoiceSecretRequest, index?: number): CreateInvoiceSecretRequest;

  getNointegration(): boolean;
  setNointegration(value: boolean): CreateInvoiceRequest;

  getRedirect(): string;
  setRedirect(value: string): CreateInvoiceRequest;

  getWebhook(): Webhook | undefined;
  setWebhook(value?: Webhook): CreateInvoiceRequest;
  hasWebhook(): boolean;
  clearWebhook(): CreateInvoiceRequest;

  getIntegrationCase(): CreateInvoiceRequest.IntegrationCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInvoiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInvoiceRequest): CreateInvoiceRequest.AsObject;
  static serializeBinaryToWriter(message: CreateInvoiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInvoiceRequest;
  static deserializeBinaryFromReader(message: CreateInvoiceRequest, reader: jspb.BinaryReader): CreateInvoiceRequest;
}

export namespace CreateInvoiceRequest {
  export type AsObject = {
    isprivate: boolean,
    isbasecrypto: boolean,
    username: string,
    price?: Decimal.AsObject,
    fiatcurrency: string,
    pricevariable: string,
    ttlminutes: number,
    comment: string,
    piecesmin: number,
    piecesmax: number,
    limitliquidity: boolean,
    imagesList: Array<string>,
    secretsList: Array<CreateInvoiceSecretRequest.AsObject>,
    nointegration: boolean,
    redirect: string,
    webhook?: Webhook.AsObject,
  }

  export enum IntegrationCase { 
    INTEGRATION_NOT_SET = 0,
    NOINTEGRATION = 14,
    REDIRECT = 15,
    WEBHOOK = 16,
  }
}

export class UpdatePublicInvoiceRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): UpdatePublicInvoiceRequest;

  getIsbasecrypto(): boolean;
  setIsbasecrypto(value: boolean): UpdatePublicInvoiceRequest;

  getPrice(): Decimal | undefined;
  setPrice(value?: Decimal): UpdatePublicInvoiceRequest;
  hasPrice(): boolean;
  clearPrice(): UpdatePublicInvoiceRequest;

  getFiatcurrency(): string;
  setFiatcurrency(value: string): UpdatePublicInvoiceRequest;

  getPricevariable(): string;
  setPricevariable(value: string): UpdatePublicInvoiceRequest;

  getComment(): string;
  setComment(value: string): UpdatePublicInvoiceRequest;

  getPiecesmin(): number;
  setPiecesmin(value: number): UpdatePublicInvoiceRequest;

  getPiecesmax(): number;
  setPiecesmax(value: number): UpdatePublicInvoiceRequest;

  getLimitliquidity(): boolean;
  setLimitliquidity(value: boolean): UpdatePublicInvoiceRequest;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): UpdatePublicInvoiceRequest;
  clearImagesList(): UpdatePublicInvoiceRequest;
  addImages(value: string, index?: number): UpdatePublicInvoiceRequest;

  getNointegration(): boolean;
  setNointegration(value: boolean): UpdatePublicInvoiceRequest;

  getRedirect(): string;
  setRedirect(value: string): UpdatePublicInvoiceRequest;

  getWebhook(): Webhook | undefined;
  setWebhook(value?: Webhook): UpdatePublicInvoiceRequest;
  hasWebhook(): boolean;
  clearWebhook(): UpdatePublicInvoiceRequest;

  getIntegrationCase(): UpdatePublicInvoiceRequest.IntegrationCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePublicInvoiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePublicInvoiceRequest): UpdatePublicInvoiceRequest.AsObject;
  static serializeBinaryToWriter(message: UpdatePublicInvoiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePublicInvoiceRequest;
  static deserializeBinaryFromReader(message: UpdatePublicInvoiceRequest, reader: jspb.BinaryReader): UpdatePublicInvoiceRequest;
}

export namespace UpdatePublicInvoiceRequest {
  export type AsObject = {
    invoiceid: number,
    isbasecrypto: boolean,
    price?: Decimal.AsObject,
    fiatcurrency: string,
    pricevariable: string,
    comment: string,
    piecesmin: number,
    piecesmax: number,
    limitliquidity: boolean,
    imagesList: Array<string>,
    nointegration: boolean,
    redirect: string,
    webhook?: Webhook.AsObject,
  }

  export enum IntegrationCase { 
    INTEGRATION_NOT_SET = 0,
    NOINTEGRATION = 11,
    REDIRECT = 12,
    WEBHOOK = 13,
  }
}

export class SubscribePublicInvoiceRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): SubscribePublicInvoiceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribePublicInvoiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribePublicInvoiceRequest): SubscribePublicInvoiceRequest.AsObject;
  static serializeBinaryToWriter(message: SubscribePublicInvoiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribePublicInvoiceRequest;
  static deserializeBinaryFromReader(message: SubscribePublicInvoiceRequest, reader: jspb.BinaryReader): SubscribePublicInvoiceRequest;
}

export namespace SubscribePublicInvoiceRequest {
  export type AsObject = {
    invoiceid: number,
  }
}

export class SubscribePublicInvoiceResponse extends jspb.Message {
  getInvoice(): Invoice | undefined;
  setInvoice(value?: Invoice): SubscribePublicInvoiceResponse;
  hasInvoice(): boolean;
  clearInvoice(): SubscribePublicInvoiceResponse;

  getInvoicedeleted(): boolean;
  setInvoicedeleted(value: boolean): SubscribePublicInvoiceResponse;

  getKeepalive(): boolean;
  setKeepalive(value: boolean): SubscribePublicInvoiceResponse;

  getContentCase(): SubscribePublicInvoiceResponse.ContentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribePublicInvoiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribePublicInvoiceResponse): SubscribePublicInvoiceResponse.AsObject;
  static serializeBinaryToWriter(message: SubscribePublicInvoiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribePublicInvoiceResponse;
  static deserializeBinaryFromReader(message: SubscribePublicInvoiceResponse, reader: jspb.BinaryReader): SubscribePublicInvoiceResponse;
}

export namespace SubscribePublicInvoiceResponse {
  export type AsObject = {
    invoice?: Invoice.AsObject,
    invoicedeleted: boolean,
    keepalive: boolean,
  }

  export enum ContentCase { 
    CONTENT_NOT_SET = 0,
    INVOICE = 1,
    INVOICEDELETED = 2,
    KEEPALIVE = 3,
  }
}

export class DeleteInvoiceRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): DeleteInvoiceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteInvoiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteInvoiceRequest): DeleteInvoiceRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteInvoiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteInvoiceRequest;
  static deserializeBinaryFromReader(message: DeleteInvoiceRequest, reader: jspb.BinaryReader): DeleteInvoiceRequest;
}

export namespace DeleteInvoiceRequest {
  export type AsObject = {
    invoiceid: number,
  }
}

export class DeleteInvoiceResponse extends jspb.Message {
  getRefundisnull(): boolean;
  setRefundisnull(value: boolean): DeleteInvoiceResponse;

  getPaymentrefund(): InvoicePayment | undefined;
  setPaymentrefund(value?: InvoicePayment): DeleteInvoiceResponse;
  hasPaymentrefund(): boolean;
  clearPaymentrefund(): DeleteInvoiceResponse;

  getRefundCase(): DeleteInvoiceResponse.RefundCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteInvoiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteInvoiceResponse): DeleteInvoiceResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteInvoiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteInvoiceResponse;
  static deserializeBinaryFromReader(message: DeleteInvoiceResponse, reader: jspb.BinaryReader): DeleteInvoiceResponse;
}

export namespace DeleteInvoiceResponse {
  export type AsObject = {
    refundisnull: boolean,
    paymentrefund?: InvoicePayment.AsObject,
  }

  export enum RefundCase { 
    REFUND_NOT_SET = 0,
    REFUNDISNULL = 1,
    PAYMENTREFUND = 2,
  }
}

export class GetInvoicesRequest extends jspb.Message {
  getIsowner(): boolean;
  setIsowner(value: boolean): GetInvoicesRequest;

  getIsownerhasvalue(): boolean;
  setIsownerhasvalue(value: boolean): GetInvoicesRequest;

  getStatusesList(): Array<Invoice.InvoiceStatus>;
  setStatusesList(value: Array<Invoice.InvoiceStatus>): GetInvoicesRequest;
  clearStatusesList(): GetInvoicesRequest;
  addStatuses(value: Invoice.InvoiceStatus, index?: number): GetInvoicesRequest;

  getIsprivate(): boolean;
  setIsprivate(value: boolean): GetInvoicesRequest;

  getIsprivatehasvalue(): boolean;
  setIsprivatehasvalue(value: boolean): GetInvoicesRequest;

  getId(): number;
  setId(value: number): GetInvoicesRequest;

  getTouser(): string;
  setTouser(value: string): GetInvoicesRequest;

  getLastid(): number;
  setLastid(value: number): GetInvoicesRequest;

  getCount(): number;
  setCount(value: number): GetInvoicesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoicesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoicesRequest): GetInvoicesRequest.AsObject;
  static serializeBinaryToWriter(message: GetInvoicesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoicesRequest;
  static deserializeBinaryFromReader(message: GetInvoicesRequest, reader: jspb.BinaryReader): GetInvoicesRequest;
}

export namespace GetInvoicesRequest {
  export type AsObject = {
    isowner: boolean,
    isownerhasvalue: boolean,
    statusesList: Array<Invoice.InvoiceStatus>,
    isprivate: boolean,
    isprivatehasvalue: boolean,
    id: number,
    touser: string,
    lastid: number,
    count: number,
  }
}

export class GetInvoicesResponse extends jspb.Message {
  getInvoicesList(): Array<Invoice>;
  setInvoicesList(value: Array<Invoice>): GetInvoicesResponse;
  clearInvoicesList(): GetInvoicesResponse;
  addInvoices(value?: Invoice, index?: number): Invoice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoicesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoicesResponse): GetInvoicesResponse.AsObject;
  static serializeBinaryToWriter(message: GetInvoicesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoicesResponse;
  static deserializeBinaryFromReader(message: GetInvoicesResponse, reader: jspb.BinaryReader): GetInvoicesResponse;
}

export namespace GetInvoicesResponse {
  export type AsObject = {
    invoicesList: Array<Invoice.AsObject>,
  }
}

export class GetInvoiceByIdRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): GetInvoiceByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoiceByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoiceByIdRequest): GetInvoiceByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetInvoiceByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoiceByIdRequest;
  static deserializeBinaryFromReader(message: GetInvoiceByIdRequest, reader: jspb.BinaryReader): GetInvoiceByIdRequest;
}

export namespace GetInvoiceByIdRequest {
  export type AsObject = {
    invoiceid: number,
  }
}

export class PayInvoiceFromBalanceRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): PayInvoiceFromBalanceRequest;

  getPieces(): number;
  setPieces(value: number): PayInvoiceFromBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceFromBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceFromBalanceRequest): PayInvoiceFromBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: PayInvoiceFromBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceFromBalanceRequest;
  static deserializeBinaryFromReader(message: PayInvoiceFromBalanceRequest, reader: jspb.BinaryReader): PayInvoiceFromBalanceRequest;
}

export namespace PayInvoiceFromBalanceRequest {
  export type AsObject = {
    invoiceid: number,
    pieces: number,
  }
}

export class InvoicePayment extends jspb.Message {
  getId(): number;
  setId(value: number): InvoicePayment;

  getCryptoamount(): Decimal | undefined;
  setCryptoamount(value?: Decimal): InvoicePayment;
  hasCryptoamount(): boolean;
  clearCryptoamount(): InvoicePayment;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): InvoicePayment;
  hasCreatedat(): boolean;
  clearCreatedat(): InvoicePayment;

  getConfirmation(): string;
  setConfirmation(value: string): InvoicePayment;

  getOwner(): UserInfo | undefined;
  setOwner(value?: UserInfo): InvoicePayment;
  hasOwner(): boolean;
  clearOwner(): InvoicePayment;

  getInvoice(): Invoice | undefined;
  setInvoice(value?: Invoice): InvoicePayment;
  hasInvoice(): boolean;
  clearInvoice(): InvoicePayment;

  getSellerfeedbackisnull(): boolean;
  setSellerfeedbackisnull(value: boolean): InvoicePayment;

  getSellerfeedback(): Feedback | undefined;
  setSellerfeedback(value?: Feedback): InvoicePayment;
  hasSellerfeedback(): boolean;
  clearSellerfeedback(): InvoicePayment;

  getOwnerfeedbackisnull(): boolean;
  setOwnerfeedbackisnull(value: boolean): InvoicePayment;

  getOwnerfeedback(): Feedback | undefined;
  setOwnerfeedback(value?: Feedback): InvoicePayment;
  hasOwnerfeedback(): boolean;
  clearOwnerfeedback(): InvoicePayment;

  getStatus(): InvoicePayment.InvoicePaymentStatus;
  setStatus(value: InvoicePayment.InvoicePaymentStatus): InvoicePayment;

  getDealisnull(): boolean;
  setDealisnull(value: boolean): InvoicePayment;

  getDeal(): Deal | undefined;
  setDeal(value?: Deal): InvoicePayment;
  hasDeal(): boolean;
  clearDeal(): InvoicePayment;

  getPieces(): number;
  setPieces(value: number): InvoicePayment;

  getIsrefund(): boolean;
  setIsrefund(value: boolean): InvoicePayment;

  getRefundsList(): Array<Invoice>;
  setRefundsList(value: Array<Invoice>): InvoicePayment;
  clearRefundsList(): InvoicePayment;
  addRefunds(value?: Invoice, index?: number): Invoice;

  getRefunded(): number;
  setRefunded(value: number): InvoicePayment;

  getRefunding(): number;
  setRefunding(value: number): InvoicePayment;

  getOddpromise(): string;
  setOddpromise(value: string): InvoicePayment;

  getSecretsList(): Array<InvoiceSecret>;
  setSecretsList(value: Array<InvoiceSecret>): InvoicePayment;
  clearSecretsList(): InvoicePayment;
  addSecrets(value?: InvoiceSecret, index?: number): InvoiceSecret;

  getLninvoice(): string;
  setLninvoice(value: string): InvoicePayment;

  getNullablesellerfeedbackCase(): InvoicePayment.NullablesellerfeedbackCase;

  getNullableownerfeedbackCase(): InvoicePayment.NullableownerfeedbackCase;

  getNullabledealCase(): InvoicePayment.NullabledealCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvoicePayment.AsObject;
  static toObject(includeInstance: boolean, msg: InvoicePayment): InvoicePayment.AsObject;
  static serializeBinaryToWriter(message: InvoicePayment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvoicePayment;
  static deserializeBinaryFromReader(message: InvoicePayment, reader: jspb.BinaryReader): InvoicePayment;
}

export namespace InvoicePayment {
  export type AsObject = {
    id: number,
    cryptoamount?: Decimal.AsObject,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    confirmation: string,
    owner?: UserInfo.AsObject,
    invoice?: Invoice.AsObject,
    sellerfeedbackisnull: boolean,
    sellerfeedback?: Feedback.AsObject,
    ownerfeedbackisnull: boolean,
    ownerfeedback?: Feedback.AsObject,
    status: InvoicePayment.InvoicePaymentStatus,
    dealisnull: boolean,
    deal?: Deal.AsObject,
    pieces: number,
    isrefund: boolean,
    refundsList: Array<Invoice.AsObject>,
    refunded: number,
    refunding: number,
    oddpromise: string,
    secretsList: Array<InvoiceSecret.AsObject>,
    lninvoice: string,
  }

  export enum InvoicePaymentStatus { 
    PENDING = 0,
    PAID = 1,
    CANCELED = 2,
  }

  export enum NullablesellerfeedbackCase { 
    NULLABLESELLERFEEDBACK_NOT_SET = 0,
    SELLERFEEDBACKISNULL = 7,
    SELLERFEEDBACK = 8,
  }

  export enum NullableownerfeedbackCase { 
    NULLABLEOWNERFEEDBACK_NOT_SET = 0,
    OWNERFEEDBACKISNULL = 9,
    OWNERFEEDBACK = 10,
  }

  export enum NullabledealCase { 
    NULLABLEDEAL_NOT_SET = 0,
    DEALISNULL = 12,
    DEAL = 13,
  }
}

export class GetInvoicePaymentsRequest extends jspb.Message {
  getPaymentid(): number;
  setPaymentid(value: number): GetInvoicePaymentsRequest;

  getIstome(): boolean;
  setIstome(value: boolean): GetInvoicePaymentsRequest;

  getIstomehasvalue(): boolean;
  setIstomehasvalue(value: boolean): GetInvoicePaymentsRequest;

  getLastid(): number;
  setLastid(value: number): GetInvoicePaymentsRequest;

  getCount(): number;
  setCount(value: number): GetInvoicePaymentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoicePaymentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoicePaymentsRequest): GetInvoicePaymentsRequest.AsObject;
  static serializeBinaryToWriter(message: GetInvoicePaymentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoicePaymentsRequest;
  static deserializeBinaryFromReader(message: GetInvoicePaymentsRequest, reader: jspb.BinaryReader): GetInvoicePaymentsRequest;
}

export namespace GetInvoicePaymentsRequest {
  export type AsObject = {
    paymentid: number,
    istome: boolean,
    istomehasvalue: boolean,
    lastid: number,
    count: number,
  }
}

export class GetInvoicePaymentsResponse extends jspb.Message {
  getPaymentsList(): Array<InvoicePayment>;
  setPaymentsList(value: Array<InvoicePayment>): GetInvoicePaymentsResponse;
  clearPaymentsList(): GetInvoicePaymentsResponse;
  addPayments(value?: InvoicePayment, index?: number): InvoicePayment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoicePaymentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoicePaymentsResponse): GetInvoicePaymentsResponse.AsObject;
  static serializeBinaryToWriter(message: GetInvoicePaymentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoicePaymentsResponse;
  static deserializeBinaryFromReader(message: GetInvoicePaymentsResponse, reader: jspb.BinaryReader): GetInvoicePaymentsResponse;
}

export namespace GetInvoicePaymentsResponse {
  export type AsObject = {
    paymentsList: Array<InvoicePayment.AsObject>,
  }
}

export class LastAdSearchParams extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): LastAdSearchParams;

  getCurrency(): string;
  setCurrency(value: string): LastAdSearchParams;

  getPaymenttype(): string;
  setPaymenttype(value: string): LastAdSearchParams;

  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): LastAdSearchParams;
  hasAmount(): boolean;
  clearAmount(): LastAdSearchParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LastAdSearchParams.AsObject;
  static toObject(includeInstance: boolean, msg: LastAdSearchParams): LastAdSearchParams.AsObject;
  static serializeBinaryToWriter(message: LastAdSearchParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LastAdSearchParams;
  static deserializeBinaryFromReader(message: LastAdSearchParams, reader: jspb.BinaryReader): LastAdSearchParams;
}

export namespace LastAdSearchParams {
  export type AsObject = {
    country: string,
    currency: string,
    paymenttype: string,
    amount?: Decimal.AsObject,
  }
}

export class GetLastAdSearchParamsResponse extends jspb.Message {
  getLastbuysearchhasvalue(): boolean;
  setLastbuysearchhasvalue(value: boolean): GetLastAdSearchParamsResponse;

  getLastsellsearchhasvalue(): boolean;
  setLastsellsearchhasvalue(value: boolean): GetLastAdSearchParamsResponse;

  getLastbuysearch(): LastAdSearchParams | undefined;
  setLastbuysearch(value?: LastAdSearchParams): GetLastAdSearchParamsResponse;
  hasLastbuysearch(): boolean;
  clearLastbuysearch(): GetLastAdSearchParamsResponse;

  getLastsellsearch(): LastAdSearchParams | undefined;
  setLastsellsearch(value?: LastAdSearchParams): GetLastAdSearchParamsResponse;
  hasLastsellsearch(): boolean;
  clearLastsellsearch(): GetLastAdSearchParamsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLastAdSearchParamsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLastAdSearchParamsResponse): GetLastAdSearchParamsResponse.AsObject;
  static serializeBinaryToWriter(message: GetLastAdSearchParamsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLastAdSearchParamsResponse;
  static deserializeBinaryFromReader(message: GetLastAdSearchParamsResponse, reader: jspb.BinaryReader): GetLastAdSearchParamsResponse;
}

export namespace GetLastAdSearchParamsResponse {
  export type AsObject = {
    lastbuysearchhasvalue: boolean,
    lastsellsearchhasvalue: boolean,
    lastbuysearch?: LastAdSearchParams.AsObject,
    lastsellsearch?: LastAdSearchParams.AsObject,
  }
}

export class SendInvoicePaymentFeedbackRequest extends jspb.Message {
  getPaymentid(): number;
  setPaymentid(value: number): SendInvoicePaymentFeedbackRequest;

  getFeedback(): Feedback | undefined;
  setFeedback(value?: Feedback): SendInvoicePaymentFeedbackRequest;
  hasFeedback(): boolean;
  clearFeedback(): SendInvoicePaymentFeedbackRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendInvoicePaymentFeedbackRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendInvoicePaymentFeedbackRequest): SendInvoicePaymentFeedbackRequest.AsObject;
  static serializeBinaryToWriter(message: SendInvoicePaymentFeedbackRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendInvoicePaymentFeedbackRequest;
  static deserializeBinaryFromReader(message: SendInvoicePaymentFeedbackRequest, reader: jspb.BinaryReader): SendInvoicePaymentFeedbackRequest;
}

export namespace SendInvoicePaymentFeedbackRequest {
  export type AsObject = {
    paymentid: number,
    feedback?: Feedback.AsObject,
  }
}

export class PayInvoiceByBestDealRequest extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): PayInvoiceByBestDealRequest;

  getCurrency(): string;
  setCurrency(value: string): PayInvoiceByBestDealRequest;

  getPaymenttype(): string;
  setPaymenttype(value: string): PayInvoiceByBestDealRequest;

  getInvoiceid(): number;
  setInvoiceid(value: number): PayInvoiceByBestDealRequest;

  getPieces(): number;
  setPieces(value: number): PayInvoiceByBestDealRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceByBestDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceByBestDealRequest): PayInvoiceByBestDealRequest.AsObject;
  static serializeBinaryToWriter(message: PayInvoiceByBestDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceByBestDealRequest;
  static deserializeBinaryFromReader(message: PayInvoiceByBestDealRequest, reader: jspb.BinaryReader): PayInvoiceByBestDealRequest;
}

export namespace PayInvoiceByBestDealRequest {
  export type AsObject = {
    country: string,
    currency: string,
    paymenttype: string,
    invoiceid: number,
    pieces: number,
  }
}

export class GetInvoiceSuitableAdvertisementsRequest extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): GetInvoiceSuitableAdvertisementsRequest;

  getCurrency(): string;
  setCurrency(value: string): GetInvoiceSuitableAdvertisementsRequest;

  getPaymenttype(): string;
  setPaymenttype(value: string): GetInvoiceSuitableAdvertisementsRequest;

  getInvoiceid(): number;
  setInvoiceid(value: number): GetInvoiceSuitableAdvertisementsRequest;

  getPieces(): number;
  setPieces(value: number): GetInvoiceSuitableAdvertisementsRequest;

  getSkip(): number;
  setSkip(value: number): GetInvoiceSuitableAdvertisementsRequest;

  getCount(): number;
  setCount(value: number): GetInvoiceSuitableAdvertisementsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoiceSuitableAdvertisementsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoiceSuitableAdvertisementsRequest): GetInvoiceSuitableAdvertisementsRequest.AsObject;
  static serializeBinaryToWriter(message: GetInvoiceSuitableAdvertisementsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoiceSuitableAdvertisementsRequest;
  static deserializeBinaryFromReader(message: GetInvoiceSuitableAdvertisementsRequest, reader: jspb.BinaryReader): GetInvoiceSuitableAdvertisementsRequest;
}

export namespace GetInvoiceSuitableAdvertisementsRequest {
  export type AsObject = {
    country: string,
    currency: string,
    paymenttype: string,
    invoiceid: number,
    pieces: number,
    skip: number,
    count: number,
  }
}

export class GetInvoiceSuitableAdvertisementResponse extends jspb.Message {
  getAdvertisementsList(): Array<Advertisement>;
  setAdvertisementsList(value: Array<Advertisement>): GetInvoiceSuitableAdvertisementResponse;
  clearAdvertisementsList(): GetInvoiceSuitableAdvertisementResponse;
  addAdvertisements(value?: Advertisement, index?: number): Advertisement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoiceSuitableAdvertisementResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoiceSuitableAdvertisementResponse): GetInvoiceSuitableAdvertisementResponse.AsObject;
  static serializeBinaryToWriter(message: GetInvoiceSuitableAdvertisementResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoiceSuitableAdvertisementResponse;
  static deserializeBinaryFromReader(message: GetInvoiceSuitableAdvertisementResponse, reader: jspb.BinaryReader): GetInvoiceSuitableAdvertisementResponse;
}

export namespace GetInvoiceSuitableAdvertisementResponse {
  export type AsObject = {
    advertisementsList: Array<Advertisement.AsObject>,
  }
}

export class PayInvoiceByDealRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): PayInvoiceByDealRequest;

  getPieces(): number;
  setPieces(value: number): PayInvoiceByDealRequest;

  getAdvertisementid(): number;
  setAdvertisementid(value: number): PayInvoiceByDealRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceByDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceByDealRequest): PayInvoiceByDealRequest.AsObject;
  static serializeBinaryToWriter(message: PayInvoiceByDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceByDealRequest;
  static deserializeBinaryFromReader(message: PayInvoiceByDealRequest, reader: jspb.BinaryReader): PayInvoiceByDealRequest;
}

export namespace PayInvoiceByDealRequest {
  export type AsObject = {
    invoiceid: number,
    pieces: number,
    advertisementid: number,
  }
}

export class CancelInvoicePaymentRequest extends jspb.Message {
  getPaymentid(): number;
  setPaymentid(value: number): CancelInvoicePaymentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelInvoicePaymentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CancelInvoicePaymentRequest): CancelInvoicePaymentRequest.AsObject;
  static serializeBinaryToWriter(message: CancelInvoicePaymentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelInvoicePaymentRequest;
  static deserializeBinaryFromReader(message: CancelInvoicePaymentRequest, reader: jspb.BinaryReader): CancelInvoicePaymentRequest;
}

export namespace CancelInvoicePaymentRequest {
  export type AsObject = {
    paymentid: number,
  }
}

export class ConversationMessage extends jspb.Message {
  getId(): number;
  setId(value: number): ConversationMessage;

  getOwnerid(): string;
  setOwnerid(value: string): ConversationMessage;

  getText(): string;
  setText(value: string): ConversationMessage;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): ConversationMessage;
  hasCreatedat(): boolean;
  clearCreatedat(): ConversationMessage;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): ConversationMessage;
  clearImagesList(): ConversationMessage;
  addImages(value: string, index?: number): ConversationMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConversationMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ConversationMessage): ConversationMessage.AsObject;
  static serializeBinaryToWriter(message: ConversationMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConversationMessage;
  static deserializeBinaryFromReader(message: ConversationMessage, reader: jspb.BinaryReader): ConversationMessage;
}

export namespace ConversationMessage {
  export type AsObject = {
    id: number,
    ownerid: string,
    text: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    imagesList: Array<string>,
  }
}

export class Conversation extends jspb.Message {
  getId(): number;
  setId(value: number): Conversation;

  getSeller(): UserInfo | undefined;
  setSeller(value?: UserInfo): Conversation;
  hasSeller(): boolean;
  clearSeller(): Conversation;

  getBuyer(): UserInfo | undefined;
  setBuyer(value?: UserInfo): Conversation;
  hasBuyer(): boolean;
  clearBuyer(): Conversation;

  getInvoice(): Invoice | undefined;
  setInvoice(value?: Invoice): Conversation;
  hasInvoice(): boolean;
  clearInvoice(): Conversation;

  getPayment(): InvoicePayment | undefined;
  setPayment(value?: InvoicePayment): Conversation;
  hasPayment(): boolean;
  clearPayment(): Conversation;

  getMessagesList(): Array<ConversationMessage>;
  setMessagesList(value: Array<ConversationMessage>): Conversation;
  clearMessagesList(): Conversation;
  addMessages(value?: ConversationMessage, index?: number): ConversationMessage;

  getParentCase(): Conversation.ParentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Conversation.AsObject;
  static toObject(includeInstance: boolean, msg: Conversation): Conversation.AsObject;
  static serializeBinaryToWriter(message: Conversation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Conversation;
  static deserializeBinaryFromReader(message: Conversation, reader: jspb.BinaryReader): Conversation;
}

export namespace Conversation {
  export type AsObject = {
    id: number,
    seller?: UserInfo.AsObject,
    buyer?: UserInfo.AsObject,
    invoice?: Invoice.AsObject,
    payment?: InvoicePayment.AsObject,
    messagesList: Array<ConversationMessage.AsObject>,
  }

  export enum ParentCase { 
    PARENT_NOT_SET = 0,
    INVOICE = 4,
    PAYMENT = 5,
  }
}

export class SendInvoiceMessageRequest extends jspb.Message {
  getTouserid(): string;
  setTouserid(value: string): SendInvoiceMessageRequest;

  getInvoiceid(): number;
  setInvoiceid(value: number): SendInvoiceMessageRequest;

  getText(): string;
  setText(value: string): SendInvoiceMessageRequest;

  getImageidsList(): Array<string>;
  setImageidsList(value: Array<string>): SendInvoiceMessageRequest;
  clearImageidsList(): SendInvoiceMessageRequest;
  addImageids(value: string, index?: number): SendInvoiceMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendInvoiceMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendInvoiceMessageRequest): SendInvoiceMessageRequest.AsObject;
  static serializeBinaryToWriter(message: SendInvoiceMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendInvoiceMessageRequest;
  static deserializeBinaryFromReader(message: SendInvoiceMessageRequest, reader: jspb.BinaryReader): SendInvoiceMessageRequest;
}

export namespace SendInvoiceMessageRequest {
  export type AsObject = {
    touserid: string,
    invoiceid: number,
    text: string,
    imageidsList: Array<string>,
  }
}

export class SendInvoicePaymentMessageRequest extends jspb.Message {
  getPaymentid(): number;
  setPaymentid(value: number): SendInvoicePaymentMessageRequest;

  getText(): string;
  setText(value: string): SendInvoicePaymentMessageRequest;

  getImageidsList(): Array<string>;
  setImageidsList(value: Array<string>): SendInvoicePaymentMessageRequest;
  clearImageidsList(): SendInvoicePaymentMessageRequest;
  addImageids(value: string, index?: number): SendInvoicePaymentMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendInvoicePaymentMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendInvoicePaymentMessageRequest): SendInvoicePaymentMessageRequest.AsObject;
  static serializeBinaryToWriter(message: SendInvoicePaymentMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendInvoicePaymentMessageRequest;
  static deserializeBinaryFromReader(message: SendInvoicePaymentMessageRequest, reader: jspb.BinaryReader): SendInvoicePaymentMessageRequest;
}

export namespace SendInvoicePaymentMessageRequest {
  export type AsObject = {
    paymentid: number,
    text: string,
    imageidsList: Array<string>,
  }
}

export class GetConversationsResponse extends jspb.Message {
  getConversationsList(): Array<Conversation>;
  setConversationsList(value: Array<Conversation>): GetConversationsResponse;
  clearConversationsList(): GetConversationsResponse;
  addConversations(value?: Conversation, index?: number): Conversation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConversationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetConversationsResponse): GetConversationsResponse.AsObject;
  static serializeBinaryToWriter(message: GetConversationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConversationsResponse;
  static deserializeBinaryFromReader(message: GetConversationsResponse, reader: jspb.BinaryReader): GetConversationsResponse;
}

export namespace GetConversationsResponse {
  export type AsObject = {
    conversationsList: Array<Conversation.AsObject>,
  }
}

export class GetConversationsByIdRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): GetConversationsByIdRequest;

  getPaymentid(): number;
  setPaymentid(value: number): GetConversationsByIdRequest;

  getUserid(): string;
  setUserid(value: string): GetConversationsByIdRequest;

  getIdsCase(): GetConversationsByIdRequest.IdsCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConversationsByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetConversationsByIdRequest): GetConversationsByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetConversationsByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConversationsByIdRequest;
  static deserializeBinaryFromReader(message: GetConversationsByIdRequest, reader: jspb.BinaryReader): GetConversationsByIdRequest;
}

export namespace GetConversationsByIdRequest {
  export type AsObject = {
    invoiceid: number,
    paymentid: number,
    userid: string,
  }

  export enum IdsCase { 
    IDS_NOT_SET = 0,
    INVOICEID = 1,
    PAYMENTID = 2,
    USERID = 3,
  }
}

export class DeleteConversationRequest extends jspb.Message {
  getConversationid(): number;
  setConversationid(value: number): DeleteConversationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteConversationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteConversationRequest): DeleteConversationRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteConversationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteConversationRequest;
  static deserializeBinaryFromReader(message: DeleteConversationRequest, reader: jspb.BinaryReader): DeleteConversationRequest;
}

export namespace DeleteConversationRequest {
  export type AsObject = {
    conversationid: number,
  }
}

export class CreateRefundRequest extends jspb.Message {
  getPaymentid(): number;
  setPaymentid(value: number): CreateRefundRequest;

  getPieces(): number;
  setPieces(value: number): CreateRefundRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateRefundRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateRefundRequest): CreateRefundRequest.AsObject;
  static serializeBinaryToWriter(message: CreateRefundRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateRefundRequest;
  static deserializeBinaryFromReader(message: CreateRefundRequest, reader: jspb.BinaryReader): CreateRefundRequest;
}

export namespace CreateRefundRequest {
  export type AsObject = {
    paymentid: number,
    pieces: number,
  }
}

export class CreateRefundResponse extends jspb.Message {
  getPayment(): InvoicePayment | undefined;
  setPayment(value?: InvoicePayment): CreateRefundResponse;
  hasPayment(): boolean;
  clearPayment(): CreateRefundResponse;

  getRefund(): Invoice | undefined;
  setRefund(value?: Invoice): CreateRefundResponse;
  hasRefund(): boolean;
  clearRefund(): CreateRefundResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateRefundResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateRefundResponse): CreateRefundResponse.AsObject;
  static serializeBinaryToWriter(message: CreateRefundResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateRefundResponse;
  static deserializeBinaryFromReader(message: CreateRefundResponse, reader: jspb.BinaryReader): CreateRefundResponse;
}

export namespace CreateRefundResponse {
  export type AsObject = {
    payment?: InvoicePayment.AsObject,
    refund?: Invoice.AsObject,
  }
}

export class BuyAutoPriceRecalcsRequest extends jspb.Message {
  getRecalcs(): number;
  setRecalcs(value: number): BuyAutoPriceRecalcsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuyAutoPriceRecalcsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BuyAutoPriceRecalcsRequest): BuyAutoPriceRecalcsRequest.AsObject;
  static serializeBinaryToWriter(message: BuyAutoPriceRecalcsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuyAutoPriceRecalcsRequest;
  static deserializeBinaryFromReader(message: BuyAutoPriceRecalcsRequest, reader: jspb.BinaryReader): BuyAutoPriceRecalcsRequest;
}

export namespace BuyAutoPriceRecalcsRequest {
  export type AsObject = {
    recalcs: number,
  }
}

export class CreatePromiseRequest extends jspb.Message {
  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): CreatePromiseRequest;
  hasAmount(): boolean;
  clearAmount(): CreatePromiseRequest;

  getPassword(): string;
  setPassword(value: string): CreatePromiseRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePromiseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePromiseRequest): CreatePromiseRequest.AsObject;
  static serializeBinaryToWriter(message: CreatePromiseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePromiseRequest;
  static deserializeBinaryFromReader(message: CreatePromiseRequest, reader: jspb.BinaryReader): CreatePromiseRequest;
}

export namespace CreatePromiseRequest {
  export type AsObject = {
    amount?: Decimal.AsObject,
    password: string,
  }
}

export class CreatePromiseResponse extends jspb.Message {
  getPromise(): string;
  setPromise(value: string): CreatePromiseResponse;

  getBalance(): Balance | undefined;
  setBalance(value?: Balance): CreatePromiseResponse;
  hasBalance(): boolean;
  clearBalance(): CreatePromiseResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePromiseResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePromiseResponse): CreatePromiseResponse.AsObject;
  static serializeBinaryToWriter(message: CreatePromiseResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePromiseResponse;
  static deserializeBinaryFromReader(message: CreatePromiseResponse, reader: jspb.BinaryReader): CreatePromiseResponse;
}

export namespace CreatePromiseResponse {
  export type AsObject = {
    promise: string,
    balance?: Balance.AsObject,
  }
}

export class PromiseToBalanceRequest extends jspb.Message {
  getPromise(): string;
  setPromise(value: string): PromiseToBalanceRequest;

  getPassword(): string;
  setPassword(value: string): PromiseToBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromiseToBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PromiseToBalanceRequest): PromiseToBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: PromiseToBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromiseToBalanceRequest;
  static deserializeBinaryFromReader(message: PromiseToBalanceRequest, reader: jspb.BinaryReader): PromiseToBalanceRequest;
}

export namespace PromiseToBalanceRequest {
  export type AsObject = {
    promise: string,
    password: string,
  }
}

export class PromiseSellByBestDealRequest extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): PromiseSellByBestDealRequest;

  getCurrency(): string;
  setCurrency(value: string): PromiseSellByBestDealRequest;

  getPaymenttype(): string;
  setPaymenttype(value: string): PromiseSellByBestDealRequest;

  getPromise(): string;
  setPromise(value: string): PromiseSellByBestDealRequest;

  getPassword(): string;
  setPassword(value: string): PromiseSellByBestDealRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromiseSellByBestDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PromiseSellByBestDealRequest): PromiseSellByBestDealRequest.AsObject;
  static serializeBinaryToWriter(message: PromiseSellByBestDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromiseSellByBestDealRequest;
  static deserializeBinaryFromReader(message: PromiseSellByBestDealRequest, reader: jspb.BinaryReader): PromiseSellByBestDealRequest;
}

export namespace PromiseSellByBestDealRequest {
  export type AsObject = {
    country: string,
    currency: string,
    paymenttype: string,
    promise: string,
    password: string,
  }
}

export class GetPromiseSuitableAdvertisementsRequest extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): GetPromiseSuitableAdvertisementsRequest;

  getCurrency(): string;
  setCurrency(value: string): GetPromiseSuitableAdvertisementsRequest;

  getPaymenttype(): string;
  setPaymenttype(value: string): GetPromiseSuitableAdvertisementsRequest;

  getPromise(): string;
  setPromise(value: string): GetPromiseSuitableAdvertisementsRequest;

  getPassword(): string;
  setPassword(value: string): GetPromiseSuitableAdvertisementsRequest;

  getSkip(): number;
  setSkip(value: number): GetPromiseSuitableAdvertisementsRequest;

  getCount(): number;
  setCount(value: number): GetPromiseSuitableAdvertisementsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPromiseSuitableAdvertisementsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPromiseSuitableAdvertisementsRequest): GetPromiseSuitableAdvertisementsRequest.AsObject;
  static serializeBinaryToWriter(message: GetPromiseSuitableAdvertisementsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPromiseSuitableAdvertisementsRequest;
  static deserializeBinaryFromReader(message: GetPromiseSuitableAdvertisementsRequest, reader: jspb.BinaryReader): GetPromiseSuitableAdvertisementsRequest;
}

export namespace GetPromiseSuitableAdvertisementsRequest {
  export type AsObject = {
    country: string,
    currency: string,
    paymenttype: string,
    promise: string,
    password: string,
    skip: number,
    count: number,
  }
}

export class GetPromiseSuitableAdvertisementsResponse extends jspb.Message {
  getAdvertisementsList(): Array<Advertisement>;
  setAdvertisementsList(value: Array<Advertisement>): GetPromiseSuitableAdvertisementsResponse;
  clearAdvertisementsList(): GetPromiseSuitableAdvertisementsResponse;
  addAdvertisements(value?: Advertisement, index?: number): Advertisement;

  getFiatamountsList(): Array<Decimal>;
  setFiatamountsList(value: Array<Decimal>): GetPromiseSuitableAdvertisementsResponse;
  clearFiatamountsList(): GetPromiseSuitableAdvertisementsResponse;
  addFiatamounts(value?: Decimal, index?: number): Decimal;

  getPromiseamount(): Decimal | undefined;
  setPromiseamount(value?: Decimal): GetPromiseSuitableAdvertisementsResponse;
  hasPromiseamount(): boolean;
  clearPromiseamount(): GetPromiseSuitableAdvertisementsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPromiseSuitableAdvertisementsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPromiseSuitableAdvertisementsResponse): GetPromiseSuitableAdvertisementsResponse.AsObject;
  static serializeBinaryToWriter(message: GetPromiseSuitableAdvertisementsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPromiseSuitableAdvertisementsResponse;
  static deserializeBinaryFromReader(message: GetPromiseSuitableAdvertisementsResponse, reader: jspb.BinaryReader): GetPromiseSuitableAdvertisementsResponse;
}

export namespace GetPromiseSuitableAdvertisementsResponse {
  export type AsObject = {
    advertisementsList: Array<Advertisement.AsObject>,
    fiatamountsList: Array<Decimal.AsObject>,
    promiseamount?: Decimal.AsObject,
  }
}

export class PromiseSellByDealRequest extends jspb.Message {
  getPromise(): string;
  setPromise(value: string): PromiseSellByDealRequest;

  getPassword(): string;
  setPassword(value: string): PromiseSellByDealRequest;

  getAdvertisementid(): number;
  setAdvertisementid(value: number): PromiseSellByDealRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromiseSellByDealRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PromiseSellByDealRequest): PromiseSellByDealRequest.AsObject;
  static serializeBinaryToWriter(message: PromiseSellByDealRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromiseSellByDealRequest;
  static deserializeBinaryFromReader(message: PromiseSellByDealRequest, reader: jspb.BinaryReader): PromiseSellByDealRequest;
}

export namespace PromiseSellByDealRequest {
  export type AsObject = {
    promise: string,
    password: string,
    advertisementid: number,
  }
}

export class PayInvoiceByPromiseRequest extends jspb.Message {
  getPromise(): string;
  setPromise(value: string): PayInvoiceByPromiseRequest;

  getPassword(): string;
  setPassword(value: string): PayInvoiceByPromiseRequest;

  getInvoiceid(): number;
  setInvoiceid(value: number): PayInvoiceByPromiseRequest;

  getPieces(): number;
  setPieces(value: number): PayInvoiceByPromiseRequest;

  getOddtype(): PayInvoiceByPromiseRequest.OddTypes;
  setOddtype(value: PayInvoiceByPromiseRequest.OddTypes): PayInvoiceByPromiseRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceByPromiseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceByPromiseRequest): PayInvoiceByPromiseRequest.AsObject;
  static serializeBinaryToWriter(message: PayInvoiceByPromiseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceByPromiseRequest;
  static deserializeBinaryFromReader(message: PayInvoiceByPromiseRequest, reader: jspb.BinaryReader): PayInvoiceByPromiseRequest;
}

export namespace PayInvoiceByPromiseRequest {
  export type AsObject = {
    promise: string,
    password: string,
    invoiceid: number,
    pieces: number,
    oddtype: PayInvoiceByPromiseRequest.OddTypes,
  }

  export enum OddTypes { 
    NOODD = 0,
    TOBALANCE = 1,
    TOPROMISE = 2,
  }
}

export class Image extends jspb.Message {
  getId(): string;
  setId(value: string): Image;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Image;
  hasCreatedat(): boolean;
  clearCreatedat(): Image;

  getPreview(): Uint8Array | string;
  getPreview_asU8(): Uint8Array;
  getPreview_asB64(): string;
  setPreview(value: Uint8Array | string): Image;

  getOriginal(): Uint8Array | string;
  getOriginal_asU8(): Uint8Array;
  getOriginal_asB64(): string;
  setOriginal(value: Uint8Array | string): Image;

  getIspreview(): boolean;
  setIspreview(value: boolean): Image;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Image.AsObject;
  static toObject(includeInstance: boolean, msg: Image): Image.AsObject;
  static serializeBinaryToWriter(message: Image, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Image;
  static deserializeBinaryFromReader(message: Image, reader: jspb.BinaryReader): Image;
}

export namespace Image {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    preview: Uint8Array | string,
    original: Uint8Array | string,
    ispreview: boolean,
  }
}

export class StoreImageRequest extends jspb.Message {
  getId(): string;
  setId(value: string): StoreImageRequest;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): StoreImageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StoreImageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StoreImageRequest): StoreImageRequest.AsObject;
  static serializeBinaryToWriter(message: StoreImageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StoreImageRequest;
  static deserializeBinaryFromReader(message: StoreImageRequest, reader: jspb.BinaryReader): StoreImageRequest;
}

export namespace StoreImageRequest {
  export type AsObject = {
    id: string,
    data: Uint8Array | string,
  }
}

export class GetImageRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetImageRequest;

  getIspreview(): boolean;
  setIspreview(value: boolean): GetImageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetImageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetImageRequest): GetImageRequest.AsObject;
  static serializeBinaryToWriter(message: GetImageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetImageRequest;
  static deserializeBinaryFromReader(message: GetImageRequest, reader: jspb.BinaryReader): GetImageRequest;
}

export namespace GetImageRequest {
  export type AsObject = {
    id: string,
    ispreview: boolean,
  }
}

export class InvoiceSecret extends jspb.Message {
  getId(): number;
  setId(value: number): InvoiceSecret;

  getText(): string;
  setText(value: string): InvoiceSecret;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): InvoiceSecret;
  clearImagesList(): InvoiceSecret;
  addImages(value: string, index?: number): InvoiceSecret;

  getOrder(): number;
  setOrder(value: number): InvoiceSecret;

  getPaymentidisnull(): boolean;
  setPaymentidisnull(value: boolean): InvoiceSecret;

  getPaymentid(): number;
  setPaymentid(value: number): InvoiceSecret;

  getUrl(): string;
  setUrl(value: string): InvoiceSecret;

  getNullablepaymentCase(): InvoiceSecret.NullablepaymentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvoiceSecret.AsObject;
  static toObject(includeInstance: boolean, msg: InvoiceSecret): InvoiceSecret.AsObject;
  static serializeBinaryToWriter(message: InvoiceSecret, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvoiceSecret;
  static deserializeBinaryFromReader(message: InvoiceSecret, reader: jspb.BinaryReader): InvoiceSecret;
}

export namespace InvoiceSecret {
  export type AsObject = {
    id: number,
    text: string,
    imagesList: Array<string>,
    order: number,
    paymentidisnull: boolean,
    paymentid: number,
    url: string,
  }

  export enum NullablepaymentCase { 
    NULLABLEPAYMENT_NOT_SET = 0,
    PAYMENTIDISNULL = 5,
    PAYMENTID = 6,
  }
}

export class InvoiceSecretsList extends jspb.Message {
  getSecretsList(): Array<InvoiceSecret>;
  setSecretsList(value: Array<InvoiceSecret>): InvoiceSecretsList;
  clearSecretsList(): InvoiceSecretsList;
  addSecrets(value?: InvoiceSecret, index?: number): InvoiceSecret;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvoiceSecretsList.AsObject;
  static toObject(includeInstance: boolean, msg: InvoiceSecretsList): InvoiceSecretsList.AsObject;
  static serializeBinaryToWriter(message: InvoiceSecretsList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvoiceSecretsList;
  static deserializeBinaryFromReader(message: InvoiceSecretsList, reader: jspb.BinaryReader): InvoiceSecretsList;
}

export namespace InvoiceSecretsList {
  export type AsObject = {
    secretsList: Array<InvoiceSecret.AsObject>,
  }
}

export class GetInvoiceSecretsRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): GetInvoiceSecretsRequest;

  getIssold(): boolean;
  setIssold(value: boolean): GetInvoiceSecretsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInvoiceSecretsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInvoiceSecretsRequest): GetInvoiceSecretsRequest.AsObject;
  static serializeBinaryToWriter(message: GetInvoiceSecretsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInvoiceSecretsRequest;
  static deserializeBinaryFromReader(message: GetInvoiceSecretsRequest, reader: jspb.BinaryReader): GetInvoiceSecretsRequest;
}

export namespace GetInvoiceSecretsRequest {
  export type AsObject = {
    invoiceid: number,
    issold: boolean,
  }
}

export class ChangeInvoiceSecretRequest extends jspb.Message {
  getSecretid(): number;
  setSecretid(value: number): ChangeInvoiceSecretRequest;

  getOperation(): ChangeInvoiceSecretRequest.SecretOperations;
  setOperation(value: ChangeInvoiceSecretRequest.SecretOperations): ChangeInvoiceSecretRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeInvoiceSecretRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeInvoiceSecretRequest): ChangeInvoiceSecretRequest.AsObject;
  static serializeBinaryToWriter(message: ChangeInvoiceSecretRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeInvoiceSecretRequest;
  static deserializeBinaryFromReader(message: ChangeInvoiceSecretRequest, reader: jspb.BinaryReader): ChangeInvoiceSecretRequest;
}

export namespace ChangeInvoiceSecretRequest {
  export type AsObject = {
    secretid: number,
    operation: ChangeInvoiceSecretRequest.SecretOperations,
  }

  export enum SecretOperations { 
    TOUP = 0,
    TODOWN = 1,
    TOTOP = 2,
    TOBOTTOM = 3,
    REMOVE = 5,
  }
}

export class CreateInvoiceSecretRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): CreateInvoiceSecretRequest;

  getText(): string;
  setText(value: string): CreateInvoiceSecretRequest;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): CreateInvoiceSecretRequest;
  clearImagesList(): CreateInvoiceSecretRequest;
  addImages(value: string, index?: number): CreateInvoiceSecretRequest;

  getOrder(): number;
  setOrder(value: number): CreateInvoiceSecretRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInvoiceSecretRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInvoiceSecretRequest): CreateInvoiceSecretRequest.AsObject;
  static serializeBinaryToWriter(message: CreateInvoiceSecretRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInvoiceSecretRequest;
  static deserializeBinaryFromReader(message: CreateInvoiceSecretRequest, reader: jspb.BinaryReader): CreateInvoiceSecretRequest;
}

export namespace CreateInvoiceSecretRequest {
  export type AsObject = {
    invoiceid: number,
    text: string,
    imagesList: Array<string>,
    order: number,
  }
}

export class UpdateInvoiceSecretRequest extends jspb.Message {
  getSecretid(): number;
  setSecretid(value: number): UpdateInvoiceSecretRequest;

  getText(): string;
  setText(value: string): UpdateInvoiceSecretRequest;

  getImagesList(): Array<string>;
  setImagesList(value: Array<string>): UpdateInvoiceSecretRequest;
  clearImagesList(): UpdateInvoiceSecretRequest;
  addImages(value: string, index?: number): UpdateInvoiceSecretRequest;

  getOrder(): number;
  setOrder(value: number): UpdateInvoiceSecretRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInvoiceSecretRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInvoiceSecretRequest): UpdateInvoiceSecretRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateInvoiceSecretRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInvoiceSecretRequest;
  static deserializeBinaryFromReader(message: UpdateInvoiceSecretRequest, reader: jspb.BinaryReader): UpdateInvoiceSecretRequest;
}

export namespace UpdateInvoiceSecretRequest {
  export type AsObject = {
    secretid: number,
    text: string,
    imagesList: Array<string>,
    order: number,
  }
}

export class PayInvoiceFromLNRequest extends jspb.Message {
  getInvoiceid(): number;
  setInvoiceid(value: number): PayInvoiceFromLNRequest;

  getPieces(): number;
  setPieces(value: number): PayInvoiceFromLNRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceFromLNRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceFromLNRequest): PayInvoiceFromLNRequest.AsObject;
  static serializeBinaryToWriter(message: PayInvoiceFromLNRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceFromLNRequest;
  static deserializeBinaryFromReader(message: PayInvoiceFromLNRequest, reader: jspb.BinaryReader): PayInvoiceFromLNRequest;
}

export namespace PayInvoiceFromLNRequest {
  export type AsObject = {
    invoiceid: number,
    pieces: number,
  }
}

export class LNWithdrawalRequest extends jspb.Message {
  getInvoice(): string;
  setInvoice(value: string): LNWithdrawalRequest;

  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): LNWithdrawalRequest;
  hasAmount(): boolean;
  clearAmount(): LNWithdrawalRequest;

  getAmountisnull(): boolean;
  setAmountisnull(value: boolean): LNWithdrawalRequest;

  getAmountnullableCase(): LNWithdrawalRequest.AmountnullableCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNWithdrawalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LNWithdrawalRequest): LNWithdrawalRequest.AsObject;
  static serializeBinaryToWriter(message: LNWithdrawalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNWithdrawalRequest;
  static deserializeBinaryFromReader(message: LNWithdrawalRequest, reader: jspb.BinaryReader): LNWithdrawalRequest;
}

export namespace LNWithdrawalRequest {
  export type AsObject = {
    invoice: string,
    amount?: Decimal.AsObject,
    amountisnull: boolean,
  }

  export enum AmountnullableCase { 
    AMOUNTNULLABLE_NOT_SET = 0,
    AMOUNT = 2,
    AMOUNTISNULL = 3,
  }
}

export class LNDepositRequest extends jspb.Message {
  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): LNDepositRequest;
  hasAmount(): boolean;
  clearAmount(): LNDepositRequest;

  getDescription(): string;
  setDescription(value: string): LNDepositRequest;

  getExpiresin(): number;
  setExpiresin(value: number): LNDepositRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNDepositRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LNDepositRequest): LNDepositRequest.AsObject;
  static serializeBinaryToWriter(message: LNDepositRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNDepositRequest;
  static deserializeBinaryFromReader(message: LNDepositRequest, reader: jspb.BinaryReader): LNDepositRequest;
}

export namespace LNDepositRequest {
  export type AsObject = {
    amount?: Decimal.AsObject,
    description: string,
    expiresin: number,
  }
}

export class LNDepositResponse extends jspb.Message {
  getInvoice(): string;
  setInvoice(value: string): LNDepositResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNDepositResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LNDepositResponse): LNDepositResponse.AsObject;
  static serializeBinaryToWriter(message: LNDepositResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNDepositResponse;
  static deserializeBinaryFromReader(message: LNDepositResponse, reader: jspb.BinaryReader): LNDepositResponse;
}

export namespace LNDepositResponse {
  export type AsObject = {
    invoice: string,
  }
}

export class LNInvoice extends jspb.Message {
  getId(): string;
  setId(value: string): LNInvoice;

  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): LNInvoice;
  hasAmount(): boolean;
  clearAmount(): LNInvoice;

  getDescription(): string;
  setDescription(value: string): LNInvoice;

  getExpiresin(): number;
  setExpiresin(value: number): LNInvoice;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): LNInvoice;
  hasCreatedat(): boolean;
  clearCreatedat(): LNInvoice;

  getBolt11(): string;
  setBolt11(value: string): LNInvoice;

  getIspaid(): boolean;
  setIspaid(value: boolean): LNInvoice;

  getNorelations(): boolean;
  setNorelations(value: boolean): LNInvoice;

  getPaymentid(): number;
  setPaymentid(value: number): LNInvoice;

  getRelationsCase(): LNInvoice.RelationsCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNInvoice.AsObject;
  static toObject(includeInstance: boolean, msg: LNInvoice): LNInvoice.AsObject;
  static serializeBinaryToWriter(message: LNInvoice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNInvoice;
  static deserializeBinaryFromReader(message: LNInvoice, reader: jspb.BinaryReader): LNInvoice;
}

export namespace LNInvoice {
  export type AsObject = {
    id: string,
    amount?: Decimal.AsObject,
    description: string,
    expiresin: number,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    bolt11: string,
    ispaid: boolean,
    norelations: boolean,
    paymentid: number,
  }

  export enum RelationsCase { 
    RELATIONS_NOT_SET = 0,
    NORELATIONS = 8,
    PAYMENTID = 9,
  }
}

export class LNPayment extends jspb.Message {
  getId(): string;
  setId(value: string): LNPayment;

  getAmount(): Decimal | undefined;
  setAmount(value?: Decimal): LNPayment;
  hasAmount(): boolean;
  clearAmount(): LNPayment;

  getDescription(): string;
  setDescription(value: string): LNPayment;

  getBolt11(): string;
  setBolt11(value: string): LNPayment;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): LNPayment;
  hasCreatedat(): boolean;
  clearCreatedat(): LNPayment;

  getStatus(): LNPaymentStatus;
  setStatus(value: LNPaymentStatus): LNPayment;

  getError(): string;
  setError(value: string): LNPayment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNPayment.AsObject;
  static toObject(includeInstance: boolean, msg: LNPayment): LNPayment.AsObject;
  static serializeBinaryToWriter(message: LNPayment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNPayment;
  static deserializeBinaryFromReader(message: LNPayment, reader: jspb.BinaryReader): LNPayment;
}

export namespace LNPayment {
  export type AsObject = {
    id: string,
    amount?: Decimal.AsObject,
    description: string,
    bolt11: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    status: LNPaymentStatus,
    error: string,
  }
}

export class LNGetInvoicesRequest extends jspb.Message {
  getSkip(): number;
  setSkip(value: number): LNGetInvoicesRequest;

  getTake(): number;
  setTake(value: number): LNGetInvoicesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNGetInvoicesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LNGetInvoicesRequest): LNGetInvoicesRequest.AsObject;
  static serializeBinaryToWriter(message: LNGetInvoicesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNGetInvoicesRequest;
  static deserializeBinaryFromReader(message: LNGetInvoicesRequest, reader: jspb.BinaryReader): LNGetInvoicesRequest;
}

export namespace LNGetInvoicesRequest {
  export type AsObject = {
    skip: number,
    take: number,
  }
}

export class LNGetInvoicesResponse extends jspb.Message {
  getInvoicesList(): Array<LNInvoice>;
  setInvoicesList(value: Array<LNInvoice>): LNGetInvoicesResponse;
  clearInvoicesList(): LNGetInvoicesResponse;
  addInvoices(value?: LNInvoice, index?: number): LNInvoice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNGetInvoicesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LNGetInvoicesResponse): LNGetInvoicesResponse.AsObject;
  static serializeBinaryToWriter(message: LNGetInvoicesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNGetInvoicesResponse;
  static deserializeBinaryFromReader(message: LNGetInvoicesResponse, reader: jspb.BinaryReader): LNGetInvoicesResponse;
}

export namespace LNGetInvoicesResponse {
  export type AsObject = {
    invoicesList: Array<LNInvoice.AsObject>,
  }
}

export class LNGetPaymentsRequest extends jspb.Message {
  getSkip(): number;
  setSkip(value: number): LNGetPaymentsRequest;

  getTake(): number;
  setTake(value: number): LNGetPaymentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNGetPaymentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LNGetPaymentsRequest): LNGetPaymentsRequest.AsObject;
  static serializeBinaryToWriter(message: LNGetPaymentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNGetPaymentsRequest;
  static deserializeBinaryFromReader(message: LNGetPaymentsRequest, reader: jspb.BinaryReader): LNGetPaymentsRequest;
}

export namespace LNGetPaymentsRequest {
  export type AsObject = {
    skip: number,
    take: number,
  }
}

export class LNGetPaymentsResponse extends jspb.Message {
  getLnpaymentsList(): Array<LNPayment>;
  setLnpaymentsList(value: Array<LNPayment>): LNGetPaymentsResponse;
  clearLnpaymentsList(): LNGetPaymentsResponse;
  addLnpayments(value?: LNPayment, index?: number): LNPayment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LNGetPaymentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LNGetPaymentsResponse): LNGetPaymentsResponse.AsObject;
  static serializeBinaryToWriter(message: LNGetPaymentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LNGetPaymentsResponse;
  static deserializeBinaryFromReader(message: LNGetPaymentsResponse, reader: jspb.BinaryReader): LNGetPaymentsResponse;
}

export namespace LNGetPaymentsResponse {
  export type AsObject = {
    lnpaymentsList: Array<LNPayment.AsObject>,
  }
}

export class UpdateMyProfileRequest extends jspb.Message {
  getTimezone(): string;
  setTimezone(value: string): UpdateMyProfileRequest;

  getIntroduction(): string;
  setIntroduction(value: string): UpdateMyProfileRequest;

  getSite(): string;
  setSite(value: string): UpdateMyProfileRequest;

  getSalesdisabled(): boolean;
  setSalesdisabled(value: boolean): UpdateMyProfileRequest;

  getBuysdisabled(): boolean;
  setBuysdisabled(value: boolean): UpdateMyProfileRequest;

  getDefaultcurrency(): string;
  setDefaultcurrency(value: string): UpdateMyProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMyProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMyProfileRequest): UpdateMyProfileRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMyProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMyProfileRequest;
  static deserializeBinaryFromReader(message: UpdateMyProfileRequest, reader: jspb.BinaryReader): UpdateMyProfileRequest;
}

export namespace UpdateMyProfileRequest {
  export type AsObject = {
    timezone: string,
    introduction: string,
    site: string,
    salesdisabled: boolean,
    buysdisabled: boolean,
    defaultcurrency: string,
  }
}

export class MyProfileResponse extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): MyProfileResponse;

  getUsername(): string;
  setUsername(value: string): MyProfileResponse;

  getEmail(): string;
  setEmail(value: string): MyProfileResponse;

  getEnabledtwofa(): boolean;
  setEnabledtwofa(value: boolean): MyProfileResponse;

  getEmailverifed(): boolean;
  setEmailverifed(value: boolean): MyProfileResponse;

  getTimezone(): string;
  setTimezone(value: string): MyProfileResponse;

  getIntroduction(): string;
  setIntroduction(value: string): MyProfileResponse;

  getSite(): string;
  setSite(value: string): MyProfileResponse;

  getSalesdisabled(): boolean;
  setSalesdisabled(value: boolean): MyProfileResponse;

  getBuysdisabled(): boolean;
  setBuysdisabled(value: boolean): MyProfileResponse;

  getDefaultcurrency(): string;
  setDefaultcurrency(value: string): MyProfileResponse;

  getBoughtoptions(): BoughtOptions | undefined;
  setBoughtoptions(value?: BoughtOptions): MyProfileResponse;
  hasBoughtoptions(): boolean;
  clearBoughtoptions(): MyProfileResponse;

  getIsanonymous(): boolean;
  setIsanonymous(value: boolean): MyProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MyProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MyProfileResponse): MyProfileResponse.AsObject;
  static serializeBinaryToWriter(message: MyProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MyProfileResponse;
  static deserializeBinaryFromReader(message: MyProfileResponse, reader: jspb.BinaryReader): MyProfileResponse;
}

export namespace MyProfileResponse {
  export type AsObject = {
    userid: string,
    username: string,
    email: string,
    enabledtwofa: boolean,
    emailverifed: boolean,
    timezone: string,
    introduction: string,
    site: string,
    salesdisabled: boolean,
    buysdisabled: boolean,
    defaultcurrency: string,
    boughtoptions?: BoughtOptions.AsObject,
    isanonymous: boolean,
  }
}

export class GetUserEventsResponse extends jspb.Message {
  getEventsList(): Array<Event>;
  setEventsList(value: Array<Event>): GetUserEventsResponse;
  clearEventsList(): GetUserEventsResponse;
  addEvents(value?: Event, index?: number): Event;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserEventsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserEventsResponse): GetUserEventsResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserEventsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserEventsResponse;
  static deserializeBinaryFromReader(message: GetUserEventsResponse, reader: jspb.BinaryReader): GetUserEventsResponse;
}

export namespace GetUserEventsResponse {
  export type AsObject = {
    eventsList: Array<Event.AsObject>,
  }
}

export enum AdCurrentStatus { 
  ENABLED = 0,
  DISABLEDBYOWNER = 1,
  NOTENOUGHMONEY = 2,
  GLOBALDISABLED = 3,
  DISABLEDBYTIMETABLE = 4,
}
export enum DealStatus { 
  OPENED = 0,
  COMPLETED = 1,
  CANCELED = 2,
  DISPUTED = 3,
  WAITDEPOSIT = 4,
}
export enum LNPaymentStatus { 
  STARTED = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3,
}
