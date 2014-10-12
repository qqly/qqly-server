
-module(qqly_api).
-compile({parse_transform, leptus_pt}).

-export([init/3]).
-export([terminate/4]).
-export([cross_domains/3]).

-export([get/3]).
-export([post/3]).

-include_lib("stdlib/include/qlc.hrl").


% get room
get("/api/rooms/:roomId", Req, State) ->
   RoomId = leptus_req:param(Req, roomId),
   {ok, Room} = qqly_controller:get_room(RoomId),
   {200, {json, dict:to_list(Room)}, State}.


% update user
post("/api/rooms/:roomId/users/:userId", Req, State) ->
  RoomId   = leptus_req:param(Req, roomId),
  UserId   = leptus_req:param(Req, userId),
  PostData = leptus_req:body_qs(Req),

  {<<"longitude">>, Longitude} = lists:keyfind(<<"longitude">>, 1, PostData),
  {<<"latitude">>, Latitude} = lists:keyfind(<<"latitude">>, 1, PostData),

  UserData = [Latitude, Longitude],

  qqly_controller:update_user(RoomId, UserId, UserData),
  {200, {json, PostData}, State}.


cross_domains(_Route, _Req, State) ->
   {['_'], State}.


init(_Route, _Req, State) ->
    {ok, State}.


terminate(_Reason, _Route, _Req, _State) ->
    ok.
