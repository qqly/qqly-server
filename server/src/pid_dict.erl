
-module(pid_dict).

-export([new/0]).
-export([find/2]).
-export([store/3]).


new() ->
    dict:new().


find(Key, State) ->
    case dict:find(Key, State) of
        {ok, Value} ->
            Pid = binary_to_term(Value),
            {ok, Pid};
        error ->
            error
    end.


store(Key, Pid, State) ->
    Value = term_to_binary(Pid),
    dict:store(Key, Value, State).
