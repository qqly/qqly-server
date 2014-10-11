
-module(qqly_old).


-export([
    start/0
]).


start() ->
    {ok, _} = qqly_controller:start_link(),
    start_api(qqly_api, []).


start_api(Module, Options) ->
    ok = start_application(crypto),
    ok = start_application(ranch),
    ok = start_application(cowlib),
    ok = start_application(cowboy),
    ok = start_application(leptus),
    HttpHandlers = [{Module, []}],
    leptus:start_listener(http, [{'_', HttpHandlers}], Options).


start_application(App) ->
    case application:start(App) of
        ok ->
            ok;
        {error, {already_started, App}} ->
            ok
    end.