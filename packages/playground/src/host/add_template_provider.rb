# Add HostTemplateProvider.m/.h to the LynxpoHost target's build sources.
require 'pathname'

LIBEXEC = `/opt/homebrew/bin/brew --prefix cocoapods 2>/dev/null`.strip + '/libexec/gems'
ruby = '/opt/homebrew/opt/ruby/bin/ruby'
loadpath = Dir.glob(File.join(LIBEXEC, '*', 'lib')).join(':')
$LOAD_PATH.unshift(loadpath)
require 'xcodeproj'

proj_path = File.join(__dir__, 'LynxpoHost.xcodeproj')
project = Xcodeproj::Project.open(proj_path)

target = project.targets.find { |t| t.name == 'LynxpoHost' }
raise "LynxpoHost target not found" unless target

src_dir = File.join(__dir__, 'LynxpoHost')
files = ['HostTemplateProvider.m', 'HostTemplateProvider.h']
files.each do |fname|
  path = File.join(src_dir, fname)
  next unless File.exist?(path)
  # Skip if already referenced
  existing = project.files.find { |fi| fi.path == "LynxpoHost/#{fname}" }
  next if existing
  file_ref = project.new_file(path)
  if fname.end_with?('.m')
    target.source_build_phase.add_file_reference(file_ref)
    puts "added source: #{fname}"
  else
    # header: add to headers build phase (optional)
    target.headers_build_phase.add_file_reference(file_ref) rescue nil
    puts "added header: #{fname}"
  end
end

project.save
puts "saved #{proj_path}"
