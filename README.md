# repository-250


## Installation

```
brew install erlang rebar
```


## Running locally

```
make run
```


## Deploying to heroku

```
heroku apps:create qqly
heroku config:add BUILDPACK_URL="https://github.com/surjikal/heroku-buildpack-erlang.git" -a qqly
git push heroku master
```
