# Add HostTemplateProvider.m/.h to the LynxpoHost target's build phases.
LIBEXEC = `/opt/homebrew/bin/brew --prefix cocoapods 2>/dev/null`.strip + '/libexec/gems'
loadpath = Dir.glob(File.join(LIBEXEC, '*', 'lib')).join(':')
$LOAD_PATH.unshift(loadpath)
require 'xcodeproj'

proj_path = File.expand_path(File.join(__dir__, '..', 'LynxpoHost.xcodeproj'))
project = Xcodeproj::Project.open(proj_path)
target = project.targets.find { |t| t.name == 'LynxpoHost' }
raise "LynxpoHost target not found" unless target

['HostTemplateProvider.m', 'HostTemplateProvider.h'].each do |fname|
  path = File.join(__dir__, 'LynxpoHost', fname)
  next unless File.exist?(path)
  existing = project.files.find { |fi| fi.path == "LynxpoHost/#{fname}" }
  next if existing
  file_ref = project.new_file(path)
  if fname.end_with?('.m')
    target.source_build_phase.add_file_reference(file_ref)
    puts "added source: #{fname}"
  else
    target.headers_build_phase.add_file_reference(file_ref) rescue nil
    puts "added header: #{fname}"
  end
end

project.save
puts "saved #{proj_path}"
