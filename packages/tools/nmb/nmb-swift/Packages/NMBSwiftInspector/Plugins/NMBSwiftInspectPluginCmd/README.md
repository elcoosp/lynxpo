# Usage

```bash
swift package plugin --allow-writing-to-package-directory nmb-dump
```

The key was to specify `verb` otherwise can not find automatic name

```swift
  capability: .command(
                intent: .custom(
                    verb: "nmb-dump",
                    description: "Dumb inspect results of NMB"),
                permissions: [
                    .writeToPackageDirectory(reason: "This command write type infos metadata")
                ]
            )
```
