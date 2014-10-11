%% file src/todo_helper.erl
%% ------------------------
-module(qqly_helper).
-export([format/1]).

format(List) -> format(List, []).
format([], Results) -> Results;
format([H|T], Results) -> format(T, [json(H)|Results]).



json({_, Key, Content, Priority, Status}) ->
   {Key, [Content, Priority, Status]}.
