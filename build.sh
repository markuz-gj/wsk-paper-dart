#! /usr/bin/env sh
export PATH=node_modules/.bin:$PATH

while :;do

  gulp $@
  echo "gulp task exited ($?), sleeping 1s ... \c"
  sleep 1
  echo

done
