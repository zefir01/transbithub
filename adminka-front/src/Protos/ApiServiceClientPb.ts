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
import * as Protos_api_pb from '../Protos/api_pb';


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
        '/CoreSchema.V1.TradeApi/SubscribeVariables',
      request,
      metadata || {},
      this.methodInfoSubscribeVariables);
  }

  methodInfoGetVariables = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_api_pb.Variables,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Variables.deserializeBinary
  );

  getVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Variables>;

  getVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Variables) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Variables>;

  getVariables(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Variables) => void) {
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
    Protos_api_pb.Advertisement,
    (request: Protos_api_pb.AdvertisementData) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Advertisement.deserializeBinary
  );

  createAdvertisement(
    request: Protos_api_pb.AdvertisementData,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Advertisement>;

  createAdvertisement(
    request: Protos_api_pb.AdvertisementData,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Advertisement>;

  createAdvertisement(
    request: Protos_api_pb.AdvertisementData,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void) {
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
    (request: Protos_api_pb.DeleteAdvertisementRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteAdvertisement(
    request: Protos_api_pb.DeleteAdvertisementRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteAdvertisement(
    request: Protos_api_pb.DeleteAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteAdvertisement(
    request: Protos_api_pb.DeleteAdvertisementRequest,
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
    Protos_api_pb.ChangeAdvertisementStatusResponse,
    (request: Protos_api_pb.ChangeAdvertisementStatusRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.ChangeAdvertisementStatusResponse.deserializeBinary
  );

  changeAdvertisementStatus(
    request: Protos_api_pb.ChangeAdvertisementStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.ChangeAdvertisementStatusResponse>;

  changeAdvertisementStatus(
    request: Protos_api_pb.ChangeAdvertisementStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.ChangeAdvertisementStatusResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.ChangeAdvertisementStatusResponse>;

  changeAdvertisementStatus(
    request: Protos_api_pb.ChangeAdvertisementStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.ChangeAdvertisementStatusResponse) => void) {
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
    Protos_api_pb.Advertisement,
    (request: Protos_api_pb.ModifyAdvertisementRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Advertisement.deserializeBinary
  );

  modifyAdvertisement(
    request: Protos_api_pb.ModifyAdvertisementRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Advertisement>;

  modifyAdvertisement(
    request: Protos_api_pb.ModifyAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Advertisement>;

  modifyAdvertisement(
    request: Protos_api_pb.ModifyAdvertisementRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void) {
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
    Protos_api_pb.FindAdvertisementsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.FindAdvertisementsResponse.deserializeBinary
  );

  getMyAdvertisements(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.FindAdvertisementsResponse>;

  getMyAdvertisements(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.FindAdvertisementsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.FindAdvertisementsResponse>;

  getMyAdvertisements(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.FindAdvertisementsResponse) => void) {
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
    Protos_api_pb.Advertisement,
    (request: Protos_api_pb.GetAdvertisementsByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Advertisement.deserializeBinary
  );

  getAdvertisementsById(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Advertisement>;

  getAdvertisementsById(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Advertisement>;

  getAdvertisementsById(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void) {
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
    Protos_api_pb.Advertisement,
    (request: Protos_api_pb.GetAdvertisementsByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Advertisement.deserializeBinary
  );

  getMyAdvertisementsById(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Advertisement>;

  getMyAdvertisementsById(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Advertisement>;

  getMyAdvertisementsById(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Advertisement) => void) {
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
    Protos_api_pb.FindAdvertisementsResponse,
    (request: Protos_api_pb.FindAdvertisementsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.FindAdvertisementsResponse.deserializeBinary
  );

  findAdvertisements(
    request: Protos_api_pb.FindAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.FindAdvertisementsResponse>;

  findAdvertisements(
    request: Protos_api_pb.FindAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.FindAdvertisementsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.FindAdvertisementsResponse>;

  findAdvertisements(
    request: Protos_api_pb.FindAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.FindAdvertisementsResponse) => void) {
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
    Protos_api_pb.SubscribeAdvertisementChangesResponse,
    (request: Protos_api_pb.GetAdvertisementsByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.SubscribeAdvertisementChangesResponse.deserializeBinary
  );

  subscribeAdvertisementChanges(
    request: Protos_api_pb.GetAdvertisementsByIdRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/CoreSchema.V1.TradeApi/SubscribeAdvertisementChanges',
      request,
      metadata || {},
      this.methodInfoSubscribeAdvertisementChanges);
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
    Protos_api_pb.GetMyDealsResponse,
    (request: Protos_api_pb.GetMyDealsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetMyDealsResponse.deserializeBinary
  );

  getMyDeals(
    request: Protos_api_pb.GetMyDealsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetMyDealsResponse>;

  getMyDeals(
    request: Protos_api_pb.GetMyDealsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetMyDealsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetMyDealsResponse>;

  getMyDeals(
    request: Protos_api_pb.GetMyDealsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetMyDealsResponse) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.CreateDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  createDeal(
    request: Protos_api_pb.CreateDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  createDeal(
    request: Protos_api_pb.CreateDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  createDeal(
    request: Protos_api_pb.CreateDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.CreateDealLnBuyRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  createDealLnBuy(
    request: Protos_api_pb.CreateDealLnBuyRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  createDealLnBuy(
    request: Protos_api_pb.CreateDealLnBuyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  createDealLnBuy(
    request: Protos_api_pb.CreateDealLnBuyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.CreateDealLnSellRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  createDealLnSell(
    request: Protos_api_pb.CreateDealLnSellRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  createDealLnSell(
    request: Protos_api_pb.CreateDealLnSellRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  createDealLnSell(
    request: Protos_api_pb.CreateDealLnSellRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.GetDealByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  getDealById(
    request: Protos_api_pb.GetDealByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  getDealById(
    request: Protos_api_pb.GetDealByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  getDealById(
    request: Protos_api_pb.GetDealByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_api_pb.SendMessageResponse,
    (request: Protos_api_pb.SendMessageRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.SendMessageResponse.deserializeBinary
  );

  sendMessage(
    request: Protos_api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.SendMessageResponse>;

  sendMessage(
    request: Protos_api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.SendMessageResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.SendMessageResponse>;

  sendMessage(
    request: Protos_api_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.SendMessageResponse) => void) {
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
        '/CoreSchema.V1.TradeApi/SubscribeNewEvents',
      request,
      metadata || {},
      this.methodInfoSubscribeNewEvents);
  }

  methodInfoGetUserEvents = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_api_pb.GetUserEventsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetUserEventsResponse.deserializeBinary
  );

  getUserEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetUserEventsResponse>;

  getUserEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetUserEventsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetUserEventsResponse>;

  getUserEvents(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetUserEventsResponse) => void) {
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
    Protos_api_pb.CancelDealResponse,
    (request: Protos_api_pb.CancelDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.CancelDealResponse.deserializeBinary
  );

  cancelDeal(
    request: Protos_api_pb.CancelDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.CancelDealResponse>;

  cancelDeal(
    request: Protos_api_pb.CancelDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.CancelDealResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.CancelDealResponse>;

  cancelDeal(
    request: Protos_api_pb.CancelDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.CancelDealResponse) => void) {
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
    Protos_api_pb.IPayedResponse,
    (request: Protos_api_pb.IPayedRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.IPayedResponse.deserializeBinary
  );

  iPayed(
    request: Protos_api_pb.IPayedRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.IPayedResponse>;

  iPayed(
    request: Protos_api_pb.IPayedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.IPayedResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.IPayedResponse>;

  iPayed(
    request: Protos_api_pb.IPayedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.IPayedResponse) => void) {
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
    Protos_api_pb.CreateDisputeResponse,
    (request: Protos_api_pb.CreateDisputeRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.CreateDisputeResponse.deserializeBinary
  );

  createDispute(
    request: Protos_api_pb.CreateDisputeRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.CreateDisputeResponse>;

  createDispute(
    request: Protos_api_pb.CreateDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.CreateDisputeResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.CreateDisputeResponse>;

  createDispute(
    request: Protos_api_pb.CreateDisputeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.CreateDisputeResponse) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.SendFeedbackRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  sendFeedback(
    request: Protos_api_pb.SendFeedbackRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  sendFeedback(
    request: Protos_api_pb.SendFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  sendFeedback(
    request: Protos_api_pb.SendFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    (request: Protos_api_pb.AddUserToTrustedRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  addUserToTrusted(
    request: Protos_api_pb.AddUserToTrustedRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  addUserToTrusted(
    request: Protos_api_pb.AddUserToTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  addUserToTrusted(
    request: Protos_api_pb.AddUserToTrustedRequest,
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
    (request: Protos_api_pb.CreateUserComplaintRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  createUserComplaint(
    request: Protos_api_pb.CreateUserComplaintRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  createUserComplaint(
    request: Protos_api_pb.CreateUserComplaintRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  createUserComplaint(
    request: Protos_api_pb.CreateUserComplaintRequest,
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
    (request: Protos_api_pb.BlockUserRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  blockUser(
    request: Protos_api_pb.BlockUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  blockUser(
    request: Protos_api_pb.BlockUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  blockUser(
    request: Protos_api_pb.BlockUserRequest,
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
    (request: Protos_api_pb.UnBlockUserRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  unBlockUser(
    request: Protos_api_pb.UnBlockUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  unBlockUser(
    request: Protos_api_pb.UnBlockUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  unBlockUser(
    request: Protos_api_pb.UnBlockUserRequest,
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
    Protos_api_pb.GetMyBlockedUsersResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetMyBlockedUsersResponse.deserializeBinary
  );

  getMyBlockedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetMyBlockedUsersResponse>;

  getMyBlockedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetMyBlockedUsersResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetMyBlockedUsersResponse>;

  getMyBlockedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetMyBlockedUsersResponse) => void) {
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
    Protos_api_pb.GetMyTrustedUsersResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetMyTrustedUsersResponse.deserializeBinary
  );

  getMyTrustedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetMyTrustedUsersResponse>;

  getMyTrustedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetMyTrustedUsersResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetMyTrustedUsersResponse>;

  getMyTrustedUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetMyTrustedUsersResponse) => void) {
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
    (request: Protos_api_pb.RemoveFromTrustedRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  removeFromTrustedUsers(
    request: Protos_api_pb.RemoveFromTrustedRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  removeFromTrustedUsers(
    request: Protos_api_pb.RemoveFromTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  removeFromTrustedUsers(
    request: Protos_api_pb.RemoveFromTrustedRequest,
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
    Protos_api_pb.IsUserTrustedResponse,
    (request: Protos_api_pb.IsUserTrustedRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.IsUserTrustedResponse.deserializeBinary
  );

  isUserTrusted(
    request: Protos_api_pb.IsUserTrustedRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.IsUserTrustedResponse>;

  isUserTrusted(
    request: Protos_api_pb.IsUserTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.IsUserTrustedResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.IsUserTrustedResponse>;

  isUserTrusted(
    request: Protos_api_pb.IsUserTrustedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.IsUserTrustedResponse) => void) {
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
    Protos_api_pb.IsUserBlockedResponse,
    (request: Protos_api_pb.IsUserBlockedRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.IsUserBlockedResponse.deserializeBinary
  );

  isUserBlocked(
    request: Protos_api_pb.IsUserBlockedRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.IsUserBlockedResponse>;

  isUserBlocked(
    request: Protos_api_pb.IsUserBlockedRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.IsUserBlockedResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.IsUserBlockedResponse>;

  isUserBlocked(
    request: Protos_api_pb.IsUserBlockedRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.IsUserBlockedResponse) => void) {
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
    Protos_api_pb.GetTransactionsResponse,
    (request: Protos_api_pb.GetTransactionsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactions(
    request: Protos_api_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetTransactionsResponse>;

  getTransactions(
    request: Protos_api_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetTransactionsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetTransactionsResponse>;

  getTransactions(
    request: Protos_api_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetTransactionsResponse) => void) {
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
    Protos_api_pb.GetTransactionsResponse,
    (request: Protos_api_pb.GetTransactionByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactionsById(
    request: Protos_api_pb.GetTransactionByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetTransactionsResponse>;

  getTransactionsById(
    request: Protos_api_pb.GetTransactionByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetTransactionsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetTransactionsResponse>;

  getTransactionsById(
    request: Protos_api_pb.GetTransactionByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetTransactionsResponse) => void) {
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
    Protos_api_pb.GetInputAddressResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetInputAddressResponse.deserializeBinary
  );

  getInputAddress(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetInputAddressResponse>;

  getInputAddress(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInputAddressResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetInputAddressResponse>;

  getInputAddress(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInputAddressResponse) => void) {
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
    (request: Protos_api_pb.CreateTransactionRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  createTransaction(
    request: Protos_api_pb.CreateTransactionRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  createTransaction(
    request: Protos_api_pb.CreateTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  createTransaction(
    request: Protos_api_pb.CreateTransactionRequest,
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
    Protos_api_pb.GetFeesResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetFeesResponse.deserializeBinary
  );

  getFees(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetFeesResponse>;

  getFees(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetFeesResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetFeesResponse>;

  getFees(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetFeesResponse) => void) {
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
    Protos_api_pb.AllAdvertisementsStatus,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.AllAdvertisementsStatus.deserializeBinary
  );

  getAllAdvertisementsStatus(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.AllAdvertisementsStatus>;

  getAllAdvertisementsStatus(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.AllAdvertisementsStatus) => void): grpcWeb.ClientReadableStream<Protos_api_pb.AllAdvertisementsStatus>;

  getAllAdvertisementsStatus(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.AllAdvertisementsStatus) => void) {
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
    Protos_api_pb.MyProfileResponse,
    (request: Protos_api_pb.AllAdvertisementsStatus) => {
      return request.serializeBinary();
    },
    Protos_api_pb.MyProfileResponse.deserializeBinary
  );

  setAllAdvertisementsStatus(
    request: Protos_api_pb.AllAdvertisementsStatus,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.MyProfileResponse>;

  setAllAdvertisementsStatus(
    request: Protos_api_pb.AllAdvertisementsStatus,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.MyProfileResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.MyProfileResponse>;

  setAllAdvertisementsStatus(
    request: Protos_api_pb.AllAdvertisementsStatus,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.MyProfileResponse) => void) {
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
    Protos_api_pb.IsUserExistResponse,
    (request: Protos_api_pb.IsUserExistRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.IsUserExistResponse.deserializeBinary
  );

  isUserExist(
    request: Protos_api_pb.IsUserExistRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.IsUserExistResponse>;

  isUserExist(
    request: Protos_api_pb.IsUserExistRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.IsUserExistResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.IsUserExistResponse>;

  isUserExist(
    request: Protos_api_pb.IsUserExistRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.IsUserExistResponse) => void) {
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
    Protos_api_pb.Invoice,
    (request: Protos_api_pb.CreateInvoiceRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Invoice.deserializeBinary
  );

  createInvoice(
    request: Protos_api_pb.CreateInvoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Invoice>;

  createInvoice(
    request: Protos_api_pb.CreateInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Invoice) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Invoice>;

  createInvoice(
    request: Protos_api_pb.CreateInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Invoice) => void) {
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
    Protos_api_pb.Invoice,
    (request: Protos_api_pb.UpdatePublicInvoiceRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Invoice.deserializeBinary
  );

  updatePublicInvoice(
    request: Protos_api_pb.UpdatePublicInvoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Invoice>;

  updatePublicInvoice(
    request: Protos_api_pb.UpdatePublicInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Invoice) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Invoice>;

  updatePublicInvoice(
    request: Protos_api_pb.UpdatePublicInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Invoice) => void) {
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
    Protos_api_pb.DeleteInvoiceResponse,
    (request: Protos_api_pb.DeleteInvoiceRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.DeleteInvoiceResponse.deserializeBinary
  );

  deleteInvoice(
    request: Protos_api_pb.DeleteInvoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.DeleteInvoiceResponse>;

  deleteInvoice(
    request: Protos_api_pb.DeleteInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.DeleteInvoiceResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.DeleteInvoiceResponse>;

  deleteInvoice(
    request: Protos_api_pb.DeleteInvoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.DeleteInvoiceResponse) => void) {
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
    Protos_api_pb.GetInvoicesResponse,
    (request: Protos_api_pb.GetInvoicesRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetInvoicesResponse.deserializeBinary
  );

  getInvoices(
    request: Protos_api_pb.GetInvoicesRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetInvoicesResponse>;

  getInvoices(
    request: Protos_api_pb.GetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoicesResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetInvoicesResponse>;

  getInvoices(
    request: Protos_api_pb.GetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoicesResponse) => void) {
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
    Protos_api_pb.GetInvoicesResponse,
    (request: Protos_api_pb.GetInvoiceByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetInvoicesResponse.deserializeBinary
  );

  getInvoiceById(
    request: Protos_api_pb.GetInvoiceByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetInvoicesResponse>;

  getInvoiceById(
    request: Protos_api_pb.GetInvoiceByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoicesResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetInvoicesResponse>;

  getInvoiceById(
    request: Protos_api_pb.GetInvoiceByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoicesResponse) => void) {
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
    Protos_api_pb.GetInvoicePaymentsResponse,
    (request: Protos_api_pb.GetInvoicePaymentsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetInvoicePaymentsResponse.deserializeBinary
  );

  getInvoicePayments(
    request: Protos_api_pb.GetInvoicePaymentsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetInvoicePaymentsResponse>;

  getInvoicePayments(
    request: Protos_api_pb.GetInvoicePaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoicePaymentsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetInvoicePaymentsResponse>;

  getInvoicePayments(
    request: Protos_api_pb.GetInvoicePaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoicePaymentsResponse) => void) {
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
    Protos_api_pb.SubscribePublicInvoiceResponse,
    (request: Protos_api_pb.SubscribePublicInvoiceRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.SubscribePublicInvoiceResponse.deserializeBinary
  );

  subscribePublicInvoice(
    request: Protos_api_pb.SubscribePublicInvoiceRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/CoreSchema.V1.TradeApi/SubscribePublicInvoice',
      request,
      metadata || {},
      this.methodInfoSubscribePublicInvoice);
  }

  methodInfoGetLastAdSearchParams = new grpcWeb.AbstractClientBase.MethodInfo(
    Protos_api_pb.GetLastAdSearchParamsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetLastAdSearchParamsResponse.deserializeBinary
  );

  getLastAdSearchParams(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetLastAdSearchParamsResponse>;

  getLastAdSearchParams(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetLastAdSearchParamsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetLastAdSearchParamsResponse>;

  getLastAdSearchParams(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetLastAdSearchParamsResponse) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.SendInvoicePaymentFeedbackRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  sendInvoicePaymentFeedback(
    request: Protos_api_pb.SendInvoicePaymentFeedbackRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  sendInvoicePaymentFeedback(
    request: Protos_api_pb.SendInvoicePaymentFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  sendInvoicePaymentFeedback(
    request: Protos_api_pb.SendInvoicePaymentFeedbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.PayInvoiceFromBalanceRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceFromBalance(
    request: Protos_api_pb.PayInvoiceFromBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  payInvoiceFromBalance(
    request: Protos_api_pb.PayInvoiceFromBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  payInvoiceFromBalance(
    request: Protos_api_pb.PayInvoiceFromBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.PayInvoiceByBestDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceByBestDeal(
    request: Protos_api_pb.PayInvoiceByBestDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  payInvoiceByBestDeal(
    request: Protos_api_pb.PayInvoiceByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  payInvoiceByBestDeal(
    request: Protos_api_pb.PayInvoiceByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.GetInvoiceSuitableAdvertisementResponse,
    (request: Protos_api_pb.GetInvoiceSuitableAdvertisementsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetInvoiceSuitableAdvertisementResponse.deserializeBinary
  );

  getInvoiceSuitableAdvertisements(
    request: Protos_api_pb.GetInvoiceSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetInvoiceSuitableAdvertisementResponse>;

  getInvoiceSuitableAdvertisements(
    request: Protos_api_pb.GetInvoiceSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoiceSuitableAdvertisementResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetInvoiceSuitableAdvertisementResponse>;

  getInvoiceSuitableAdvertisements(
    request: Protos_api_pb.GetInvoiceSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetInvoiceSuitableAdvertisementResponse) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.PayInvoiceByDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceByDeal(
    request: Protos_api_pb.PayInvoiceByDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  payInvoiceByDeal(
    request: Protos_api_pb.PayInvoiceByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  payInvoiceByDeal(
    request: Protos_api_pb.PayInvoiceByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.CancelInvoicePaymentRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  cancelInvoicePayment(
    request: Protos_api_pb.CancelInvoicePaymentRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  cancelInvoicePayment(
    request: Protos_api_pb.CancelInvoicePaymentRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  cancelInvoicePayment(
    request: Protos_api_pb.CancelInvoicePaymentRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.Conversation,
    (request: Protos_api_pb.SendInvoiceMessageRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Conversation.deserializeBinary
  );

  sendInvoiceMessage(
    request: Protos_api_pb.SendInvoiceMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Conversation>;

  sendInvoiceMessage(
    request: Protos_api_pb.SendInvoiceMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Conversation) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Conversation>;

  sendInvoiceMessage(
    request: Protos_api_pb.SendInvoiceMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Conversation) => void) {
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
    Protos_api_pb.Conversation,
    (request: Protos_api_pb.SendInvoicePaymentMessageRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Conversation.deserializeBinary
  );

  sendInvoicePaymentMessage(
    request: Protos_api_pb.SendInvoicePaymentMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Conversation>;

  sendInvoicePaymentMessage(
    request: Protos_api_pb.SendInvoicePaymentMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Conversation) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Conversation>;

  sendInvoicePaymentMessage(
    request: Protos_api_pb.SendInvoicePaymentMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Conversation) => void) {
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
    Protos_api_pb.GetConversationsResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetConversationsResponse.deserializeBinary
  );

  getConversations(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetConversationsResponse>;

  getConversations(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetConversationsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetConversationsResponse>;

  getConversations(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetConversationsResponse) => void) {
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
    Protos_api_pb.GetConversationsResponse,
    (request: Protos_api_pb.GetConversationsByIdRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetConversationsResponse.deserializeBinary
  );

  getConversationsById(
    request: Protos_api_pb.GetConversationsByIdRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetConversationsResponse>;

  getConversationsById(
    request: Protos_api_pb.GetConversationsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetConversationsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetConversationsResponse>;

  getConversationsById(
    request: Protos_api_pb.GetConversationsByIdRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetConversationsResponse) => void) {
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
    (request: Protos_api_pb.DeleteConversationRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteConversation(
    request: Protos_api_pb.DeleteConversationRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteConversation(
    request: Protos_api_pb.DeleteConversationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteConversation(
    request: Protos_api_pb.DeleteConversationRequest,
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
    Protos_api_pb.CreateRefundResponse,
    (request: Protos_api_pb.CreateRefundRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.CreateRefundResponse.deserializeBinary
  );

  createRefund(
    request: Protos_api_pb.CreateRefundRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.CreateRefundResponse>;

  createRefund(
    request: Protos_api_pb.CreateRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.CreateRefundResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.CreateRefundResponse>;

  createRefund(
    request: Protos_api_pb.CreateRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.CreateRefundResponse) => void) {
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
    Protos_api_pb.Invoice,
    (request: Protos_api_pb.BuyAutoPriceRecalcsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Invoice.deserializeBinary
  );

  buyAutoPriceRecalcs(
    request: Protos_api_pb.BuyAutoPriceRecalcsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Invoice>;

  buyAutoPriceRecalcs(
    request: Protos_api_pb.BuyAutoPriceRecalcsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Invoice) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Invoice>;

  buyAutoPriceRecalcs(
    request: Protos_api_pb.BuyAutoPriceRecalcsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Invoice) => void) {
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
    Protos_api_pb.MyProfileResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.MyProfileResponse.deserializeBinary
  );

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.MyProfileResponse>;

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.MyProfileResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.MyProfileResponse>;

  getMyProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.MyProfileResponse) => void) {
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
    Protos_api_pb.CreatePromiseResponse,
    (request: Protos_api_pb.CreatePromiseRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.CreatePromiseResponse.deserializeBinary
  );

  createPromise(
    request: Protos_api_pb.CreatePromiseRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.CreatePromiseResponse>;

  createPromise(
    request: Protos_api_pb.CreatePromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.CreatePromiseResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.CreatePromiseResponse>;

  createPromise(
    request: Protos_api_pb.CreatePromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.CreatePromiseResponse) => void) {
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
    Protos_api_pb.Balance,
    (request: Protos_api_pb.PromiseToBalanceRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Balance.deserializeBinary
  );

  promiseToBalance(
    request: Protos_api_pb.PromiseToBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Balance>;

  promiseToBalance(
    request: Protos_api_pb.PromiseToBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Balance) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Balance>;

  promiseToBalance(
    request: Protos_api_pb.PromiseToBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Balance) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.PromiseSellByBestDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  promiseSellByBestDeal(
    request: Protos_api_pb.PromiseSellByBestDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  promiseSellByBestDeal(
    request: Protos_api_pb.PromiseSellByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  promiseSellByBestDeal(
    request: Protos_api_pb.PromiseSellByBestDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_api_pb.GetPromiseSuitableAdvertisementsResponse,
    (request: Protos_api_pb.GetPromiseSuitableAdvertisementsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.GetPromiseSuitableAdvertisementsResponse.deserializeBinary
  );

  getPromiseSuitableAdvertisements(
    request: Protos_api_pb.GetPromiseSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.GetPromiseSuitableAdvertisementsResponse>;

  getPromiseSuitableAdvertisements(
    request: Protos_api_pb.GetPromiseSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.GetPromiseSuitableAdvertisementsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.GetPromiseSuitableAdvertisementsResponse>;

  getPromiseSuitableAdvertisements(
    request: Protos_api_pb.GetPromiseSuitableAdvertisementsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.GetPromiseSuitableAdvertisementsResponse) => void) {
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
    Protos_api_pb.Deal,
    (request: Protos_api_pb.PromiseSellByDealRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Deal.deserializeBinary
  );

  promiseSellByDeal(
    request: Protos_api_pb.PromiseSellByDealRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Deal>;

  promiseSellByDeal(
    request: Protos_api_pb.PromiseSellByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Deal>;

  promiseSellByDeal(
    request: Protos_api_pb.PromiseSellByDealRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Deal) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.PayInvoiceByPromiseRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceByPromise(
    request: Protos_api_pb.PayInvoiceByPromiseRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  payInvoiceByPromise(
    request: Protos_api_pb.PayInvoiceByPromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  payInvoiceByPromise(
    request: Protos_api_pb.PayInvoiceByPromiseRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.InvoiceSecretsList,
    (request: Protos_api_pb.GetInvoiceSecretsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoiceSecretsList.deserializeBinary
  );

  getInvoiceSecrets(
    request: Protos_api_pb.GetInvoiceSecretsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoiceSecretsList>;

  getInvoiceSecrets(
    request: Protos_api_pb.GetInvoiceSecretsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoiceSecretsList>;

  getInvoiceSecrets(
    request: Protos_api_pb.GetInvoiceSecretsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void) {
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
    Protos_api_pb.InvoiceSecretsList,
    (request: Protos_api_pb.ChangeInvoiceSecretRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoiceSecretsList.deserializeBinary
  );

  changeInvoiceSecret(
    request: Protos_api_pb.ChangeInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoiceSecretsList>;

  changeInvoiceSecret(
    request: Protos_api_pb.ChangeInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoiceSecretsList>;

  changeInvoiceSecret(
    request: Protos_api_pb.ChangeInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void) {
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
    Protos_api_pb.InvoiceSecretsList,
    (request: Protos_api_pb.CreateInvoiceSecretRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoiceSecretsList.deserializeBinary
  );

  createInvoiceSecret(
    request: Protos_api_pb.CreateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoiceSecretsList>;

  createInvoiceSecret(
    request: Protos_api_pb.CreateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoiceSecretsList>;

  createInvoiceSecret(
    request: Protos_api_pb.CreateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void) {
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
    Protos_api_pb.InvoiceSecretsList,
    (request: Protos_api_pb.UpdateInvoiceSecretRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoiceSecretsList.deserializeBinary
  );

  updateInvoiceSecret(
    request: Protos_api_pb.UpdateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoiceSecretsList>;

  updateInvoiceSecret(
    request: Protos_api_pb.UpdateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoiceSecretsList>;

  updateInvoiceSecret(
    request: Protos_api_pb.UpdateInvoiceSecretRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoiceSecretsList) => void) {
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
    Protos_api_pb.InvoicePayment,
    (request: Protos_api_pb.PayInvoiceFromLNRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.InvoicePayment.deserializeBinary
  );

  payInvoiceFromLN(
    request: Protos_api_pb.PayInvoiceFromLNRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.InvoicePayment>;

  payInvoiceFromLN(
    request: Protos_api_pb.PayInvoiceFromLNRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void): grpcWeb.ClientReadableStream<Protos_api_pb.InvoicePayment>;

  payInvoiceFromLN(
    request: Protos_api_pb.PayInvoiceFromLNRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.InvoicePayment) => void) {
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
    Protos_api_pb.LNDepositResponse,
    (request: Protos_api_pb.LNDepositRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.LNDepositResponse.deserializeBinary
  );

  lNDeposit(
    request: Protos_api_pb.LNDepositRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.LNDepositResponse>;

  lNDeposit(
    request: Protos_api_pb.LNDepositRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.LNDepositResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.LNDepositResponse>;

  lNDeposit(
    request: Protos_api_pb.LNDepositRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.LNDepositResponse) => void) {
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
    Protos_api_pb.Balance,
    (request: Protos_api_pb.LNWithdrawalRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Balance.deserializeBinary
  );

  lNWithdrawal(
    request: Protos_api_pb.LNWithdrawalRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Balance>;

  lNWithdrawal(
    request: Protos_api_pb.LNWithdrawalRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Balance) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Balance>;

  lNWithdrawal(
    request: Protos_api_pb.LNWithdrawalRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Balance) => void) {
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
    Protos_api_pb.LNGetInvoicesResponse,
    (request: Protos_api_pb.LNGetInvoicesRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.LNGetInvoicesResponse.deserializeBinary
  );

  lNGetInvoices(
    request: Protos_api_pb.LNGetInvoicesRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.LNGetInvoicesResponse>;

  lNGetInvoices(
    request: Protos_api_pb.LNGetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.LNGetInvoicesResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.LNGetInvoicesResponse>;

  lNGetInvoices(
    request: Protos_api_pb.LNGetInvoicesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.LNGetInvoicesResponse) => void) {
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
    Protos_api_pb.LNGetPaymentsResponse,
    (request: Protos_api_pb.LNGetPaymentsRequest) => {
      return request.serializeBinary();
    },
    Protos_api_pb.LNGetPaymentsResponse.deserializeBinary
  );

  lNGetPayments(
    request: Protos_api_pb.LNGetPaymentsRequest,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.LNGetPaymentsResponse>;

  lNGetPayments(
    request: Protos_api_pb.LNGetPaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.LNGetPaymentsResponse) => void): grpcWeb.ClientReadableStream<Protos_api_pb.LNGetPaymentsResponse>;

  lNGetPayments(
    request: Protos_api_pb.LNGetPaymentsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.LNGetPaymentsResponse) => void) {
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
    (request: Protos_api_pb.UpdateMyProfileRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  updateMyProfile(
    request: Protos_api_pb.UpdateMyProfileRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  updateMyProfile(
    request: Protos_api_pb.UpdateMyProfileRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  updateMyProfile(
    request: Protos_api_pb.UpdateMyProfileRequest,
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
    Protos_api_pb.Balance,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    Protos_api_pb.Balance.deserializeBinary
  );

  getBalances(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<Protos_api_pb.Balance>;

  getBalances(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: Protos_api_pb.Balance) => void): grpcWeb.ClientReadableStream<Protos_api_pb.Balance>;

  getBalances(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: Protos_api_pb.Balance) => void) {
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

