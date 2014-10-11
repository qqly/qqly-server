.PHONY: all deps compile run

all: deps compile

deps:
	rebar get-deps

compile:
	rebar compile

run: all
	erl -pa ebin deps/*/ebin
