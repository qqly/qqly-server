# repository-250

## Installation

```
brew install erlang rebar
make run
```

## Deploying to heroku

```
heroku apps:create qqly
heroku config:add BUILDPACK_URL="https://github.com/archaelus/heroku-buildpack-erlang.git" -a qqly
```
