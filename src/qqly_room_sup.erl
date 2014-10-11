
-module(qqly_room_sup).
-behaviour(supervisor).

-export([start_link/0]).
-export([init/1]).
-export([create_room/1]).


init([]) ->
  MaxRestart = 1,
  MaxTime = 1,
  RestartStrategy = {simple_one_for_one, MaxRestart, MaxTime},
  UserSpec = {qqly_room, {qqly_room, start_link, []}, temporary, 2000, worker, [qqly_room]},
  StartSpecs = {RestartStrategy, [UserSpec]},
  {ok, StartSpecs}.


start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).


create_room(RoomId) ->
    io:format("Creating room `~p`", [RoomId]),
    supervisor:start_child(?MODULE, [RoomId]).