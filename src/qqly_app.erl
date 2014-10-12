
-module(qqly_app).
-behaviour(application).

-export([start/2, stop/1]).


start(_StartType, _StartArgs) ->
    io:format("callback called~n"),
    {ok, _} = qqly_controller:start_link(),
    % Port = get_port(),
    start_api(qqly_api, []).


stop(_State) ->
    ok.


% get_port() ->
%     case os:getenv("PORT") of
%         false ->
%             {ok, Port} = application:get_env(http_port),
%             Port;
%         Other ->
%             list_to_integer(Other)
%     end.


start_api(Module, Port) ->
    ok = start_application(crypto),
    ok = start_application(ranch),
    ok = start_application(cowlib),
    ok = start_application(cowboy),
    ok = start_application(leptus),
    HttpHandlers = [{Module, []}],
    leptus:start_listener(http, [{'_', HttpHandlers}]).


start_application(App) ->
    case application:start(App) of
        ok ->
            ok;
        {error, {already_started, App}} ->
            ok
    end.