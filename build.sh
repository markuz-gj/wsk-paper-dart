#! /usr/bin/env sh
export PATH=node_modules/.bin:$PATH

while :;do

  gulp $@
  echo "gulp task exited ($?), sleeping 3s ... \c"
  sleep 3
  echo

done
