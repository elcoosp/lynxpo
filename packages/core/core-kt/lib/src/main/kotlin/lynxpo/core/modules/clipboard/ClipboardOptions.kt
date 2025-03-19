package lynxpo.core.modules.clipboard

import android.graphics.Bitmap
import com.lynx.react.bridge.ReadableMap
import kotlinx.serialization.Serializable


@Serializable
abstract class GetImageOptions : ReadableMap {
    var imageFormat: ImageFormat = ImageFormat.JPG
    var jpegQuality: Double = 1.0

}

@Serializable
abstract class GetStringOptions : ReadableMap {
    var preferredFormat: StringFormat = StringFormat.PLAIN
}

@Serializable
abstract class SetStringOptions : ReadableMap {
    var inputFormat: StringFormat = StringFormat.PLAIN
}

@Serializable
enum class ImageFormat(val jsName: String) {
    JPG("jpeg"),
    PNG("png");

    val compressFormat: Bitmap.CompressFormat
        get() = when (this) {
            JPG -> Bitmap.CompressFormat.JPEG
            PNG -> Bitmap.CompressFormat.PNG
        }

    val mimeType: String
        get() = when (this) {
            JPG -> "image/jpeg"
            PNG -> "image/png"
        }
}


@Serializable
enum class StringFormat(val jsValue: String) {
    PLAIN("plainText"),
    HTML("html")
}
