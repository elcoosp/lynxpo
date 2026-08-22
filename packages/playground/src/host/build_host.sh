#!/bin/bash
cd "/Users/adm/Documents/Repos/lynxpo/packages/playground/src/host"
export JAVA_HOME=~/jdk11/Contents/Home

# Refresh the host's bundled showcase template from the latest playground
# build so the standalone host always boots into hostshowcase. The iOS build
# below copies LynxpoHost/host.lynx.bundle into the app resource.
PG="/Users/adm/Documents/Repos/lynxpo/packages/playground"
if [ -f "$PG/dist/hostshowcase.lynx.bundle" ]; then
  cp "$PG/dist/hostshowcase.lynx.bundle" "$PG/src/host/LynxpoHost/host.lynx.bundle"
  echo "refreshed host.lynx.bundle from dist/hostshowcase.lynx.bundle"
fi

xcodebuild -workspace LynxpoHost.xcworkspace \
  -scheme LynxpoHost \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination "id=27088715-6C8B-436A-AC66-B2DA978A2944" \
  -derivedDataPath ./build_final_host \
  build ARCHS=arm64 ONLY_ACTIVE_ARCH=YES 2>&1 | tee /tmp/build_host18.log
echo "BUILD_EXIT=${PIPESTATUS[0]}" >> /tmp/build_host18.log
