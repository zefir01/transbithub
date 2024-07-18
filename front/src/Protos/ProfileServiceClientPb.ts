/**
 * @fileoverview gRPC-Web generated client stub for ProfileSchema.V1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as profile_pb from './profile_pb';


export class ProfileApiClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoRegisterAnonymous = new grpcWeb.AbstractClientBase.MethodInfo(
    profile_pb.RegisterAnonymousResponse,
    (request: profile_pb.RegisterAnonymousRequest) => {
      return request.serializeBinary();
    },
    profile_pb.RegisterAnonymousResponse.deserializeBinary
  );

  registerAnonymous(
    request: profile_pb.RegisterAnonymousRequest,
    metadata: grpcWeb.Metadata | null): Promise<profile_pb.RegisterAnonymousResponse>;

  registerAnonymous(
    request: profile_pb.RegisterAnonymousRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: profile_pb.RegisterAnonymousResponse) => void): grpcWeb.ClientReadableStream<profile_pb.RegisterAnonymousResponse>;

  registerAnonymous(
    request: profile_pb.RegisterAnonymousRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: profile_pb.RegisterAnonymousResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/RegisterAnonymous',
        request,
        metadata || {},
        this.methodInfoRegisterAnonymous,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/RegisterAnonymous',
    request,
    metadata || {},
    this.methodInfoRegisterAnonymous);
  }

  methodInfoRegisterUser = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.RegisterRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  registerUser(
    request: profile_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  registerUser(
    request: profile_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  registerUser(
    request: profile_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/RegisterUser',
        request,
        metadata || {},
        this.methodInfoRegisterUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/RegisterUser',
    request,
    metadata || {},
    this.methodInfoRegisterUser);
  }

  methodInfoChangePassword = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.ChangePasswordRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  changePassword(
    request: profile_pb.ChangePasswordRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  changePassword(
    request: profile_pb.ChangePasswordRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  changePassword(
    request: profile_pb.ChangePasswordRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/ChangePassword',
        request,
        metadata || {},
        this.methodInfoChangePassword,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/ChangePassword',
    request,
    metadata || {},
    this.methodInfoChangePassword);
  }

  methodInfoChangeEmail = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.ChangeEmailRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  changeEmail(
    request: profile_pb.ChangeEmailRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  changeEmail(
    request: profile_pb.ChangeEmailRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  changeEmail(
    request: profile_pb.ChangeEmailRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/ChangeEmail',
        request,
        metadata || {},
        this.methodInfoChangeEmail,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/ChangeEmail',
    request,
    metadata || {},
    this.methodInfoChangeEmail);
  }

  methodInfoConfirmEmail = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.ConfirmEmailRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  confirmEmail(
    request: profile_pb.ConfirmEmailRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  confirmEmail(
    request: profile_pb.ConfirmEmailRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  confirmEmail(
    request: profile_pb.ConfirmEmailRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/ConfirmEmail',
        request,
        metadata || {},
        this.methodInfoConfirmEmail,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/ConfirmEmail',
    request,
    metadata || {},
    this.methodInfoConfirmEmail);
  }

  methodInfoGetTwoFACode = new grpcWeb.AbstractClientBase.MethodInfo(
    profile_pb.GetTwoFACodeResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    profile_pb.GetTwoFACodeResponse.deserializeBinary
  );

  getTwoFACode(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<profile_pb.GetTwoFACodeResponse>;

  getTwoFACode(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: profile_pb.GetTwoFACodeResponse) => void): grpcWeb.ClientReadableStream<profile_pb.GetTwoFACodeResponse>;

  getTwoFACode(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: profile_pb.GetTwoFACodeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/GetTwoFACode',
        request,
        metadata || {},
        this.methodInfoGetTwoFACode,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/GetTwoFACode',
    request,
    metadata || {},
    this.methodInfoGetTwoFACode);
  }

  methodInfoEnabledTwoFA = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.EnabledTwoFARequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  enabledTwoFA(
    request: profile_pb.EnabledTwoFARequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  enabledTwoFA(
    request: profile_pb.EnabledTwoFARequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  enabledTwoFA(
    request: profile_pb.EnabledTwoFARequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/EnabledTwoFA',
        request,
        metadata || {},
        this.methodInfoEnabledTwoFA,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/EnabledTwoFA',
    request,
    metadata || {},
    this.methodInfoEnabledTwoFA);
  }

  methodInfoDisableTwoFa = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.DisableTwoFaRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  disableTwoFa(
    request: profile_pb.DisableTwoFaRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  disableTwoFa(
    request: profile_pb.DisableTwoFaRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  disableTwoFa(
    request: profile_pb.DisableTwoFaRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/DisableTwoFa',
        request,
        metadata || {},
        this.methodInfoDisableTwoFa,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/DisableTwoFa',
    request,
    metadata || {},
    this.methodInfoDisableTwoFa);
  }

  methodInfoGetMySessions = new grpcWeb.AbstractClientBase.MethodInfo(
    profile_pb.GetMySessionsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    profile_pb.GetMySessionsResponse.deserializeBinary
  );

  getMySessions(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<profile_pb.GetMySessionsResponse>;

  getMySessions(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: profile_pb.GetMySessionsResponse) => void): grpcWeb.ClientReadableStream<profile_pb.GetMySessionsResponse>;

  getMySessions(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: profile_pb.GetMySessionsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/GetMySessions',
        request,
        metadata || {},
        this.methodInfoGetMySessions,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/GetMySessions',
    request,
    metadata || {},
    this.methodInfoGetMySessions);
  }

  methodInfoKillSession = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.KillSessionRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  killSession(
    request: profile_pb.KillSessionRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  killSession(
    request: profile_pb.KillSessionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  killSession(
    request: profile_pb.KillSessionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/KillSession',
        request,
        metadata || {},
        this.methodInfoKillSession,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/KillSession',
    request,
    metadata || {},
    this.methodInfoKillSession);
  }

  methodInfoPasswordRecovery = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.PasswordRecoveryRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  passwordRecovery(
    request: profile_pb.PasswordRecoveryRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  passwordRecovery(
    request: profile_pb.PasswordRecoveryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  passwordRecovery(
    request: profile_pb.PasswordRecoveryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/PasswordRecovery',
        request,
        metadata || {},
        this.methodInfoPasswordRecovery,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/PasswordRecovery',
    request,
    metadata || {},
    this.methodInfoPasswordRecovery);
  }

  methodInfoPasswordRecoveryConfirm = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.PasswordRecoveryConfirmRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  passwordRecoveryConfirm(
    request: profile_pb.PasswordRecoveryConfirmRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  passwordRecoveryConfirm(
    request: profile_pb.PasswordRecoveryConfirmRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  passwordRecoveryConfirm(
    request: profile_pb.PasswordRecoveryConfirmRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/PasswordRecoveryConfirm',
        request,
        metadata || {},
        this.methodInfoPasswordRecoveryConfirm,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/PasswordRecoveryConfirm',
    request,
    metadata || {},
    this.methodInfoPasswordRecoveryConfirm);
  }

  methodInfoGetMyReferenceToken = new grpcWeb.AbstractClientBase.MethodInfo(
    profile_pb.GetMyReferenceTokenResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    profile_pb.GetMyReferenceTokenResponse.deserializeBinary
  );

  getMyReferenceToken(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<profile_pb.GetMyReferenceTokenResponse>;

  getMyReferenceToken(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: profile_pb.GetMyReferenceTokenResponse) => void): grpcWeb.ClientReadableStream<profile_pb.GetMyReferenceTokenResponse>;

  getMyReferenceToken(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: profile_pb.GetMyReferenceTokenResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/GetMyReferenceToken',
        request,
        metadata || {},
        this.methodInfoGetMyReferenceToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/GetMyReferenceToken',
    request,
    metadata || {},
    this.methodInfoGetMyReferenceToken);
  }

  methodInfoRemoveReferenceToken = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.RemoveReferenceTokenRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  removeReferenceToken(
    request: profile_pb.RemoveReferenceTokenRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  removeReferenceToken(
    request: profile_pb.RemoveReferenceTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  removeReferenceToken(
    request: profile_pb.RemoveReferenceTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/RemoveReferenceToken',
        request,
        metadata || {},
        this.methodInfoRemoveReferenceToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/RemoveReferenceToken',
    request,
    metadata || {},
    this.methodInfoRemoveReferenceToken);
  }

  methodInfoCreateReferenceToken = new grpcWeb.AbstractClientBase.MethodInfo(
    profile_pb.CreateReferenceTokenResponse,
    (request: profile_pb.CreateReferenceTokenRequest) => {
      return request.serializeBinary();
    },
    profile_pb.CreateReferenceTokenResponse.deserializeBinary
  );

  createReferenceToken(
    request: profile_pb.CreateReferenceTokenRequest,
    metadata: grpcWeb.Metadata | null): Promise<profile_pb.CreateReferenceTokenResponse>;

  createReferenceToken(
    request: profile_pb.CreateReferenceTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: profile_pb.CreateReferenceTokenResponse) => void): grpcWeb.ClientReadableStream<profile_pb.CreateReferenceTokenResponse>;

  createReferenceToken(
    request: profile_pb.CreateReferenceTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: profile_pb.CreateReferenceTokenResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/CreateReferenceToken',
        request,
        metadata || {},
        this.methodInfoCreateReferenceToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/CreateReferenceToken',
    request,
    metadata || {},
    this.methodInfoCreateReferenceToken);
  }

  methodInfoRemoveAccount = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: profile_pb.RemoveAccountRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  removeAccount(
    request: profile_pb.RemoveAccountRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  removeAccount(
    request: profile_pb.RemoveAccountRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  removeAccount(
    request: profile_pb.RemoveAccountRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ProfileSchema.V1.ProfileApi/RemoveAccount',
        request,
        metadata || {},
        this.methodInfoRemoveAccount,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ProfileSchema.V1.ProfileApi/RemoveAccount',
    request,
    metadata || {},
    this.methodInfoRemoveAccount);
  }

}

