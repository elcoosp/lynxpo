type LynxpoNativeElementProps = {
  children?: unknown;
  className?: string;
  key?: string | number;
  [attribute: string]: unknown;
};

declare module '@lynx-js/react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'linear-gradient': LynxpoNativeElementProps;
      'lynxpo-blur': LynxpoNativeElementProps;
      'lynxpo-camera': LynxpoNativeElementProps;
      'lynxpo-checkbox': LynxpoNativeElementProps;
      'lynxpo-dom': LynxpoNativeElementProps;
      'lynxpo-gl': LynxpoNativeElementProps;
      'lynxpo-glass-effect': LynxpoNativeElementProps;
      'lynxpo-image': LynxpoNativeElementProps;
      'lynxpo-mesh-gradient': LynxpoNativeElementProps;
      'lynxpo-symbols': LynxpoNativeElementProps;
      'lynxpo-ui-button': LynxpoNativeElementProps;
      'lynxpo-video': LynxpoNativeElementProps;
      'lynxpo-widget-card': LynxpoNativeElementProps;
    }
  }
}

export {};
