import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class RegisterAnonymousResponse extends jspb.Message {
  getRefreshtoken(): string;
  setRefreshtoken(value: string): RegisterAnonymousResponse;

  getAccesstoken(): string;
  setAccesstoken(value: string): RegisterAnonymousResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterAnonymousResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterAnonymousResponse): RegisterAnonymousResponse.AsObject;
  static serializeBinaryToWriter(message: RegisterAnonymousResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterAnonymousResponse;
  static deserializeBinaryFromReader(message: RegisterAnonymousResponse, reader: jspb.BinaryReader): RegisterAnonymousResponse;
}

export namespace RegisterAnonymousResponse {
  export type AsObject = {
    refreshtoken: string,
    accesstoken: string,
  }
}

export class RegisterAnonymousRequest extends jspb.Message {
  getLang(): string;
  setLang(value: string): RegisterAnonymousRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterAnonymousRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterAnonymousRequest): RegisterAnonymousRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterAnonymousRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterAnonymousRequest;
  static deserializeBinaryFromReader(message: RegisterAnonymousRequest, reader: jspb.BinaryReader): RegisterAnonymousRequest;
}

export namespace RegisterAnonymousRequest {
  export type AsObject = {
    lang: string,
  }
}

export class RegisterRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): RegisterRequest;

  getPassword(): string;
  setPassword(value: string): RegisterRequest;

  getLang(): string;
  setLang(value: string): RegisterRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterRequest): RegisterRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterRequest;
  static deserializeBinaryFromReader(message: RegisterRequest, reader: jspb.BinaryReader): RegisterRequest;
}

export namespace RegisterRequest {
  export type AsObject = {
    username: string,
    password: string,
    lang: string,
  }
}

export class ChangeEmailRequest extends jspb.Message {
  getTwofa(): string;
  setTwofa(value: string): ChangeEmailRequest;

  getNewemail(): string;
  setNewemail(value: string): ChangeEmailRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeEmailRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeEmailRequest): ChangeEmailRequest.AsObject;
  static serializeBinaryToWriter(message: ChangeEmailRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeEmailRequest;
  static deserializeBinaryFromReader(message: ChangeEmailRequest, reader: jspb.BinaryReader): ChangeEmailRequest;
}

export namespace ChangeEmailRequest {
  export type AsObject = {
    twofa: string,
    newemail: string,
  }
}

export class ConfirmEmailRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): ConfirmEmailRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfirmEmailRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConfirmEmailRequest): ConfirmEmailRequest.AsObject;
  static serializeBinaryToWriter(message: ConfirmEmailRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfirmEmailRequest;
  static deserializeBinaryFromReader(message: ConfirmEmailRequest, reader: jspb.BinaryReader): ConfirmEmailRequest;
}

export namespace ConfirmEmailRequest {
  export type AsObject = {
    token: string,
  }
}

export class ChangePasswordRequest extends jspb.Message {
  getOldpassword(): string;
  setOldpassword(value: string): ChangePasswordRequest;

  getNewpassword(): string;
  setNewpassword(value: string): ChangePasswordRequest;

  getTwofa(): string;
  setTwofa(value: string): ChangePasswordRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangePasswordRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangePasswordRequest): ChangePasswordRequest.AsObject;
  static serializeBinaryToWriter(message: ChangePasswordRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangePasswordRequest;
  static deserializeBinaryFromReader(message: ChangePasswordRequest, reader: jspb.BinaryReader): ChangePasswordRequest;
}

export namespace ChangePasswordRequest {
  export type AsObject = {
    oldpassword: string,
    newpassword: string,
    twofa: string,
  }
}

export class GetTwoFACodeResponse extends jspb.Message {
  getCode(): string;
  setCode(value: string): GetTwoFACodeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTwoFACodeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTwoFACodeResponse): GetTwoFACodeResponse.AsObject;
  static serializeBinaryToWriter(message: GetTwoFACodeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTwoFACodeResponse;
  static deserializeBinaryFromReader(message: GetTwoFACodeResponse, reader: jspb.BinaryReader): GetTwoFACodeResponse;
}

export namespace GetTwoFACodeResponse {
  export type AsObject = {
    code: string,
  }
}

export class EnabledTwoFARequest extends jspb.Message {
  getPin(): string;
  setPin(value: string): EnabledTwoFARequest;

