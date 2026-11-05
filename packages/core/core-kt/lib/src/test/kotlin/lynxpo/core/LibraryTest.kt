package lynxpo.core

import lynxpo.core.modules.CodedException
import lynxpo.core.modules.clipboard.CopyFailureException
import lynxpo.core.modules.clipboard.InvalidImageException
import lynxpo.core.modules.clipboard.NoPermissionException
import lynxpo.core.modules.clipboard.PasteFailureException
import lynxpo.core.modules.network.NetworkAccessException
import lynxpo.core.modules.network.NetworkWifiException
import lynxpo.core.modules.network.frontPadWithZeros
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Test

private class DefaultCodedException(message: String) : CodedException(message)

private class CustomCodedException(message: String) : CodedException(message) {
    override val code: String = "ERR_TEST"
}

private class CauseCodedException(cause: Throwable?) : CodedException(cause)

private class CauseMessageCodedException(message: String, cause: Throwable?) :
    CodedException(message, cause)

class CodedExceptionTest {
    @Test
    fun defaultCodeIsUnspecified() {
        assertEquals(
            "ERR_UNSPECIFIED_ANDROID_EXCEPTION",
            DefaultCodedException("boom").code,
        )
    }

    @Test
    fun subclassesCanOverrideCode() {
        assertEquals("ERR_TEST", CustomCodedException("boom").code)
    }

    @Test
    fun preservesMessageAndCause() {
        val cause = IllegalStateException("root")
        val error = DefaultCodedException("wrapped")
        assertEquals("wrapped", error.message)
        assertNull(error.cause)
        val wrapped = CauseMessageCodedException("wrapped", cause)
        assertEquals("wrapped", wrapped.message)
        assertSame(cause, wrapped.cause)
    }

    @Test
    fun acceptsCauseOnlyConstructor() {
        val cause = IllegalStateException("root")
        val error = CauseCodedException(cause)
        assertSame(cause, error.cause)
        assertEquals(cause.toString(), error.message)
    }
}

class NetworkUtilsTest {
    @Test
    fun frontPadsShortArrayWithZeros() {
        assertArrayEquals(
            byteArrayOf(0, 0, 1, 2),
            frontPadWithZeros(byteArrayOf(1, 2)),
        )
    }

    @Test
    fun frontPadsSingleByte() {
        assertArrayEquals(
            byteArrayOf(0, 0, 0, 7),
            frontPadWithZeros(byteArrayOf(7)),
        )
    }

    @Test
    fun frontPadsFullArrayWithoutChangingIt() {
        assertArrayEquals(
            byteArrayOf(1, 2, 3, 4),
            frontPadWithZeros(byteArrayOf(1, 2, 3, 4)),
        )
    }
}

class ClipboardExceptionTest {
    @Test
    fun pasteFailureUsesKindInMessage() {
        val error = PasteFailureException(null, "image")
        assertEquals("Failed to get image from clipboard", error.message)
    }

    @Test
    fun copyFailureDefaultsToItemKind() {
        assertEquals(
            "Failed to save item into clipboard",
            CopyFailureException(null).message,
        )
    }

    @Test
    fun noPermissionKeepsSecurityCause() {
        val cause = SecurityException("denied")
        assertSame(cause, NoPermissionException(cause).cause)
    }

    @Test
    fun invalidImageTruncatesLongPayloads() {
        val image = "a".repeat(40)
        assertEquals(
            "Invalid base64 image: ${"a".repeat(32)}...",
            InvalidImageException(image, null).message,
        )
    }

    @Test
    fun invalidImageKeepsShortPayloads() {
        assertEquals(
            "Invalid base64 image: abc",
            InvalidImageException("abc", null).message,
        )
    }
}

class NetworkExceptionTest {
    @Test
    fun accessExceptionCarriesMessage() {
        val error = NetworkAccessException(IllegalStateException("root"))
        assertEquals("Unable to access network information", error.message)
        assertEquals("ERR_UNSPECIFIED_ANDROID_EXCEPTION", error.code)
    }

    @Test
    fun wifiExceptionCarriesMessage() {
        val error = NetworkWifiException(IllegalStateException("root"))
        assertEquals("Wi-Fi information could not be acquired", error.message)
        assertEquals("ERR_UNSPECIFIED_ANDROID_EXCEPTION", error.code)
    }
}
