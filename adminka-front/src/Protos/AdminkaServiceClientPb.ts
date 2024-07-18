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
import * as Protos_api_pb from '../Protos/api_pb';
import * as Protos_adminka_pb from '../Protos/adminka_pb';


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

  methodInfoGetUserFeedbacks = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_api_pb.GetUserFeedbacksResponse,
    (request: Protos_api_pb.GetUserFeedbacksRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetUserFeedbacksResponse.deserializeBinary
  );

  getUserFeedbacks(
    request: Protos_api_pb.GetUserFeedbacksRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetUserFeedbacksResponse>;

  getUserFeedbacks(
    request: Protos_api_pb.GetUserFeedbacksRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetUserFeedbacksResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetUserFeedbacksResponse>;

  getUserFeedbacks(
    request: Protos_api_pb.GetUserFeedbacksRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetUserFeedbacksResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetUserFeedbacks',
        request,
        metadata || {},
        this.methodInfoGetUserFeedbacks,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetUserFeedbacks',
    request,
    metadata || {},
    this.methodInfoGetUserFeedbacks);
  }

  methodInfoMarkEventsAsRead = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: Protos_api_pb.MarkEventsAsReadRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  markEventsAsRead(
    request: Protos_api_pb.MarkEventsAsReadRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  markEventsAsRead(
    request: Protos_api_pb.MarkEventsAsReadRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  markEventsAsRead(
    request: Protos_api_pb.MarkEventsAsReadRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/MarkEventsAsRead',
        request,
        metadata || {},
        this.methodInfoMarkEventsAsRead,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/MarkEventsAsRead',
    request,
    metadata || {},
    this.methodInfoMarkEventsAsRead);
  }

  methodInfoGetDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_api_pb.Deal,
    (request: Protos_adminka_pb.GetDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  getDeal(
    request: Protos_adminka_pb.GetDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  getDeal(
    request: Protos_adminka_pb.GetDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  getDeal(
    request: Protos_adminka_pb.GetDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetDeal',
        request,
        metadata || {},
        this.methodInfoGetDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetDeal',
    request,
    metadata || {},
    this.methodInfoGetDeal);
  }

  methodInfoGetMyProfile = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_adminka_pb.Profile,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.Profile.deserializeBinary
  );

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.Profile>;

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Profile) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.Profile>;

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Profile) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GetMyProfile',
        request,
        metadata || {},
        this.methodInfoGetMyProfile,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GetMyProfile',
    request,
    metadata || {},
    this.methodInfoGetMyProfile);
  }

  methodInfoGetUserInfo = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_api_pb.GetUserInfoResponse,
    (request: Protos_api_pb.GetUserInfoRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetUserInfoResponse.deserializeBinary
  );

  getUserInfo(
    request: Protos_api_pb.GetUserInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetUserInfoResponse>;

  getUserInfo(
    request: Protos_api_pb.GetUserInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetUserInfoResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetUserInfoResponse>;

  getUserInfo(
    request: Protos_api_pb.GetUserInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetUserInfoResponse) => void) {
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
    Protos_api_pb.Image,
    (request: Protos_api_pb.StoreImageRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Image.deserializeBinary
  );

  storeImage(
    request: Protos_api_pb.StoreImageRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Image>;

  storeImage(
    request: Protos_api_pb.StoreImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Image) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Image>;

  storeImage(
    request: Protos_api_pb.StoreImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Image) => void) {
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
    Protos_api_pb.Image,
    (request: Protos_api_pb.GetImageRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Image.deserializeBinary
  );

  getImage(
    request: Protos_api_pb.GetImageRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Image>;

  getImage(
    request: Protos_api_pb.GetImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Image) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Image>;

  getImage(
    request: Protos_api_pb.GetImageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Image) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.SendMessageRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  sendMessage(
    request: Protos_api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  sendMessage(
    request: Protos_api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  sendMessage(
    request: Protos_api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_adminka_pb.Dispute,
    (request: Protos_adminka_pb.CancelDisputeRequest) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.Dispute.deserializeBinary
  );

  cancelDispute(
    request: Protos_adminka_pb.CancelDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.Dispute>;

  cancelDispute(
    request: Protos_adminka_pb.CancelDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.Dispute>;

  cancelDispute(
    request: Protos_adminka_pb.CancelDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void) {
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
    Protos_adminka_pb.Dispute,
    (request: Protos_adminka_pb.CompleteDisputeRequest) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.Dispute.deserializeBinary
  );

  completeDispute(
    request: Protos_adminka_pb.CompleteDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.Dispute>;

  completeDispute(
    request: Protos_adminka_pb.CompleteDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.Dispute>;

  completeDispute(
    request: Protos_adminka_pb.CompleteDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void) {
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

  methodInfoGetSupportAccounts = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_adminka_pb.GetSupportAccountsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.GetSupportAccountsResponse.deserializeBinary
  );

  getSupportAccounts(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.GetSupportAccountsResponse>;

  getSupportAccounts(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.GetSupportAccountsResponse) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.GetSupportAccountsResponse>;

  getSupportAccounts(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.GetSupportAccountsResponse) => void) {
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

  methodInfoToWorkDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_adminka_pb.Dispute,
    (request: Protos_adminka_pb.DisputeRequest) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.Dispute.deserializeBinary
  );

  toWorkDispute(
    request: Protos_adminka_pb.DisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.Dispute>;

  toWorkDispute(
    request: Protos_adminka_pb.DisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.Dispute>;

  toWorkDispute(
    request: Protos_adminka_pb.DisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/ToWorkDispute',
        request,
        metadata || {},
        this.methodInfoToWorkDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/ToWorkDispute',
    request,
    metadata || {},
    this.methodInfoToWorkDispute);
  }

  methodInfoStopWorkDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_adminka_pb.Dispute,
    (request: Protos_adminka_pb.DisputeRequest) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.Dispute.deserializeBinary
  );

  stopWorkDispute(
    request: Protos_adminka_pb.DisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.Dispute>;

  stopWorkDispute(
    request: Protos_adminka_pb.DisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.Dispute>;

  stopWorkDispute(
    request: Protos_adminka_pb.DisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/StopWorkDispute',
        request,
        metadata || {},
        this.methodInfoStopWorkDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/StopWorkDispute',
    request,
    metadata || {},
    this.methodInfoStopWorkDispute);
  }

  methodInfoGiveAwayDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_adminka_pb.Dispute,
    (request: Protos_adminka_pb.GiveAwayDisputeRequest) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.Dispute.deserializeBinary
  );

  giveAwayDispute(
    request: Protos_adminka_pb.GiveAwayDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.Dispute>;

  giveAwayDispute(
    request: Protos_adminka_pb.GiveAwayDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.Dispute>;

  giveAwayDispute(
    request: Protos_adminka_pb.GiveAwayDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.Dispute) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/AdminkaSchema.V1.Adminka/GiveAwayDispute',
        request,
        metadata || {},
        this.methodInfoGiveAwayDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/AdminkaSchema.V1.Adminka/GiveAwayDispute',
    request,
    metadata || {},
    this.methodInfoGiveAwayDispute);
  }

  methodInfoGetMyDisputes = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_adminka_pb.GetDisputesResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.GetDisputesResponse.deserializeBinary
  );

  getMyDisputes(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_adminka_pb.GetDisputesResponse>;

  getMyDisputes(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_adminka_pb.GetDisputesResponse) => void): grpcWeb.ClientReadableStream<Protos_adminka_pb.GetDisputesResponse>;

  getMyDisputes(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_adminka_pb.GetDisputesResponse) => void) {
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
    Protos_adminka_pb.DisputeEvent,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_adminka_pb.DisputeEvent.deserializeBinary
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
    Protos_api_pb.Event,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Event.deserializeBinary
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
    Protos_api_pb.Variables,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Variables.deserializeBinary
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