  getPassword(): string;
  setPassword(value: string): EnabledTwoFARequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnabledTwoFARequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnabledTwoFARequest): EnabledTwoFARequest.AsObject;
  static serializeBinaryToWriter(message: EnabledTwoFARequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnabledTwoFARequest;
  static deserializeBinaryFromReader(message: EnabledTwoFARequest, reader: jspb.BinaryReader): EnabledTwoFARequest;
}

export namespace EnabledTwoFARequest {
  export type AsObject = {
    pin: string,
    password: string,
  }
}

export class DisableTwoFaRequest extends jspb.Message {
  getPin(): string;
  setPin(value: string): DisableTwoFaRequest;

  getPassword(): string;
  setPassword(value: string): DisableTwoFaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisableTwoFaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DisableTwoFaRequest): DisableTwoFaRequest.AsObject;
  static serializeBinaryToWriter(message: DisableTwoFaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisableTwoFaRequest;
  static deserializeBinaryFromReader(message: DisableTwoFaRequest, reader: jspb.BinaryReader): DisableTwoFaRequest;
}

export namespace DisableTwoFaRequest {
  export type AsObject = {
    pin: string,
    password: string,
  }
}

export class Session extends jspb.Message {
  getId(): string;
  setId(value: string): Session;

  getIp(): string;
  setIp(value: string): Session;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Session;
  hasCreatedat(): boolean;
  clearCreatedat(): Session;

  getExpiredat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiredat(value?: google_protobuf_timestamp_pb.Timestamp): Session;
  hasExpiredat(): boolean;
  clearExpiredat(): Session;

  getClientname(): string;
  setClientname(value: string): Session;

  getLastonline(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastonline(value?: google_protobuf_timestamp_pb.Timestamp): Session;
  hasLastonline(): boolean;
  clearLastonline(): Session;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Session.AsObject;
  static toObject(includeInstance: boolean, msg: Session): Session.AsObject;
  static serializeBinaryToWriter(message: Session, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Session;
  static deserializeBinaryFromReader(message: Session, reader: jspb.BinaryReader): Session;
}

export namespace Session {
  export type AsObject = {
    id: string,
    ip: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    expiredat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    clientname: string,
    lastonline?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SessionEvent extends jspb.Message {
  getIp(): string;
  setIp(value: string): SessionEvent;

  getTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTime(value?: google_protobuf_timestamp_pb.Timestamp): SessionEvent;
  hasTime(): boolean;
  clearTime(): SessionEvent;

  getClientname(): string;
  setClientname(value: string): SessionEvent;

  getEvent(): string;
  setEvent(value: string): SessionEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SessionEvent.AsObject;
  static toObject(includeInstance: boolean, msg: SessionEvent): SessionEvent.AsObject;
  static serializeBinaryToWriter(message: SessionEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SessionEvent;
  static deserializeBinaryFromReader(message: SessionEvent, reader: jspb.BinaryReader): SessionEvent;
}

export namespace SessionEvent {
  export type AsObject = {
    ip: string,
    time?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    clientname: string,
    event: string,
  }
}

export class GetMySessionsResponse extends jspb.Message {
  getSessionsList(): Array<Session>;
  setSessionsList(value: Array<Session>): GetMySessionsResponse;
  clearSessionsList(): GetMySessionsResponse;
  addSessions(value?: Session, index?: number): Session;

  getEventsList(): Array<SessionEvent>;
  setEventsList(value: Array<SessionEvent>): GetMySessionsResponse;
  clearEventsList(): GetMySessionsResponse;
  addEvents(value?: SessionEvent, index?: number): SessionEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMySessionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMySessionsResponse): GetMySessionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetMySessionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMySessionsResponse;
  static deserializeBinaryFromReader(message: GetMySessionsResponse, reader: jspb.BinaryReader): GetMySessionsResponse;
}

export namespace GetMySessionsResponse {
  export type AsObject = {
    sessionsList: Array<Session.AsObject>,
    eventsList: Array<SessionEvent.AsObject>,
  }
}

export class KillSessionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): KillSessionRequest;

  getTwofa(): string;
  setTwofa(value: string): KillSessionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KillSessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: KillSessionRequest): KillSessionRequest.AsObject;
  static serializeBinaryToWriter(message: KillSessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KillSessionRequest;
  static deserializeBinaryFromReader(message: KillSessionRequest, reader: jspb.BinaryReader): KillSessionRequest;
}

export namespace KillSessionRequest {
  export type AsObject = {
    id: string,
    twofa: string,
  }
}

export class PasswordRecoveryRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): PasswordRecoveryRequest;

