
-module(qqly_api).
-compile({parse_transform, leptus_pt}).

-export([init/3]).
-export([terminate/4]).
-export([cross_domains/3]).

-export([get/3]).
-export([post/3]).

-include_lib("stdlib/include/qlc.hrl").


% get("/", _Req, State) ->
%    {200, {json, Json}, State};



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



% %% Retrieve
% get("/todo/:id", Req, State) ->
%    %% Get ID from query string
%    Id = leptus_req:param(Req, id),

%    %% Fetch record from database
%    Query = fun() ->
%       mnesia:read(todo, Id)
%    end,
%    {atomic, Record} = mnesia:transaction(Query),

%    %% Format record to JSON
%    Json = supbro_helper:format(Record),

%    %% Return JSON formated data
%    %% with success (200) HTTP status code
%    {200, {json, Json}, State}.


% %% Create
% post("/todo", Req, State) ->
%    %% Get POST body query string
%    Post = leptus_req:body_qs(Req),

%    %% Create record ID based on timestamp
%    {MegaS, S, MicroS} = erlang:now(),
%    Id = list_to_binary(
%       integer_to_list(MegaS) ++
%       integer_to_list(S) ++
%       integer_to_list(MicroS)
%    ),

%    %% Get desired fields from POST
%    {<<"content">>, Content} = lists:keyfind(<<"content">>, 1, Post),
%    {<<"priority">>, Priority} = lists:keyfind(<<"priority">>, 1, Post),
%    {<<"status">>, Status} = lists:keyfind(<<"status">>, 1, Post),

%    %% Write new record in database
%    Write = fun() ->
%       Todo = #todo{
%          id = Id,
%          content = Content,
%          priority = Priority,
%          status = Status
%       },
%       mnesia:write(Todo)
%    end,
%    mnesia:transaction(Write),

%    %% Return success
%    {200, {json, Post}, State}.


% %% Update
% put("/todo/:id", Req, State) ->
%    Id = leptus_req:param(Req, id),
%    Post = leptus_req:body_qs(Req),
%    {<<"content">>, Content} = lists:keyfind(<<"content">>, 1, Post),
%    {<<"priority">>, Priority} = lists:keyfind(<<"priority">>, 1, Post),
%    {<<"status">>, Status} = lists:keyfind(<<"status">>, 1, Post),
%    Write = fun() ->
%       Todo = #todo{
%          id = Id,
%          content = Content,
%          priority = Priority,
%          status = Status
%       },
%       mnesia:write(Todo)
%    end,
%    mnesia:transaction(Write),
%    {200, {json, Post}, State}.


% %% Delete
% delete("/todo/:id", Req, State) ->
%    Id = leptus_req:param(Req, id),
%    Delete = fun() ->
%       mnesia:delete({todo, Id})
%    end,
%    mnesia:transaction(Delete),
%    {200, {json, [{<<"status">>, <<"deleted">>}]}, State}.



cross_domains(_Route, _Req, State) ->
   {['_'], State}.


init(_Route, _Req, State) ->
    {ok, State}.


terminate(_Reason, _Route, _Req, _State) ->
    ok.
