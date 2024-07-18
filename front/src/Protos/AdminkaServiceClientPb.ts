/**
 * @fileoverview gRPC-Web generated client stub for AdminkaSchema.V1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as api_pb from './api_pb';
import * as adminka_pb from './adminka_pb';


export class AdminkaClient {
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

  methodInfoGetUserInfo = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetUserInfoResponse,
    (request: api_pb.GetUserInfoRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetUserInfoResponse.deserializeBinary
  );

  getUserInfo(
    request: api_pb.GetUserInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetUserInfoResponse>;

  getUserInfo(
    request: api_pb.GetUserInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetUserInfoResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetUserInfoResponse>;

  getUserInfo(
    request: api_pb.GetUserInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetUserInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetUserInfo',
        request,
        metadata || {},
        this.methodInfoGetUserInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetUserInfo',
    request,
    metadata || {},
    this.methodInfoGetUserInfo);
  }

  methodInfoStoreImage = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Image,
    (request: api_pb.StoreImageRequest) => {
      return request.serializeBinary();
    },
    api_pb.Image.deserializeBinary
  );

  storeImage(
    request: api_pb.StoreImageRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Image>;

  storeImage(
    request: api_pb.StoreImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Image) => void): grpcWeb.ClientReadableStream<api_pb.Image>;

  storeImage(
    request: api_pb.StoreImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Image) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/StoreImage',
        request,
        metadata || {},
        this.methodInfoStoreImage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/StoreImage',
    request,
    metadata || {},
    this.methodInfoStoreImage);
  }

  methodInfoGetImage = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Image,
    (request: api_pb.GetImageRequest) => {
      return request.serializeBinary();
    },
    api_pb.Image.deserializeBinary
  );

  getImage(
    request: api_pb.GetImageRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Image>;

  getImage(
    request: api_pb.GetImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Image) => void): grpcWeb.ClientReadableStream<api_pb.Image>;

  getImage(
    request: api_pb.GetImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Image) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetImage',
        request,
        metadata || {},
        this.methodInfoGetImage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetImage',
    request,
    metadata || {},
    this.methodInfoGetImage);
  }

  methodInfoSendMessage = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.SendMessageResponse,
    (request: api_pb.SendMessageRequest) => {
      return request.serializeBinary();
    },
    api_pb.SendMessageResponse.deserializeBinary
  );

  sendMessage(
    request: api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.SendMessageResponse>;

  sendMessage(
    request: api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.SendMessageResponse) => void): grpcWeb.ClientReadableStream<api_pb.SendMessageResponse>;

  sendMessage(
    request: api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.SendMessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/SendMessage',
        request,
        metadata || {},
        this.methodInfoSendMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/SendMessage',
    request,
    metadata || {},
    this.methodInfoSendMessage);
  }

  methodInfoCancelDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    adminka_pb.Dispute,
    (request: adminka_pb.CancelDisputeRequest) => {
      return request.serializeBinary();
    },
    adminka_pb.Dispute.deserializeBinary
  );

  cancelDispute(
    request: adminka_pb.CancelDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<adminka_pb.Dispute>;

  cancelDispute(
    request: adminka_pb.CancelDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<adminka_pb.Dispute>;

  cancelDispute(
    request: adminka_pb.CancelDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: adminka_pb.Dispute) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/CancelDispute',
        request,
        metadata || {},
        this.methodInfoCancelDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/CancelDispute',
    request,
    metadata || {},
    this.methodInfoCancelDispute);
  }

  methodInfoCompleteDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    adminka_pb.Dispute,
    (request: adminka_pb.CompleteDisputeRequest) => {
      return request.serializeBinary();
    },
    adminka_pb.Dispute.deserializeBinary
  );

  completeDispute(
    request: adminka_pb.CompleteDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<adminka_pb.Dispute>;

  completeDispute(
    request: adminka_pb.CompleteDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<adminka_pb.Dispute>;

  completeDispute(
    request: adminka_pb.CompleteDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: adminka_pb.Dispute) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/CompleteDispute',
        request,
        metadata || {},
        this.methodInfoCompleteDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/CompleteDispute',
    request,
    metadata || {},
    this.methodInfoCompleteDispute);
  }

  methodInfoTransferDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: adminka_pb.TransferDisputeRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  transferDispute(
    request: adminka_pb.TransferDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  transferDispute(
    request: adminka_pb.TransferDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  transferDispute(
    request: adminka_pb.TransferDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/TransferDispute',
        request,
        metadata || {},
        this.methodInfoTransferDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/TransferDispute',
    request,
    metadata || {},
    this.methodInfoTransferDispute);
  }

  methodInfoGetSupportAccounts = new grpcWeb.AbstractClientBase.MethodInfo(
    adminka_pb.GetSupportAccountsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    adminka_pb.GetSupportAccountsResponse.deserializeBinary
  );

  getSupportAccounts(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<adminka_pb.GetSupportAccountsResponse>;

  getSupportAccounts(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: adminka_pb.GetSupportAccountsResponse) => void): grpcWeb.ClientReadableStream<adminka_pb.GetSupportAccountsResponse>;

  getSupportAccounts(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: adminka_pb.GetSupportAccountsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetSupportAccounts',
        request,
        metadata || {},
        this.methodInfoGetSupportAccounts,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetSupportAccounts',
    request,
    metadata || {},
    this.methodInfoGetSupportAccounts);
  }

  methodInfoReleaseDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: adminka_pb.ReleaseDisputeRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  releaseDispute(
    request: adminka_pb.ReleaseDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  releaseDispute(
    request: adminka_pb.ReleaseDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  releaseDispute(
    request: adminka_pb.ReleaseDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/ReleaseDispute',
        request,
        metadata || {},
        this.methodInfoReleaseDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/ReleaseDispute',
    request,
    metadata || {},
    this.methodInfoReleaseDispute);
  }

  methodInfoGetMyDisputes = new grpcWeb.AbstractClientBase.MethodInfo(
    adminka_pb.GetDisputesResponse,
    (request: adminka_pb.GetDisputesRequest) => {
      return request.serializeBinary();
    },
    adminka_pb.GetDisputesResponse.deserializeBinary
  );

  getMyDisputes(
    request: adminka_pb.GetDisputesRequest,
    metadata: grpcWeb.Metadata | null): Promise<adminka_pb.GetDisputesResponse>;

  getMyDisputes(
    request: adminka_pb.GetDisputesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: adminka_pb.GetDisputesResponse) => void): grpcWeb.ClientReadableStream<adminka_pb.GetDisputesResponse>;

  getMyDisputes(
    request: adminka_pb.GetDisputesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: adminka_pb.GetDisputesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetMyDisputes',
        request,
        metadata || {},
        this.methodInfoGetMyDisputes,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetMyDisputes',
    request,
    metadata || {},
    this.methodInfoGetMyDisputes);
  }

  methodInfoSubscribeDisputes = new grpcWeb.AbstractClientBase.MethodInfo(
    adminka_pb.DisputeEvent,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    adminka_pb.DisputeEvent.deserializeBinary
  );

  subscribeDisputes(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/AdminkaSchema.V1.Adminka/SubscribeDisputes',
      request,
      metadata || {},
      this.methodInfoSubscribeDisputes);
  }

  methodInfoSubscribeNewEvents = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Event,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.Event.deserializeBinary
  );

  subscribeNewEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/AdminkaSchema.V1.Adminka/SubscribeNewEvents',
      request,
      metadata || {},
      this.methodInfoSubscribeNewEvents);
  }

  methodInfoSubscribeVariables = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Variables,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.Variables.deserializeBinary
  );

  subscribeVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/AdminkaSchema.V1.Adminka/SubscribeVariables',
      request,
      metadata || {},
      this.methodInfoSubscribeVariables);
  }

}

