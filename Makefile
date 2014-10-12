.PHONY: all deps compile run

all: deps compile

deps:
	rebar get-deps

compile:
	rebar compile

shell: all
	erl -pa ebin deps/*/ebin

run: all
	erl -pa ebin deps/*/ebin -noshell -s qqly_old start
