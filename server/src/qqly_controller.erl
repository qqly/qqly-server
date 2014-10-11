
-module(qqly_controller).
-behaviour(gen_server).
 

-export([
    start_link/0,
    stop/0,
    update_user/3,
    list_rooms/0,
    get_room/1
]).


-export([
    init/1,
    handle_call/3,
    handle_cast/2,
    handle_info/2,
    terminate/2,
    code_change/3
]).


terminate(_Reason, _State) ->
    error_logger:info_msg("terminating `qqly_controller`~n"),
    ok.


start_link() ->
    gen_server:start_link(?MODULE, [], []).

stop() ->
    gen_server:cast(?MODULE, stop).

list_rooms() ->
    gen_server:call(?MODULE, list_rooms).

update_user(RoomId, UserId, Value) ->
    gen_server:cast(?MODULE, {update_user, RoomId, UserId, Value}).

get_room(RoomId) ->
    gen_server:call(?MODULE, {get_room, RoomId}).


init([]) ->
    io:format("initializing `qqly_controller`~n"),
    qqly_supervisor:start_link(),
    {ok, dict:new()}.


handle_call(list_rooms, _From, State) ->
    {reply, {ok, dict:keys(State)}, State};


handle_call({get_room, RoomId}, _From, State) ->
    {RoomPid, NewState} = get_or_create_room(RoomId, State),
    {ok, RoomState} = gen_server:call(RoomPid, get_state),
    {reply, {ok, RoomState}, NewState};


handle_call(_Request, _From, State) ->
    {reply, ok, State}.


handle_cast(stop, State) ->
    {stop, normal, State};


handle_cast({update_user, RoomId, UserId, Value}, State) ->
    {RoomPid, NewState} = get_or_create_room(RoomId, State),
    gen_server:cast(RoomPid, {update_user, UserId, Value}),
    {noreply, NewState}.


handle_info(Info, State) ->
    error_logger:info_msg("~p~n", [Info]),
    {noreply, State}.


code_change(_OldVsn, State, _Extra) ->
    {ok, State}.


get_or_create_room(RoomId, State) ->
    case pid_dict:find(RoomId, State) of
        {ok, Pid} ->
            {Pid, State};
        error ->
            create_room(RoomId, State)
    end.



create_room(RoomId, State) ->
    {ok, Pid} = subpro_supervisor:create_room(RoomId),
    {Pid, pid_dict:store(RoomId, Pid, State)}.

