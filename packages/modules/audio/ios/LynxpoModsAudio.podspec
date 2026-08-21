Pod::Spec.new do |s|
  s.name         = 'LynxpoModsAudio'
  s.version      = '0.0.0'
  s.summary      = 'lynxpo Audio native module'
  s.homepage     = 'https://github.com/elcoosp/lynxpo'
  s.license      = 'Apache-2.0'
  s.author       = 'lynxpo'
  s.platforms    = { :ios => '12.0' }
  s.source       = { :path => '.' }
  s.static_framework = true
  s.source_files = 'src/**/*{.h,.m,.mm,.swift}'
  s.dependency 'Lynx/Framework'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