  getTwofa(): string;
  setTwofa(value: string): PasswordRecoveryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordRecoveryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordRecoveryRequest): PasswordRecoveryRequest.AsObject;
  static serializeBinaryToWriter(message: PasswordRecoveryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordRecoveryRequest;
  static deserializeBinaryFromReader(message: PasswordRecoveryRequest, reader: jspb.BinaryReader): PasswordRecoveryRequest;
}

export namespace PasswordRecoveryRequest {
  export type AsObject = {
    email: string,
    twofa: string,
  }
}

export class PasswordRecoveryConfirmRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): PasswordRecoveryConfirmRequest;

  getToken(): string;
  setToken(value: string): PasswordRecoveryConfirmRequest;

  getNewpassword(): string;
  setNewpassword(value: string): PasswordRecoveryConfirmRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordRecoveryConfirmRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordRecoveryConfirmRequest): PasswordRecoveryConfirmRequest.AsObject;
  static serializeBinaryToWriter(message: PasswordRecoveryConfirmRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordRecoveryConfirmRequest;
  static deserializeBinaryFromReader(message: PasswordRecoveryConfirmRequest, reader: jspb.BinaryReader): PasswordRecoveryConfirmRequest;
}

export namespace PasswordRecoveryConfirmRequest {
  export type AsObject = {
    email: string,
    token: string,
    newpassword: string,
  }
}

export class GetMyReferenceTokenResponse extends jspb.Message {
  getToken(): string;
  setToken(value: string): GetMyReferenceTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMyReferenceTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMyReferenceTokenResponse): GetMyReferenceTokenResponse.AsObject;
  static serializeBinaryToWriter(message: GetMyReferenceTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMyReferenceTokenResponse;
  static deserializeBinaryFromReader(message: GetMyReferenceTokenResponse, reader: jspb.BinaryReader): GetMyReferenceTokenResponse;
}

export namespace GetMyReferenceTokenResponse {
  export type AsObject = {
    token: string,
  }
}

export class CreateReferenceTokenRequest extends jspb.Message {
  getTwofa(): string;
  setTwofa(value: string): CreateReferenceTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateReferenceTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateReferenceTokenRequest): CreateReferenceTokenRequest.AsObject;
  static serializeBinaryToWriter(message: CreateReferenceTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateReferenceTokenRequest;
  static deserializeBinaryFromReader(message: CreateReferenceTokenRequest, reader: jspb.BinaryReader): CreateReferenceTokenRequest;
}

export namespace CreateReferenceTokenRequest {
  export type AsObject = {
    twofa: string,
  }
}

export class CreateReferenceTokenResponse extends jspb.Message {
  getToken(): string;
  setToken(value: string): CreateReferenceTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateReferenceTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateReferenceTokenResponse): CreateReferenceTokenResponse.AsObject;
  static serializeBinaryToWriter(message: CreateReferenceTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateReferenceTokenResponse;
  static deserializeBinaryFromReader(message: CreateReferenceTokenResponse, reader: jspb.BinaryReader): CreateReferenceTokenResponse;
}

export namespace CreateReferenceTokenResponse {
  export type AsObject = {
    token: string,
  }
}

export class RemoveReferenceTokenRequest extends jspb.Message {
  getTwofa(): string;
  setTwofa(value: string): RemoveReferenceTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveReferenceTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveReferenceTokenRequest): RemoveReferenceTokenRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveReferenceTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveReferenceTokenRequest;
  static deserializeBinaryFromReader(message: RemoveReferenceTokenRequest, reader: jspb.BinaryReader): RemoveReferenceTokenRequest;
}

export namespace RemoveReferenceTokenRequest {
  export type AsObject = {
    twofa: string,
  }
}

export class RemoveAccountRequest extends jspb.Message {
  getPassword(): string;
  setPassword(value: string): RemoveAccountRequest;

  getTwofa(): string;
  setTwofa(value: string): RemoveAccountRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveAccountRequest): RemoveAccountRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveAccountRequest;
  static deserializeBinaryFromReader(message: RemoveAccountRequest, reader: jspb.BinaryReader): RemoveAccountRequest;
}

export namespace RemoveAccountRequest {
  export type AsObject = {
    password: string,
    twofa: string,
  }
}

