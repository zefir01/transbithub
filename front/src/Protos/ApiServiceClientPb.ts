/**
 * @fileoverview gRPC-Web generated client stub for CoreSchema.V1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as api_pb from './api_pb';


export class TradeApiClient {
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
        '/CoreSchema.V1.TradeApi/SubscribeVariables',
      request,
      metadata || {},
      this.methodInfoSubscribeVariables);
  }

  methodInfoGetVariables = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Variables,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.Variables.deserializeBinary
  );

  getVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Variables>;

  getVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Variables) => void): grpcWeb.ClientReadableStream<api_pb.Variables>;

  getVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Variables) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetVariables',
        request,
        metadata || {},
        this.methodInfoGetVariables,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetVariables',
    request,
    metadata || {},
    this.methodInfoGetVariables);
  }

  methodInfoCreateAdvertisement = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Advertisement,
    (request: api_pb.AdvertisementData) => {
      return request.serializeBinary();
    },
    api_pb.Advertisement.deserializeBinary
  );

  createAdvertisement(
    request: api_pb.AdvertisementData,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Advertisement>;

  createAdvertisement(
    request: api_pb.AdvertisementData,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<api_pb.Advertisement>;

  createAdvertisement(
    request: api_pb.AdvertisementData,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateAdvertisement',
        request,
        metadata || {},
        this.methodInfoCreateAdvertisement,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateAdvertisement',
    request,
    metadata || {},
    this.methodInfoCreateAdvertisement);
  }

  methodInfoDeleteAdvertisement = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.DeleteAdvertisementRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteAdvertisement(
    request: api_pb.DeleteAdvertisementRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteAdvertisement(
    request: api_pb.DeleteAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteAdvertisement(
    request: api_pb.DeleteAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/DeleteAdvertisement',
        request,
        metadata || {},
        this.methodInfoDeleteAdvertisement,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/DeleteAdvertisement',
    request,
    metadata || {},
    this.methodInfoDeleteAdvertisement);
  }

  methodInfoChangeAdvertisementStatus = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.ChangeAdvertisementStatusResponse,
    (request: api_pb.ChangeAdvertisementStatusRequest) => {
      return request.serializeBinary();
    },
    api_pb.ChangeAdvertisementStatusResponse.deserializeBinary
  );

  changeAdvertisementStatus(
    request: api_pb.ChangeAdvertisementStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.ChangeAdvertisementStatusResponse>;

  changeAdvertisementStatus(
    request: api_pb.ChangeAdvertisementStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.ChangeAdvertisementStatusResponse) => void): grpcWeb.ClientReadableStream<api_pb.ChangeAdvertisementStatusResponse>;

  changeAdvertisementStatus(
    request: api_pb.ChangeAdvertisementStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.ChangeAdvertisementStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/ChangeAdvertisementStatus',
        request,
        metadata || {},
        this.methodInfoChangeAdvertisementStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/ChangeAdvertisementStatus',
    request,
    metadata || {},
    this.methodInfoChangeAdvertisementStatus);
  }

  methodInfoModifyAdvertisement = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Advertisement,
    (request: api_pb.ModifyAdvertisementRequest) => {
      return request.serializeBinary();
    },
    api_pb.Advertisement.deserializeBinary
  );

  modifyAdvertisement(
    request: api_pb.ModifyAdvertisementRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Advertisement>;

  modifyAdvertisement(
    request: api_pb.ModifyAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<api_pb.Advertisement>;

  modifyAdvertisement(
    request: api_pb.ModifyAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/ModifyAdvertisement',
        request,
        metadata || {},
        this.methodInfoModifyAdvertisement,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/ModifyAdvertisement',
    request,
    metadata || {},
    this.methodInfoModifyAdvertisement);
  }

  methodInfoGetMyAdvertisements = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.FindAdvertisementsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.FindAdvertisementsResponse.deserializeBinary
  );

  getMyAdvertisements(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.FindAdvertisementsResponse>;

  getMyAdvertisements(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.FindAdvertisementsResponse) => void): grpcWeb.ClientReadableStream<api_pb.FindAdvertisementsResponse>;

  getMyAdvertisements(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.FindAdvertisementsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetMyAdvertisements',
        request,
        metadata || {},
        this.methodInfoGetMyAdvertisements,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetMyAdvertisements',
    request,
    metadata || {},
    this.methodInfoGetMyAdvertisements);
  }

  methodInfoGetAdvertisementsById = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Advertisement,
    (request: api_pb.GetAdvertisementsByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.Advertisement.deserializeBinary
  );

  getAdvertisementsById(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Advertisement>;

  getAdvertisementsById(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<api_pb.Advertisement>;

  getAdvertisementsById(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetAdvertisementsById',
        request,
        metadata || {},
        this.methodInfoGetAdvertisementsById,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetAdvertisementsById',
    request,
    metadata || {},
    this.methodInfoGetAdvertisementsById);
  }

  methodInfoGetMyAdvertisementsById = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Advertisement,
    (request: api_pb.GetAdvertisementsByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.Advertisement.deserializeBinary
  );

  getMyAdvertisementsById(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Advertisement>;

  getMyAdvertisementsById(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<api_pb.Advertisement>;

  getMyAdvertisementsById(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Advertisement) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetMyAdvertisementsById',
        request,
        metadata || {},
        this.methodInfoGetMyAdvertisementsById,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetMyAdvertisementsById',
    request,
    metadata || {},
    this.methodInfoGetMyAdvertisementsById);
  }

  methodInfoFindAdvertisements = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.FindAdvertisementsResponse,
    (request: api_pb.FindAdvertisementsRequest) => {
      return request.serializeBinary();
    },
    api_pb.FindAdvertisementsResponse.deserializeBinary
  );

  findAdvertisements(
    request: api_pb.FindAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.FindAdvertisementsResponse>;

  findAdvertisements(
    request: api_pb.FindAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.FindAdvertisementsResponse) => void): grpcWeb.ClientReadableStream<api_pb.FindAdvertisementsResponse>;

  findAdvertisements(
    request: api_pb.FindAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.FindAdvertisementsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/FindAdvertisements',
        request,
        metadata || {},
        this.methodInfoFindAdvertisements,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/FindAdvertisements',
    request,
    metadata || {},
    this.methodInfoFindAdvertisements);
  }

  methodInfoSubscribeAdvertisementChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.SubscribeAdvertisementChangesResponse,
    (request: api_pb.GetAdvertisementsByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.SubscribeAdvertisementChangesResponse.deserializeBinary
  );

  subscribeAdvertisementChanges(
    request: api_pb.GetAdvertisementsByIdRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/CoreSchema.V1.TradeApi/SubscribeAdvertisementChanges',
      request,
      metadata || {},
      this.methodInfoSubscribeAdvertisementChanges);
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
          '/CoreSchema.V1.TradeApi/GetUserInfo',
        request,
        metadata || {},
        this.methodInfoGetUserInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetUserInfo',
    request,
    metadata || {},
    this.methodInfoGetUserInfo);
  }

  methodInfoGetMyDeals = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetMyDealsResponse,
    (request: api_pb.GetMyDealsRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetMyDealsResponse.deserializeBinary
  );

  getMyDeals(
    request: api_pb.GetMyDealsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetMyDealsResponse>;

  getMyDeals(
    request: api_pb.GetMyDealsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetMyDealsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetMyDealsResponse>;

  getMyDeals(
    request: api_pb.GetMyDealsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetMyDealsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetMyDeals',
        request,
        metadata || {},
        this.methodInfoGetMyDeals,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetMyDeals',
    request,
    metadata || {},
    this.methodInfoGetMyDeals);
  }

  methodInfoCreateDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.CreateDealRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  createDeal(
    request: api_pb.CreateDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  createDeal(
    request: api_pb.CreateDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  createDeal(
    request: api_pb.CreateDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateDeal',
        request,
        metadata || {},
        this.methodInfoCreateDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateDeal',
    request,
    metadata || {},
    this.methodInfoCreateDeal);
  }

  methodInfoCreateDealLnBuy = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.CreateDealLnBuyRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  createDealLnBuy(
    request: api_pb.CreateDealLnBuyRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  createDealLnBuy(
    request: api_pb.CreateDealLnBuyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  createDealLnBuy(
    request: api_pb.CreateDealLnBuyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateDealLnBuy',
        request,
        metadata || {},
        this.methodInfoCreateDealLnBuy,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateDealLnBuy',
    request,
    metadata || {},
    this.methodInfoCreateDealLnBuy);
  }

  methodInfoCreateDealLnSell = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.CreateDealLnSellRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  createDealLnSell(
    request: api_pb.CreateDealLnSellRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  createDealLnSell(
    request: api_pb.CreateDealLnSellRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  createDealLnSell(
    request: api_pb.CreateDealLnSellRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateDealLnSell',
        request,
        metadata || {},
        this.methodInfoCreateDealLnSell,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateDealLnSell',
    request,
    metadata || {},
    this.methodInfoCreateDealLnSell);
  }

  methodInfoGetDealById = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.GetDealByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  getDealById(
    request: api_pb.GetDealByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  getDealById(
    request: api_pb.GetDealByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  getDealById(
    request: api_pb.GetDealByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetDealById',
        request,
        metadata || {},
        this.methodInfoGetDealById,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetDealById',
    request,
    metadata || {},
    this.methodInfoGetDealById);
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
          '/CoreSchema.V1.TradeApi/SendMessage',
        request,
        metadata || {},
        this.methodInfoSendMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/SendMessage',
    request,
    metadata || {},
    this.methodInfoSendMessage);
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
        '/CoreSchema.V1.TradeApi/SubscribeNewEvents',
      request,
      metadata || {},
      this.methodInfoSubscribeNewEvents);
  }

  methodInfoGetUserEvents = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetUserEventsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetUserEventsResponse.deserializeBinary
  );

  getUserEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetUserEventsResponse>;

  getUserEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetUserEventsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetUserEventsResponse>;

  getUserEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetUserEventsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetUserEvents',
        request,
        metadata || {},
        this.methodInfoGetUserEvents,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetUserEvents',
    request,
    metadata || {},
    this.methodInfoGetUserEvents);
  }

  methodInfoMarkEventsAsRead = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.MarkEventsAsReadRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  markEventsAsRead(
    request: api_pb.MarkEventsAsReadRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  markEventsAsRead(
    request: api_pb.MarkEventsAsReadRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  markEventsAsRead(
    request: api_pb.MarkEventsAsReadRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/MarkEventsAsRead',
        request,
        metadata || {},
        this.methodInfoMarkEventsAsRead,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/MarkEventsAsRead',
    request,
    metadata || {},
    this.methodInfoMarkEventsAsRead);
  }

  methodInfoCancelDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.CancelDealResponse,
    (request: api_pb.CancelDealRequest) => {
      return request.serializeBinary();
    },
    api_pb.CancelDealResponse.deserializeBinary
  );

  cancelDeal(
    request: api_pb.CancelDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.CancelDealResponse>;

  cancelDeal(
    request: api_pb.CancelDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.CancelDealResponse) => void): grpcWeb.ClientReadableStream<api_pb.CancelDealResponse>;

  cancelDeal(
    request: api_pb.CancelDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.CancelDealResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CancelDeal',
        request,
        metadata || {},
        this.methodInfoCancelDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CancelDeal',
    request,
    metadata || {},
    this.methodInfoCancelDeal);
  }

  methodInfoIPayed = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.IPayedResponse,
    (request: api_pb.IPayedRequest) => {
      return request.serializeBinary();
    },
    api_pb.IPayedResponse.deserializeBinary
  );

  iPayed(
    request: api_pb.IPayedRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.IPayedResponse>;

  iPayed(
    request: api_pb.IPayedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.IPayedResponse) => void): grpcWeb.ClientReadableStream<api_pb.IPayedResponse>;

  iPayed(
    request: api_pb.IPayedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.IPayedResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/IPayed',
        request,
        metadata || {},
        this.methodInfoIPayed,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/IPayed',
    request,
    metadata || {},
    this.methodInfoIPayed);
  }

  methodInfoCreateDispute = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.CreateDisputeResponse,
    (request: api_pb.CreateDisputeRequest) => {
      return request.serializeBinary();
    },
    api_pb.CreateDisputeResponse.deserializeBinary
  );

  createDispute(
    request: api_pb.CreateDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.CreateDisputeResponse>;

  createDispute(
    request: api_pb.CreateDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.CreateDisputeResponse) => void): grpcWeb.ClientReadableStream<api_pb.CreateDisputeResponse>;

  createDispute(
    request: api_pb.CreateDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.CreateDisputeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateDispute',
        request,
        metadata || {},
        this.methodInfoCreateDispute,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateDispute',
    request,
    metadata || {},
    this.methodInfoCreateDispute);
  }

  methodInfoSendFeedback = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.SendFeedbackRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  sendFeedback(
    request: api_pb.SendFeedbackRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  sendFeedback(
    request: api_pb.SendFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  sendFeedback(
    request: api_pb.SendFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/SendFeedback',
        request,
        metadata || {},
        this.methodInfoSendFeedback,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/SendFeedback',
    request,
    metadata || {},
    this.methodInfoSendFeedback);
  }

  methodInfoGetUserFeedbacks = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetUserFeedbacksResponse,
    (request: api_pb.GetUserFeedbacksRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetUserFeedbacksResponse.deserializeBinary
  );

  getUserFeedbacks(
    request: api_pb.GetUserFeedbacksRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetUserFeedbacksResponse>;

  getUserFeedbacks(
    request: api_pb.GetUserFeedbacksRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetUserFeedbacksResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetUserFeedbacksResponse>;

  getUserFeedbacks(
    request: api_pb.GetUserFeedbacksRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetUserFeedbacksResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetUserFeedbacks',
        request,
        metadata || {},
        this.methodInfoGetUserFeedbacks,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetUserFeedbacks',
    request,
    metadata || {},
    this.methodInfoGetUserFeedbacks);
  }

  methodInfoAddUserToTrusted = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.AddUserToTrustedRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  addUserToTrusted(
    request: api_pb.AddUserToTrustedRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  addUserToTrusted(
    request: api_pb.AddUserToTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  addUserToTrusted(
    request: api_pb.AddUserToTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/AddUserToTrusted',
        request,
        metadata || {},
        this.methodInfoAddUserToTrusted,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/AddUserToTrusted',
    request,
    metadata || {},
    this.methodInfoAddUserToTrusted);
  }

  methodInfoCreateUserComplaint = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.CreateUserComplaintRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  createUserComplaint(
    request: api_pb.CreateUserComplaintRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  createUserComplaint(
    request: api_pb.CreateUserComplaintRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  createUserComplaint(
    request: api_pb.CreateUserComplaintRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateUserComplaint',
        request,
        metadata || {},
        this.methodInfoCreateUserComplaint,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateUserComplaint',
    request,
    metadata || {},
    this.methodInfoCreateUserComplaint);
  }

  methodInfoBlockUser = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.BlockUserRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  blockUser(
    request: api_pb.BlockUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  blockUser(
    request: api_pb.BlockUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  blockUser(
    request: api_pb.BlockUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/BlockUser',
        request,
        metadata || {},
        this.methodInfoBlockUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/BlockUser',
    request,
    metadata || {},
    this.methodInfoBlockUser);
  }

  methodInfoUnBlockUser = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.UnBlockUserRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  unBlockUser(
    request: api_pb.UnBlockUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  unBlockUser(
    request: api_pb.UnBlockUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  unBlockUser(
    request: api_pb.UnBlockUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/UnBlockUser',
        request,
        metadata || {},
        this.methodInfoUnBlockUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/UnBlockUser',
    request,
    metadata || {},
    this.methodInfoUnBlockUser);
  }

  methodInfoGetMyBlockedUsers = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetMyBlockedUsersResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetMyBlockedUsersResponse.deserializeBinary
  );

  getMyBlockedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetMyBlockedUsersResponse>;

  getMyBlockedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetMyBlockedUsersResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetMyBlockedUsersResponse>;

  getMyBlockedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetMyBlockedUsersResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetMyBlockedUsers',
        request,
        metadata || {},
        this.methodInfoGetMyBlockedUsers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetMyBlockedUsers',
    request,
    metadata || {},
    this.methodInfoGetMyBlockedUsers);
  }

  methodInfoGetMyTrustedUsers = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetMyTrustedUsersResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetMyTrustedUsersResponse.deserializeBinary
  );

  getMyTrustedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetMyTrustedUsersResponse>;

  getMyTrustedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetMyTrustedUsersResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetMyTrustedUsersResponse>;

  getMyTrustedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetMyTrustedUsersResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetMyTrustedUsers',
        request,
        metadata || {},
        this.methodInfoGetMyTrustedUsers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetMyTrustedUsers',
    request,
    metadata || {},
    this.methodInfoGetMyTrustedUsers);
  }

  methodInfoRemoveFromTrustedUsers = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.RemoveFromTrustedRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  removeFromTrustedUsers(
    request: api_pb.RemoveFromTrustedRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  removeFromTrustedUsers(
    request: api_pb.RemoveFromTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  removeFromTrustedUsers(
    request: api_pb.RemoveFromTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/RemoveFromTrustedUsers',
        request,
        metadata || {},
        this.methodInfoRemoveFromTrustedUsers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/RemoveFromTrustedUsers',
    request,
    metadata || {},
    this.methodInfoRemoveFromTrustedUsers);
  }

  methodInfoIsUserTrusted = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.IsUserTrustedResponse,
    (request: api_pb.IsUserTrustedRequest) => {
      return request.serializeBinary();
    },
    api_pb.IsUserTrustedResponse.deserializeBinary
  );

  isUserTrusted(
    request: api_pb.IsUserTrustedRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.IsUserTrustedResponse>;

  isUserTrusted(
    request: api_pb.IsUserTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.IsUserTrustedResponse) => void): grpcWeb.ClientReadableStream<api_pb.IsUserTrustedResponse>;

  isUserTrusted(
    request: api_pb.IsUserTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.IsUserTrustedResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/IsUserTrusted',
        request,
        metadata || {},
        this.methodInfoIsUserTrusted,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/IsUserTrusted',
    request,
    metadata || {},
    this.methodInfoIsUserTrusted);
  }

  methodInfoIsUserBlocked = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.IsUserBlockedResponse,
    (request: api_pb.IsUserBlockedRequest) => {
      return request.serializeBinary();
    },
    api_pb.IsUserBlockedResponse.deserializeBinary
  );

  isUserBlocked(
    request: api_pb.IsUserBlockedRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.IsUserBlockedResponse>;

  isUserBlocked(
    request: api_pb.IsUserBlockedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.IsUserBlockedResponse) => void): grpcWeb.ClientReadableStream<api_pb.IsUserBlockedResponse>;

  isUserBlocked(
    request: api_pb.IsUserBlockedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.IsUserBlockedResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/IsUserBlocked',
        request,
        metadata || {},
        this.methodInfoIsUserBlocked,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/IsUserBlocked',
    request,
    metadata || {},
    this.methodInfoIsUserBlocked);
  }

  methodInfoGetTransactions = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetTransactionsResponse,
    (request: api_pb.GetTransactionsRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactions(
    request: api_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetTransactionsResponse>;

  getTransactions(
    request: api_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetTransactionsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetTransactionsResponse>;

  getTransactions(
    request: api_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetTransactionsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetTransactions',
        request,
        metadata || {},
        this.methodInfoGetTransactions,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetTransactions',
    request,
    metadata || {},
    this.methodInfoGetTransactions);
  }

  methodInfoGetTransactionsById = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetTransactionsResponse,
    (request: api_pb.GetTransactionByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactionsById(
    request: api_pb.GetTransactionByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetTransactionsResponse>;

  getTransactionsById(
    request: api_pb.GetTransactionByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetTransactionsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetTransactionsResponse>;

  getTransactionsById(
    request: api_pb.GetTransactionByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetTransactionsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetTransactionsById',
        request,
        metadata || {},
        this.methodInfoGetTransactionsById,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetTransactionsById',
    request,
    metadata || {},
    this.methodInfoGetTransactionsById);
  }

  methodInfoGetInputAddress = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetInputAddressResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetInputAddressResponse.deserializeBinary
  );

  getInputAddress(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetInputAddressResponse>;

  getInputAddress(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetInputAddressResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetInputAddressResponse>;

  getInputAddress(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetInputAddressResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetInputAddress',
        request,
        metadata || {},
        this.methodInfoGetInputAddress,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetInputAddress',
    request,
    metadata || {},
    this.methodInfoGetInputAddress);
  }

  methodInfoCreateTransaction = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.CreateTransactionRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  createTransaction(
    request: api_pb.CreateTransactionRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  createTransaction(
    request: api_pb.CreateTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  createTransaction(
    request: api_pb.CreateTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateTransaction',
        request,
        metadata || {},
        this.methodInfoCreateTransaction,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateTransaction',
    request,
    metadata || {},
    this.methodInfoCreateTransaction);
  }

  methodInfoGetFees = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetFeesResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetFeesResponse.deserializeBinary
  );

  getFees(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetFeesResponse>;

  getFees(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetFeesResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetFeesResponse>;

  getFees(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetFeesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetFees',
        request,
        metadata || {},
        this.methodInfoGetFees,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetFees',
    request,
    metadata || {},
    this.methodInfoGetFees);
  }

  methodInfoGetAllAdvertisementsStatus = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.AllAdvertisementsStatus,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.AllAdvertisementsStatus.deserializeBinary
  );

  getAllAdvertisementsStatus(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.AllAdvertisementsStatus>;

  getAllAdvertisementsStatus(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.AllAdvertisementsStatus) => void): grpcWeb.ClientReadableStream<api_pb.AllAdvertisementsStatus>;

  getAllAdvertisementsStatus(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.AllAdvertisementsStatus) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetAllAdvertisementsStatus',
        request,
        metadata || {},
        this.methodInfoGetAllAdvertisementsStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetAllAdvertisementsStatus',
    request,
    metadata || {},
    this.methodInfoGetAllAdvertisementsStatus);
  }

  methodInfoSetAllAdvertisementsStatus = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.MyProfileResponse,
    (request: api_pb.AllAdvertisementsStatus) => {
      return request.serializeBinary();
    },
    api_pb.MyProfileResponse.deserializeBinary
  );

  setAllAdvertisementsStatus(
    request: api_pb.AllAdvertisementsStatus,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.MyProfileResponse>;

  setAllAdvertisementsStatus(
    request: api_pb.AllAdvertisementsStatus,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.MyProfileResponse) => void): grpcWeb.ClientReadableStream<api_pb.MyProfileResponse>;

  setAllAdvertisementsStatus(
    request: api_pb.AllAdvertisementsStatus,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.MyProfileResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/SetAllAdvertisementsStatus',
        request,
        metadata || {},
        this.methodInfoSetAllAdvertisementsStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/SetAllAdvertisementsStatus',
    request,
    metadata || {},
    this.methodInfoSetAllAdvertisementsStatus);
  }

  methodInfoIsUserExist = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.IsUserExistResponse,
    (request: api_pb.IsUserExistRequest) => {
      return request.serializeBinary();
    },
    api_pb.IsUserExistResponse.deserializeBinary
  );

  isUserExist(
    request: api_pb.IsUserExistRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.IsUserExistResponse>;

  isUserExist(
    request: api_pb.IsUserExistRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.IsUserExistResponse) => void): grpcWeb.ClientReadableStream<api_pb.IsUserExistResponse>;

  isUserExist(
    request: api_pb.IsUserExistRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.IsUserExistResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/IsUserExist',
        request,
        metadata || {},
        this.methodInfoIsUserExist,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/IsUserExist',
    request,
    metadata || {},
    this.methodInfoIsUserExist);
  }

  methodInfoCreateInvoice = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Invoice,
    (request: api_pb.CreateInvoiceRequest) => {
      return request.serializeBinary();
    },
    api_pb.Invoice.deserializeBinary
  );

  createInvoice(
    request: api_pb.CreateInvoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Invoice>;

  createInvoice(
    request: api_pb.CreateInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Invoice) => void): grpcWeb.ClientReadableStream<api_pb.Invoice>;

  createInvoice(
    request: api_pb.CreateInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Invoice) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateInvoice',
        request,
        metadata || {},
        this.methodInfoCreateInvoice,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateInvoice',
    request,
    metadata || {},
    this.methodInfoCreateInvoice);
  }

  methodInfoUpdatePublicInvoice = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Invoice,
    (request: api_pb.UpdatePublicInvoiceRequest) => {
      return request.serializeBinary();
    },
    api_pb.Invoice.deserializeBinary
  );

  updatePublicInvoice(
    request: api_pb.UpdatePublicInvoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Invoice>;

  updatePublicInvoice(
    request: api_pb.UpdatePublicInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Invoice) => void): grpcWeb.ClientReadableStream<api_pb.Invoice>;

  updatePublicInvoice(
    request: api_pb.UpdatePublicInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Invoice) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/UpdatePublicInvoice',
        request,
        metadata || {},
        this.methodInfoUpdatePublicInvoice,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/UpdatePublicInvoice',
    request,
    metadata || {},
    this.methodInfoUpdatePublicInvoice);
  }

  methodInfoDeleteInvoice = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.DeleteInvoiceResponse,
    (request: api_pb.DeleteInvoiceRequest) => {
      return request.serializeBinary();
    },
    api_pb.DeleteInvoiceResponse.deserializeBinary
  );

  deleteInvoice(
    request: api_pb.DeleteInvoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.DeleteInvoiceResponse>;

  deleteInvoice(
    request: api_pb.DeleteInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.DeleteInvoiceResponse) => void): grpcWeb.ClientReadableStream<api_pb.DeleteInvoiceResponse>;

  deleteInvoice(
    request: api_pb.DeleteInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.DeleteInvoiceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/DeleteInvoice',
        request,
        metadata || {},
        this.methodInfoDeleteInvoice,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/DeleteInvoice',
    request,
    metadata || {},
    this.methodInfoDeleteInvoice);
  }

  methodInfoGetInvoices = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetInvoicesResponse,
    (request: api_pb.GetInvoicesRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetInvoicesResponse.deserializeBinary
  );

  getInvoices(
    request: api_pb.GetInvoicesRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetInvoicesResponse>;

  getInvoices(
    request: api_pb.GetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetInvoicesResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetInvoicesResponse>;

  getInvoices(
    request: api_pb.GetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetInvoicesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetInvoices',
        request,
        metadata || {},
        this.methodInfoGetInvoices,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetInvoices',
    request,
    metadata || {},
    this.methodInfoGetInvoices);
  }

  methodInfoGetInvoiceById = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetInvoicesResponse,
    (request: api_pb.GetInvoiceByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetInvoicesResponse.deserializeBinary
  );

  getInvoiceById(
    request: api_pb.GetInvoiceByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetInvoicesResponse>;

  getInvoiceById(
    request: api_pb.GetInvoiceByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetInvoicesResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetInvoicesResponse>;

  getInvoiceById(
    request: api_pb.GetInvoiceByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetInvoicesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetInvoiceById',
        request,
        metadata || {},
        this.methodInfoGetInvoiceById,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetInvoiceById',
    request,
    metadata || {},
    this.methodInfoGetInvoiceById);
  }

  methodInfoGetInvoicePayments = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetInvoicePaymentsResponse,
    (request: api_pb.GetInvoicePaymentsRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetInvoicePaymentsResponse.deserializeBinary
  );

  getInvoicePayments(
    request: api_pb.GetInvoicePaymentsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetInvoicePaymentsResponse>;

  getInvoicePayments(
    request: api_pb.GetInvoicePaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetInvoicePaymentsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetInvoicePaymentsResponse>;

  getInvoicePayments(
    request: api_pb.GetInvoicePaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetInvoicePaymentsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetInvoicePayments',
        request,
        metadata || {},
        this.methodInfoGetInvoicePayments,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetInvoicePayments',
    request,
    metadata || {},
    this.methodInfoGetInvoicePayments);
  }

  methodInfoSubscribePublicInvoice = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.SubscribePublicInvoiceResponse,
    (request: api_pb.SubscribePublicInvoiceRequest) => {
      return request.serializeBinary();
    },
    api_pb.SubscribePublicInvoiceResponse.deserializeBinary
  );

  subscribePublicInvoice(
    request: api_pb.SubscribePublicInvoiceRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/CoreSchema.V1.TradeApi/SubscribePublicInvoice',
      request,
      metadata || {},
      this.methodInfoSubscribePublicInvoice);
  }

  methodInfoGetLastAdSearchParams = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetLastAdSearchParamsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetLastAdSearchParamsResponse.deserializeBinary
  );

  getLastAdSearchParams(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetLastAdSearchParamsResponse>;

  getLastAdSearchParams(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetLastAdSearchParamsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetLastAdSearchParamsResponse>;

  getLastAdSearchParams(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetLastAdSearchParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetLastAdSearchParams',
        request,
        metadata || {},
        this.methodInfoGetLastAdSearchParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetLastAdSearchParams',
    request,
    metadata || {},
    this.methodInfoGetLastAdSearchParams);
  }

  methodInfoSendInvoicePaymentFeedback = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.SendInvoicePaymentFeedbackRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  sendInvoicePaymentFeedback(
    request: api_pb.SendInvoicePaymentFeedbackRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  sendInvoicePaymentFeedback(
    request: api_pb.SendInvoicePaymentFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  sendInvoicePaymentFeedback(
    request: api_pb.SendInvoicePaymentFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/SendInvoicePaymentFeedback',
        request,
        metadata || {},
        this.methodInfoSendInvoicePaymentFeedback,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/SendInvoicePaymentFeedback',
    request,
    metadata || {},
    this.methodInfoSendInvoicePaymentFeedback);
  }

  methodInfoPayInvoiceFromBalance = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.PayInvoiceFromBalanceRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceFromBalance(
    request: api_pb.PayInvoiceFromBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  payInvoiceFromBalance(
    request: api_pb.PayInvoiceFromBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  payInvoiceFromBalance(
    request: api_pb.PayInvoiceFromBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PayInvoiceFromBalance',
        request,
        metadata || {},
        this.methodInfoPayInvoiceFromBalance,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PayInvoiceFromBalance',
    request,
    metadata || {},
    this.methodInfoPayInvoiceFromBalance);
  }

  methodInfoPayInvoiceByBestDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.PayInvoiceByBestDealRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceByBestDeal(
    request: api_pb.PayInvoiceByBestDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  payInvoiceByBestDeal(
    request: api_pb.PayInvoiceByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  payInvoiceByBestDeal(
    request: api_pb.PayInvoiceByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PayInvoiceByBestDeal',
        request,
        metadata || {},
        this.methodInfoPayInvoiceByBestDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PayInvoiceByBestDeal',
    request,
    metadata || {},
    this.methodInfoPayInvoiceByBestDeal);
  }

  methodInfoGetInvoiceSuitableAdvertisements = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetInvoiceSuitableAdvertisementResponse,
    (request: api_pb.GetInvoiceSuitableAdvertisementsRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetInvoiceSuitableAdvertisementResponse.deserializeBinary
  );

  getInvoiceSuitableAdvertisements(
    request: api_pb.GetInvoiceSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetInvoiceSuitableAdvertisementResponse>;

  getInvoiceSuitableAdvertisements(
    request: api_pb.GetInvoiceSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetInvoiceSuitableAdvertisementResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetInvoiceSuitableAdvertisementResponse>;

  getInvoiceSuitableAdvertisements(
    request: api_pb.GetInvoiceSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetInvoiceSuitableAdvertisementResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetInvoiceSuitableAdvertisements',
        request,
        metadata || {},
        this.methodInfoGetInvoiceSuitableAdvertisements,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetInvoiceSuitableAdvertisements',
    request,
    metadata || {},
    this.methodInfoGetInvoiceSuitableAdvertisements);
  }

  methodInfoPayInvoiceByDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.PayInvoiceByDealRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceByDeal(
    request: api_pb.PayInvoiceByDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  payInvoiceByDeal(
    request: api_pb.PayInvoiceByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  payInvoiceByDeal(
    request: api_pb.PayInvoiceByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PayInvoiceByDeal',
        request,
        metadata || {},
        this.methodInfoPayInvoiceByDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PayInvoiceByDeal',
    request,
    metadata || {},
    this.methodInfoPayInvoiceByDeal);
  }

  methodInfoCancelInvoicePayment = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.CancelInvoicePaymentRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  cancelInvoicePayment(
    request: api_pb.CancelInvoicePaymentRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  cancelInvoicePayment(
    request: api_pb.CancelInvoicePaymentRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  cancelInvoicePayment(
    request: api_pb.CancelInvoicePaymentRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CancelInvoicePayment',
        request,
        metadata || {},
        this.methodInfoCancelInvoicePayment,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CancelInvoicePayment',
    request,
    metadata || {},
    this.methodInfoCancelInvoicePayment);
  }

  methodInfoSendInvoiceMessage = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Conversation,
    (request: api_pb.SendInvoiceMessageRequest) => {
      return request.serializeBinary();
    },
    api_pb.Conversation.deserializeBinary
  );

  sendInvoiceMessage(
    request: api_pb.SendInvoiceMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Conversation>;

  sendInvoiceMessage(
    request: api_pb.SendInvoiceMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Conversation) => void): grpcWeb.ClientReadableStream<api_pb.Conversation>;

  sendInvoiceMessage(
    request: api_pb.SendInvoiceMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Conversation) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/SendInvoiceMessage',
        request,
        metadata || {},
        this.methodInfoSendInvoiceMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/SendInvoiceMessage',
    request,
    metadata || {},
    this.methodInfoSendInvoiceMessage);
  }

  methodInfoSendInvoicePaymentMessage = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Conversation,
    (request: api_pb.SendInvoicePaymentMessageRequest) => {
      return request.serializeBinary();
    },
    api_pb.Conversation.deserializeBinary
  );

  sendInvoicePaymentMessage(
    request: api_pb.SendInvoicePaymentMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Conversation>;

  sendInvoicePaymentMessage(
    request: api_pb.SendInvoicePaymentMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Conversation) => void): grpcWeb.ClientReadableStream<api_pb.Conversation>;

  sendInvoicePaymentMessage(
    request: api_pb.SendInvoicePaymentMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Conversation) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/SendInvoicePaymentMessage',
        request,
        metadata || {},
        this.methodInfoSendInvoicePaymentMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/SendInvoicePaymentMessage',
    request,
    metadata || {},
    this.methodInfoSendInvoicePaymentMessage);
  }

  methodInfoGetConversations = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetConversationsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.GetConversationsResponse.deserializeBinary
  );

  getConversations(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetConversationsResponse>;

  getConversations(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetConversationsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetConversationsResponse>;

  getConversations(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetConversationsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetConversations',
        request,
        metadata || {},
        this.methodInfoGetConversations,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetConversations',
    request,
    metadata || {},
    this.methodInfoGetConversations);
  }

  methodInfoGetConversationsById = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetConversationsResponse,
    (request: api_pb.GetConversationsByIdRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetConversationsResponse.deserializeBinary
  );

  getConversationsById(
    request: api_pb.GetConversationsByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetConversationsResponse>;

  getConversationsById(
    request: api_pb.GetConversationsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetConversationsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetConversationsResponse>;

  getConversationsById(
    request: api_pb.GetConversationsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetConversationsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetConversationsById',
        request,
        metadata || {},
        this.methodInfoGetConversationsById,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetConversationsById',
    request,
    metadata || {},
    this.methodInfoGetConversationsById);
  }

  methodInfoDeleteConversation = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.DeleteConversationRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteConversation(
    request: api_pb.DeleteConversationRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteConversation(
    request: api_pb.DeleteConversationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteConversation(
    request: api_pb.DeleteConversationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/DeleteConversation',
        request,
        metadata || {},
        this.methodInfoDeleteConversation,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/DeleteConversation',
    request,
    metadata || {},
    this.methodInfoDeleteConversation);
  }

  methodInfoCreateRefund = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.CreateRefundResponse,
    (request: api_pb.CreateRefundRequest) => {
      return request.serializeBinary();
    },
    api_pb.CreateRefundResponse.deserializeBinary
  );

  createRefund(
    request: api_pb.CreateRefundRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.CreateRefundResponse>;

  createRefund(
    request: api_pb.CreateRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.CreateRefundResponse) => void): grpcWeb.ClientReadableStream<api_pb.CreateRefundResponse>;

  createRefund(
    request: api_pb.CreateRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.CreateRefundResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateRefund',
        request,
        metadata || {},
        this.methodInfoCreateRefund,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateRefund',
    request,
    metadata || {},
    this.methodInfoCreateRefund);
  }

  methodInfoBuyAutoPriceRecalcs = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Invoice,
    (request: api_pb.BuyAutoPriceRecalcsRequest) => {
      return request.serializeBinary();
    },
    api_pb.Invoice.deserializeBinary
  );

  buyAutoPriceRecalcs(
    request: api_pb.BuyAutoPriceRecalcsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Invoice>;

  buyAutoPriceRecalcs(
    request: api_pb.BuyAutoPriceRecalcsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Invoice) => void): grpcWeb.ClientReadableStream<api_pb.Invoice>;

  buyAutoPriceRecalcs(
    request: api_pb.BuyAutoPriceRecalcsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Invoice) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/BuyAutoPriceRecalcs',
        request,
        metadata || {},
        this.methodInfoBuyAutoPriceRecalcs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/BuyAutoPriceRecalcs',
    request,
    metadata || {},
    this.methodInfoBuyAutoPriceRecalcs);
  }

  methodInfoGetMyProfile = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.MyProfileResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.MyProfileResponse.deserializeBinary
  );

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.MyProfileResponse>;

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.MyProfileResponse) => void): grpcWeb.ClientReadableStream<api_pb.MyProfileResponse>;

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.MyProfileResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetMyProfile',
        request,
        metadata || {},
        this.methodInfoGetMyProfile,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetMyProfile',
    request,
    metadata || {},
    this.methodInfoGetMyProfile);
  }

  methodInfoCreatePromise = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.CreatePromiseResponse,
    (request: api_pb.CreatePromiseRequest) => {
      return request.serializeBinary();
    },
    api_pb.CreatePromiseResponse.deserializeBinary
  );

  createPromise(
    request: api_pb.CreatePromiseRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.CreatePromiseResponse>;

  createPromise(
    request: api_pb.CreatePromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.CreatePromiseResponse) => void): grpcWeb.ClientReadableStream<api_pb.CreatePromiseResponse>;

  createPromise(
    request: api_pb.CreatePromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.CreatePromiseResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreatePromise',
        request,
        metadata || {},
        this.methodInfoCreatePromise,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreatePromise',
    request,
    metadata || {},
    this.methodInfoCreatePromise);
  }

  methodInfoPromiseToBalance = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Balance,
    (request: api_pb.PromiseToBalanceRequest) => {
      return request.serializeBinary();
    },
    api_pb.Balance.deserializeBinary
  );

  promiseToBalance(
    request: api_pb.PromiseToBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Balance>;

  promiseToBalance(
    request: api_pb.PromiseToBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Balance) => void): grpcWeb.ClientReadableStream<api_pb.Balance>;

  promiseToBalance(
    request: api_pb.PromiseToBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Balance) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PromiseToBalance',
        request,
        metadata || {},
        this.methodInfoPromiseToBalance,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PromiseToBalance',
    request,
    metadata || {},
    this.methodInfoPromiseToBalance);
  }

  methodInfoPromiseSellByBestDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.PromiseSellByBestDealRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  promiseSellByBestDeal(
    request: api_pb.PromiseSellByBestDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  promiseSellByBestDeal(
    request: api_pb.PromiseSellByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  promiseSellByBestDeal(
    request: api_pb.PromiseSellByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PromiseSellByBestDeal',
        request,
        metadata || {},
        this.methodInfoPromiseSellByBestDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PromiseSellByBestDeal',
    request,
    metadata || {},
    this.methodInfoPromiseSellByBestDeal);
  }

  methodInfoGetPromiseSuitableAdvertisements = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.GetPromiseSuitableAdvertisementsResponse,
    (request: api_pb.GetPromiseSuitableAdvertisementsRequest) => {
      return request.serializeBinary();
    },
    api_pb.GetPromiseSuitableAdvertisementsResponse.deserializeBinary
  );

  getPromiseSuitableAdvertisements(
    request: api_pb.GetPromiseSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.GetPromiseSuitableAdvertisementsResponse>;

  getPromiseSuitableAdvertisements(
    request: api_pb.GetPromiseSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.GetPromiseSuitableAdvertisementsResponse) => void): grpcWeb.ClientReadableStream<api_pb.GetPromiseSuitableAdvertisementsResponse>;

  getPromiseSuitableAdvertisements(
    request: api_pb.GetPromiseSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.GetPromiseSuitableAdvertisementsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetPromiseSuitableAdvertisements',
        request,
        metadata || {},
        this.methodInfoGetPromiseSuitableAdvertisements,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetPromiseSuitableAdvertisements',
    request,
    metadata || {},
    this.methodInfoGetPromiseSuitableAdvertisements);
  }

  methodInfoPromiseSellByDeal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Deal,
    (request: api_pb.PromiseSellByDealRequest) => {
      return request.serializeBinary();
    },
    api_pb.Deal.deserializeBinary
  );

  promiseSellByDeal(
    request: api_pb.PromiseSellByDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Deal>;

  promiseSellByDeal(
    request: api_pb.PromiseSellByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Deal) => void): grpcWeb.ClientReadableStream<api_pb.Deal>;

  promiseSellByDeal(
    request: api_pb.PromiseSellByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Deal) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PromiseSellByDeal',
        request,
        metadata || {},
        this.methodInfoPromiseSellByDeal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PromiseSellByDeal',
    request,
    metadata || {},
    this.methodInfoPromiseSellByDeal);
  }

  methodInfoPayInvoiceByPromise = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.PayInvoiceByPromiseRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceByPromise(
    request: api_pb.PayInvoiceByPromiseRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  payInvoiceByPromise(
    request: api_pb.PayInvoiceByPromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  payInvoiceByPromise(
    request: api_pb.PayInvoiceByPromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PayInvoiceByPromise',
        request,
        metadata || {},
        this.methodInfoPayInvoiceByPromise,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PayInvoiceByPromise',
    request,
    metadata || {},
    this.methodInfoPayInvoiceByPromise);
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
          '/CoreSchema.V1.TradeApi/StoreImage',
        request,
        metadata || {},
        this.methodInfoStoreImage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/StoreImage',
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
          '/CoreSchema.V1.TradeApi/GetImage',
        request,
        metadata || {},
        this.methodInfoGetImage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetImage',
    request,
    metadata || {},
    this.methodInfoGetImage);
  }

  methodInfoGetInvoiceSecrets = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoiceSecretsList,
    (request: api_pb.GetInvoiceSecretsRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoiceSecretsList.deserializeBinary
  );

  getInvoiceSecrets(
    request: api_pb.GetInvoiceSecretsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoiceSecretsList>;

  getInvoiceSecrets(
    request: api_pb.GetInvoiceSecretsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<api_pb.InvoiceSecretsList>;

  getInvoiceSecrets(
    request: api_pb.GetInvoiceSecretsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetInvoiceSecrets',
        request,
        metadata || {},
        this.methodInfoGetInvoiceSecrets,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetInvoiceSecrets',
    request,
    metadata || {},
    this.methodInfoGetInvoiceSecrets);
  }

  methodInfoChangeInvoiceSecret = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoiceSecretsList,
    (request: api_pb.ChangeInvoiceSecretRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoiceSecretsList.deserializeBinary
  );

  changeInvoiceSecret(
    request: api_pb.ChangeInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoiceSecretsList>;

  changeInvoiceSecret(
    request: api_pb.ChangeInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<api_pb.InvoiceSecretsList>;

  changeInvoiceSecret(
    request: api_pb.ChangeInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/ChangeInvoiceSecret',
        request,
        metadata || {},
        this.methodInfoChangeInvoiceSecret,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/ChangeInvoiceSecret',
    request,
    metadata || {},
    this.methodInfoChangeInvoiceSecret);
  }

  methodInfoCreateInvoiceSecret = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoiceSecretsList,
    (request: api_pb.CreateInvoiceSecretRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoiceSecretsList.deserializeBinary
  );

  createInvoiceSecret(
    request: api_pb.CreateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoiceSecretsList>;

  createInvoiceSecret(
    request: api_pb.CreateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<api_pb.InvoiceSecretsList>;

  createInvoiceSecret(
    request: api_pb.CreateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/CreateInvoiceSecret',
        request,
        metadata || {},
        this.methodInfoCreateInvoiceSecret,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/CreateInvoiceSecret',
    request,
    metadata || {},
    this.methodInfoCreateInvoiceSecret);
  }

  methodInfoUpdateInvoiceSecret = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoiceSecretsList,
    (request: api_pb.UpdateInvoiceSecretRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoiceSecretsList.deserializeBinary
  );

  updateInvoiceSecret(
    request: api_pb.UpdateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoiceSecretsList>;

  updateInvoiceSecret(
    request: api_pb.UpdateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<api_pb.InvoiceSecretsList>;

  updateInvoiceSecret(
    request: api_pb.UpdateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoiceSecretsList) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/UpdateInvoiceSecret',
        request,
        metadata || {},
        this.methodInfoUpdateInvoiceSecret,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/UpdateInvoiceSecret',
    request,
    metadata || {},
    this.methodInfoUpdateInvoiceSecret);
  }

  methodInfoPayInvoiceFromLN = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.InvoicePayment,
    (request: api_pb.PayInvoiceFromLNRequest) => {
      return request.serializeBinary();
    },
    api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceFromLN(
    request: api_pb.PayInvoiceFromLNRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.InvoicePayment>;

  payInvoiceFromLN(
    request: api_pb.PayInvoiceFromLNRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<api_pb.InvoicePayment>;

  payInvoiceFromLN(
    request: api_pb.PayInvoiceFromLNRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.InvoicePayment) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/PayInvoiceFromLN',
        request,
        metadata || {},
        this.methodInfoPayInvoiceFromLN,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/PayInvoiceFromLN',
    request,
    metadata || {},
    this.methodInfoPayInvoiceFromLN);
  }

  methodInfoLNDeposit = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.LNDepositResponse,
    (request: api_pb.LNDepositRequest) => {
      return request.serializeBinary();
    },
    api_pb.LNDepositResponse.deserializeBinary
  );

  lNDeposit(
    request: api_pb.LNDepositRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.LNDepositResponse>;

  lNDeposit(
    request: api_pb.LNDepositRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.LNDepositResponse) => void): grpcWeb.ClientReadableStream<api_pb.LNDepositResponse>;

  lNDeposit(
    request: api_pb.LNDepositRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.LNDepositResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/LNDeposit',
        request,
        metadata || {},
        this.methodInfoLNDeposit,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/LNDeposit',
    request,
    metadata || {},
    this.methodInfoLNDeposit);
  }

  methodInfoLNWithdrawal = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Balance,
    (request: api_pb.LNWithdrawalRequest) => {
      return request.serializeBinary();
    },
    api_pb.Balance.deserializeBinary
  );

  lNWithdrawal(
    request: api_pb.LNWithdrawalRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Balance>;

  lNWithdrawal(
    request: api_pb.LNWithdrawalRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Balance) => void): grpcWeb.ClientReadableStream<api_pb.Balance>;

  lNWithdrawal(
    request: api_pb.LNWithdrawalRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Balance) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/LNWithdrawal',
        request,
        metadata || {},
        this.methodInfoLNWithdrawal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/LNWithdrawal',
    request,
    metadata || {},
    this.methodInfoLNWithdrawal);
  }

  methodInfoLNGetInvoices = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.LNGetInvoicesResponse,
    (request: api_pb.LNGetInvoicesRequest) => {
      return request.serializeBinary();
    },
    api_pb.LNGetInvoicesResponse.deserializeBinary
  );

  lNGetInvoices(
    request: api_pb.LNGetInvoicesRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.LNGetInvoicesResponse>;

  lNGetInvoices(
    request: api_pb.LNGetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.LNGetInvoicesResponse) => void): grpcWeb.ClientReadableStream<api_pb.LNGetInvoicesResponse>;

  lNGetInvoices(
    request: api_pb.LNGetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.LNGetInvoicesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/LNGetInvoices',
        request,
        metadata || {},
        this.methodInfoLNGetInvoices,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/LNGetInvoices',
    request,
    metadata || {},
    this.methodInfoLNGetInvoices);
  }

  methodInfoLNGetPayments = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.LNGetPaymentsResponse,
    (request: api_pb.LNGetPaymentsRequest) => {
      return request.serializeBinary();
    },
    api_pb.LNGetPaymentsResponse.deserializeBinary
  );

  lNGetPayments(
    request: api_pb.LNGetPaymentsRequest,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.LNGetPaymentsResponse>;

  lNGetPayments(
    request: api_pb.LNGetPaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.LNGetPaymentsResponse) => void): grpcWeb.ClientReadableStream<api_pb.LNGetPaymentsResponse>;

  lNGetPayments(
    request: api_pb.LNGetPaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.LNGetPaymentsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/LNGetPayments',
        request,
        metadata || {},
        this.methodInfoLNGetPayments,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/LNGetPayments',
    request,
    metadata || {},
    this.methodInfoLNGetPayments);
  }

  methodInfoUpdateMyProfile = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: api_pb.UpdateMyProfileRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  updateMyProfile(
    request: api_pb.UpdateMyProfileRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  updateMyProfile(
    request: api_pb.UpdateMyProfileRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  updateMyProfile(
    request: api_pb.UpdateMyProfileRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/UpdateMyProfile',
        request,
        metadata || {},
        this.methodInfoUpdateMyProfile,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/UpdateMyProfile',
    request,
    metadata || {},
    this.methodInfoUpdateMyProfile);
  }

  methodInfoGetBalances = new grpcWeb.AbstractClientBase.MethodInfo(
    api_pb.Balance,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    api_pb.Balance.deserializeBinary
  );

  getBalances(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<api_pb.Balance>;

  getBalances(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: api_pb.Balance) => void): grpcWeb.ClientReadableStream<api_pb.Balance>;

  getBalances(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: api_pb.Balance) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CoreSchema.V1.TradeApi/GetBalances',
        request,
        metadata || {},
        this.methodInfoGetBalances,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CoreSchema.V1.TradeApi/GetBalances',
    request,
    metadata || {},
    this.methodInfoGetBalances);
  }

}

