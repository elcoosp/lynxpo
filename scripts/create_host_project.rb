#!/usr/bin/env ruby
# Create a fresh, minimal LynxpoHost.xcodeproj (standalone host app) via xcodeproj.
# Run with CocoaPods' ruby + gem load path.
require 'xcodeproj'

HOST_DIR = '/Users/adm/Documents/Repos/lynxpo/packages/playground/src/lynx/host'
PROJ_PATH = File.join(HOST_DIR, 'LynxpoHost.xcodeproj')

project = Xcodeproj::Project.new(PROJ_PATH)

# Main group
main_group = project.main_group

# Source file references
main_ref = project.new_file(File.join(HOST_DIR, 'LynxpoHost/main.m'))
appdel_ref = project.new_file(File.join(HOST_DIR, 'LynxpoHost/HostAppDelegate.m'))
vc_ref = project.new_file(File.join(HOST_DIR, 'LynxpoHost/HostViewController.m'))
info_ref = project.new_file(File.join(HOST_DIR, 'LynxpoHost/Info.plist'))
assets_ref = project.new_file(File.join(HOST_DIR, 'LynxpoHost/Assets.xcassets'))
bundle_ref = project.new_file(File.join(HOST_DIR, 'LynxpoHost/host.lynx.bundle'))

# App target
target = project.new_target(:application, 'LynxpoHost', :ios, '12.0')
target.product_name = 'LynxpoHost'

# Sources
target.source_build_phase.add_file_reference(main_ref)
target.source_build_phase.add_file_reference(appdel_ref)
target.source_build_phase.add_file_reference(vc_ref)

# Resources
target.resources_build_phase.add_file_reference(assets_ref)
target.resources_build_phase.add_file_reference(bundle_ref)

# Per-config settings
target.build_configurations.each do |bc|
  bc.build_settings['INFOPLIST_FILE'] = 'LynxpoHost/Info.plist'
  bc.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'org.lynxpo.host'
  bc.build_settings['PRODUCT_NAME'] = '$(TARGET_NAME)'
  bc.build_settings['CODE_SIGN_STYLE'] = 'Manual'
  bc.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
  bc.build_settings['DEVELOPMENT_TEAM'] = ''
  bc.build_settings['SDKROOT'] = 'iphoneos'
  bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
  bc.build_settings['TARGETED_DEVICE_FAMILY'] = '1,2'
  bc.build_settings['ENABLE_BITCODE'] = 'NO'
  bc.build_settings['ONLY_ACTIVE_ARCH'] = 'YES'
  bc.build_settings['VALID_ARCHS'] = 'arm64'
  bc.build_settings['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks']
  bc.build_settings['LIBRARY_SEARCH_PATHS'] = ['$(inherited)', '$(SDKROOT)/usr/lib/swift']
  bc.build_settings['FRONTEND_LANGUAGE'] = ''
end

# Frameworks build phase already exists for new_target; ensure Pods framework linkable later.
project.save

puts "Created #{PROJ_PATH}"
puts "Targets: #{project.targets.map(&:name).join(', ')}"
