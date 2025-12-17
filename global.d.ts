// Global type declarations for asset modules

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: number;
  export default value;
}

declare module '*.jpg' {
  const value: number;
  export default value;
}

declare module '*.jpeg' {
  const value: number;
  export default value;
}

declare module '*.gif' {
  const value: number;
  export default value;
}

declare module '*.webp' {
  const value: number;
  export default value;
}

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.webm' {
  const value: any;
  export default value;
}

// Lottie animation module
declare module 'lottie-react-native' {
  import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
  interface LottieViewProps {
    source: any;
    autoPlay?: boolean;
    loop?: boolean;
    style?: ViewStyle;
    speed?: number;
    progress?: number;
    onAnimationFinish?: () => void;
  }
  
  export default class LottieView extends Component<LottieViewProps> {
    play(): void;
    pause(): void;
    reset(): void;
  }
}
