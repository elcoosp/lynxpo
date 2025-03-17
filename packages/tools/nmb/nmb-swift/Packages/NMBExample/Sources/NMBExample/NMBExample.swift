// The Swift Programming Language
// https://docs.swift.org/swift-book
import NMBSwiftInspect

@Typed
class Foo {
    enum Barbar: Codable {
        case foo
    }
    @LynxMethod
    func bar() {
    }
    struct MyGen<U: Codable>: Codable {
        var field: U
    }
    @LynxMethod
    func baz<U: Codable>(gen: MyGen<U>) {

    }
    enum Foodroi: Codable {
        case bar, az
    }
}
