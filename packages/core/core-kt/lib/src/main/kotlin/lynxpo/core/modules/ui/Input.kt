package lynxpo.core.modules.ui.input

import android.content.Context
import android.graphics.Color
import android.text.Editable
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import androidx.appcompat.widget.AppCompatEditText
import com.lynx.react.bridge.Callback
import com.lynx.react.bridge.ReadableMap
import com.lynx.tasm.behavior.LynxContext
import com.lynx.tasm.behavior.LynxProp
import com.lynx.tasm.behavior.LynxUIMethod
import com.lynx.tasm.behavior.LynxUIMethodConstants
import com.lynx.tasm.behavior.ui.LynxUI
import com.lynx.tasm.event.LynxCustomEvent
import lynxpo.core.LynxpoUI

class InputUI(context: LynxContext) : LynxpoUI<AppCompatEditText>(context) {
    override fun createView(context: Context): AppCompatEditText {
        val view = AppCompatEditText(context)
        // Removed invalid 'lines' property

        view.isFocusable = true
        view.isFocusableInTouchMode = true
        view.isEnabled = true
        view.isSingleLine = true
        view.gravity = Gravity.CENTER_VERTICAL
        view.background = null
        view.imeOptions = EditorInfo.IME_ACTION_NONE
        view.setHorizontallyScrolling(true) // Updated method call
        view.setPadding(0, 0, 0, 0)
        view.textSize = 14f
        view.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

            override fun afterTextChanged(s: Editable) {
                // Explicitly specify map types
                val payload = mapOf("value" to s.toString())
                emitEvent("input", payload)
            }
        })
        view.onFocusChangeListener = View.OnFocusChangeListener { _, hasFocus ->
            if (!hasFocus) {
                emitEvent("blur")
            }
        }
        return view
    }

    override fun onLayoutUpdated() {
        super.onLayoutUpdated()
        val paddingTop = mPaddingTop + mBorderTopWidth
        val paddingBottom = mPaddingBottom + mBorderBottomWidth
        val paddingLeft = mPaddingLeft + mBorderLeftWidth
        val paddingRight = mPaddingRight + mBorderRightWidth
        mView.setPadding(paddingLeft, paddingTop, paddingRight, paddingBottom)
    }

    @LynxProp(name = "value")
    fun setValue(value: String) {
        if (value != mView.text.toString()) {
            mView.setText(value)
        }
    }

    @LynxUIMethod
    fun focus(params: ReadableMap, callback: Callback) {
        if (mView.requestFocus()) {
            if (showSoftInput()) {
                callback.invoke(LynxUIMethodConstants.SUCCESS)
            } else {
                callback.invoke(LynxUIMethodConstants.UNKNOWN, "fail to show keyboard")
            }
        } else {
            callback.invoke(LynxUIMethodConstants.UNKNOWN, "fail to focus")
        }
    }

    private fun showSoftInput(): Boolean {
        val imm =
            lynxContext.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        return imm.showSoftInput(mView, InputMethodManager.SHOW_IMPLICIT, null)
    }

    @LynxProp(name = "placeholder")
    fun setPlaceHolder(value: String) {
        mView.hint = value
    }

    @LynxProp(name = "text-color")
    fun setTextColor(value: String) {
        val textColor = "#$value"
        val hintColor = "#40$value"
        mView.setHintTextColor(Color.parseColor(hintColor))
        mView.setTextColor(Color.parseColor(textColor))
    }

}