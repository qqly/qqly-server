
-module(qqly_room).
-behaviour(gen_server).


-export([
    start_link/1,
    stop/0,
    get_state/0,
    update_user/2
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
    error_logger:info_msg("terminating~n"),
    ok.


start_link(Id) ->
    gen_server:start_link(?MODULE, [Id], []).

stop() ->
    gen_server:cast(?MODULE, stop).

get_state() ->
    gen_server:call(?MODULE, get_state).

update_user(Id, Value) ->
    gen_server:cast(?MODULE, {update_user, Id, Value}).


interval_milliseconds() -> 1000.


init([Id]) ->
    timer:send_interval(interval_milliseconds(), interval),
    io:format("Room has started ~p (~w)~n", [Id, self()]),
    InitialState = dict:new(),
    {ok, InitialState}.


handle_call(get_state, _From, State) ->
    {reply, {ok, State}, State};


handle_call(_Request, _From, State) ->
    {reply, ok, State}.


handle_cast(stop, State) ->
    {stop, normal, State};


handle_cast({update_user, Id, Value}, State) ->
    {noreply, dict:store(Id, Value, State)}.


handle_info(interval, State) ->
    % mark inactive users as dropped
    % delete disconnected users
    exit(normal),
    {noreply, State};


handle_info(Info, State) ->
    error_logger:info_msg("~p~n", [Info]),
    {noreply, State}.


code_change(_OldVsn, State, _Extra) ->
    {ok, State}.
