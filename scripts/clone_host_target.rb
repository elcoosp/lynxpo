#!/usr/bin/env ruby
# Clone the LynxExplorer app target into a LynxpoHost standalone host target.
# Uses the xcodeproj gem bundled with CocoaPods. Run via:
#   /opt/homebrew/opt/ruby/bin/ruby -I <gems lib path> clone_host_target.rb
require 'xcodeproj'

PROJ = '/Users/adm/Documents/Repos/lynxpo/packages/playground/src/lynx/explorer/darwin/ios/lynx_explorer/LynxExplorer.xcodeproj'
HOST_DIR = 'LynxExplorer/Host'

project = Xcodeproj::Project.open(PROJ)

src = project.targets.find { |t| t.name == 'LynxExplorer' }
raise 'LynxExplorer target not found' unless src

# --- Create the new target (clone of LynxExplorer) ---
host = project.new_target(:application, 'LynxpoHost', :ios, '12.0', src.deployment_target)
host.product_name = 'LynxpoHost'
host.build_configurations.each do |bc|
  # inherit the same build settings the Explorer uses
  src.build_settings(bc.name).each { |k, v| bc.build_settings[k] = v }
end

# --- Host source files ---
main_ref = project.new_file("#{HOST_DIR}/main.m")
appdel_ref = project.new_file("#{HOST_DIR}/HostAppDelegate.m")
vc_ref = project.new_file("#{HOST_DIR}/HostViewController.m")
info_ref = project.new_file("#{HOST_DIR}/Info.plist")
assets_ref = project.new_file("#{HOST_DIR}/Assets.xcassets")
bundle_ref = project.new_file("#{HOST_DIR}/host.lynx.bundle")

# Add sources to the host target's Sources build phase
host.source_build_phase.add_file_reference(main_ref)
host.source_build_phase.add_file_reference(appdel_ref)
host.source_build_phase.add_file_reference(vc_ref)
# Resources
host.resources_build_phase.add_file_reference(assets_ref)
host.resources_build_phase.add_file_reference(bundle_ref)

# INFOPLIST_FILE + other per-target settings
host.build_configurations.each do |bc|
  bc.build_settings['INFOPLIST_FILE'] = "#{HOST_DIR}/Info.plist"
  bc.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'org.lynxpo.host'
  bc.build_settings['CODE_SIGN_STYLE'] = 'Manual' unless bc.build_settings['CODE_SIGN_STYLE']
  bc.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
  bc.build_settings['DEVELOPMENT_TEAM'] = '' unless bc.build_settings.key?('DEVELOPMENT_TEAM')
end

project.save

puts "Cloned LynxExplorer -> LynxpoHost. Targets: #{project.targets.map(&:name).join(', ')}"
