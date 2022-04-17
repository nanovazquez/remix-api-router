cd examples/remix-api-example

if [ ! -d 'node_modules' ] 
then 
  echo 'Install node_modules of Remix example..'
  npm ci
  echo ''
fi

if [ ! -d 'build' ] 
then 
  echo 'Build Remix example..'
  npm run build 
  echo ''
fi
