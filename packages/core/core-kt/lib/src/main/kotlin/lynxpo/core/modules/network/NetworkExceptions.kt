package lynxpo.core.modules.network

import CodedException

internal class NetworkAccessException(e: Throwable) :
        CodedException("Unable to access network information", e.cause)

internal class NetworkWifiException(e: Throwable) :
        CodedException("Wi-Fi information could not be acquired", e.cause)
