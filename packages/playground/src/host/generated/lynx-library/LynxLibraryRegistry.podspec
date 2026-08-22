Pod::Spec.new do |s|
  s.name = 'LynxLibraryRegistry'
  s.version = '0.1.0'
  s.summary = 'Generated Lynx library registry.'
  s.homepage = 'https://github.com/lynx-family/lynx'
  s.license = 'Apache-2.0'
  s.author = 'Lynx'
  s.source = { :path => '.' }
  s.source_files = 'LynxGeneratedLibraryRegistry.{h,m}', 'LynxGeneratedNodeAPIAddonUse.mm'
  s.dependency 'Lynx'



  s.requires_arc = true
end
