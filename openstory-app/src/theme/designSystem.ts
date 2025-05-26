// 🎨 DESIGN SYSTEM OPENSTORY - Sistema di Design Unificato
// Colori, tipografia, animazioni e componenti standardizzati

export const theme = {
  // 🎨 PALETTE COLORI
  colors: {
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#ffd700', // Gold principale
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    background: {
      primary: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      secondary: 'rgba(26, 26, 26, 0.95)',
      tertiary: 'rgba(42, 42, 42, 0.8)',
      glass: 'rgba(255, 255, 255, 0.05)',
      glassHover: 'rgba(255, 255, 255, 0.1)',
      card: 'rgba(26, 26, 26, 0.9)',
      overlay: 'rgba(0, 0, 0, 0.7)'
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#d1d5db',
      muted: '#9ca3af',
      accent: '#ffd700',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6'
    },
    border: {
      primary: 'rgba(255, 215, 0, 0.3)',
      secondary: 'rgba(255, 255, 255, 0.1)',
      hover: 'rgba(255, 215, 0, 0.5)',
      focus: '#ffd700'
    },
    status: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      processing: '#8b5cf6'
    }
  },

  // 📝 TIPOGRAFIA
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      secondary: '"Playfair Display", Georgia, serif',
      mono: '"JetBrains Mono", "Fira Code", monospace'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  // 📐 SPACING
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem'      // 96px
  },

  // 🔄 ANIMAZIONI
  animations: {
    // Transizioni base
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Easing curves
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Keyframes
    keyframes: {
      fadeIn: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
      slideUp: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
      pulse: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `,
      spin: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
      shimmer: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `,
      glow: `
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700; }
          50% { box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700; }
        }
      `,
      bounce: `
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -8px, 0); }
          70% { transform: translate3d(0, -4px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
      `
    }
  },

  // 📱 BREAKPOINTS
  breakpoints: {
    xs: '320px',      // Smartphone piccoli
    sm: '480px',      // Smartphone
    md: '768px',      // Tablet portrait
    lg: '1024px',     // Tablet landscape / Desktop piccolo
    xl: '1200px',     // Desktop
    xxl: '1440px',    // Desktop large
    mobile: '768px',  // Backward compatibility
    tablet: '1024px', // Backward compatibility
    desktop: '1200px',// Backward compatibility
    wide: '1440px'    // Backward compatibility
  },

  // 🎯 SHADOWS
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(255, 215, 0, 0.3)',
    glowHover: '0 0 30px rgba(255, 215, 0, 0.5)'
  },

  // 🔘 BORDER RADIUS
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // 🎨 GRADIENTS
  gradients: {
    primary: 'linear-gradient(45deg, #ffd700, #ffed4e)',
    secondary: 'linear-gradient(45deg, #ff8a00, #ff6600)',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    card: 'linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.8))',
    shimmer: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    glass: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
  },

  // 🎭 Z-INDEX
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
};

// 🎨 COMPONENTI STYLED UTILITIES
export const mixins = {
  // Glass morphism effect
  glassMorphism: `
    background: ${theme.colors.background.glass};
    backdrop-filter: blur(20px);
    border: 1px solid ${theme.colors.border.secondary};
  `,
  
  // Card base style
  card: `
    background: ${theme.colors.background.card};
    border-radius: ${theme.borderRadius['2xl']};
    border: 1px solid ${theme.colors.border.primary};
    box-shadow: ${theme.shadows.lg};
  `,
  
  // Button base style
  button: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing[2]};
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    border-radius: ${theme.borderRadius.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    transition: ${theme.animations.smooth};
    cursor: pointer;
    border: none;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
  `,
  
  // Input base style
  input: `
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    border-radius: ${theme.borderRadius.lg};
    border: 2px solid ${theme.colors.border.secondary};
    background: ${theme.colors.background.glass};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.base};
    transition: ${theme.animations.smooth};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.border.focus};
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    }
    
    &::placeholder {
      color: ${theme.colors.text.muted};
    }
    
    /* Mobile optimizations */
    @media (max-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing[4]} ${theme.spacing[3]};
      font-size: 16px; /* Prevents zoom on iOS */
      min-height: 44px; /* Touch target size */
    }
  `,
  
  // Mobile-specific mixins
  mobileContainer: `
    padding: ${theme.spacing[4]};
    margin: ${theme.spacing[2]};
    
    @media (max-width: ${theme.breakpoints.sm}) {
      padding: ${theme.spacing[3]};
      margin: ${theme.spacing[1]};
    }
  `,
  
  mobileGrid: `
    display: grid;
    gap: ${theme.spacing[4]};
    grid-template-columns: 1fr;
    
    @media (min-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(3, 1fr);
    }
  `,
  
  mobileButton: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing[2]};
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    border-radius: ${theme.borderRadius.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    transition: ${theme.animations.smooth};
    cursor: pointer;
    border: none;
    min-height: 48px; /* Touch target */
    font-size: ${theme.typography.fontSize.base};
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
    
    @media (max-width: ${theme.breakpoints.md}) {
      width: 100%;
      padding: ${theme.spacing[4]} ${theme.spacing[6]};
      font-size: ${theme.typography.fontSize.lg};
    }
  `,
  
  mobileText: `
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.relaxed};
    
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: ${theme.typography.fontSize.sm};
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: ${theme.typography.fontSize.xs};
    }
  `,
  
  touchOptimized: `
    /* Increase touch targets */
    min-height: 44px;
    min-width: 44px;
    
    /* Improve touch feedback */
    -webkit-tap-highlight-color: rgba(255, 215, 0, 0.2);
    touch-action: manipulation;
    
    /* Prevent text selection on touch */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  `,
  
  scrollOptimized: `
    /* Smooth scrolling on mobile */
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    
    /* Custom scrollbar for mobile */
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 215, 0, 0.3);
      border-radius: 2px;
    }
  `,
  
  // Responsive utilities - Mobile First Approach
  xs: `@media (max-width: ${theme.breakpoints.xs})`,
  sm: `@media (max-width: ${theme.breakpoints.sm})`,
  md: `@media (max-width: ${theme.breakpoints.md})`,
  lg: `@media (max-width: ${theme.breakpoints.lg})`,
  xl: `@media (max-width: ${theme.breakpoints.xl})`,
  xxl: `@media (max-width: ${theme.breakpoints.xxl})`,
  
  // Min-width queries (mobile-first)
  minSm: `@media (min-width: ${theme.breakpoints.sm})`,
  minMd: `@media (min-width: ${theme.breakpoints.md})`,
  minLg: `@media (min-width: ${theme.breakpoints.lg})`,
  minXl: `@media (min-width: ${theme.breakpoints.xl})`,
  minXxl: `@media (min-width: ${theme.breakpoints.xxl})`,
  
  // Backward compatibility
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`,
  
  // Touch device detection
  touch: `@media (hover: none) and (pointer: coarse)`,
  
  // Orientation queries
  portrait: `@media (orientation: portrait)`,
  landscape: `@media (orientation: landscape)`,
  
  // High DPI displays
  retina: `@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)`,
  
  // Mobile-specific utilities
  mobileOnly: `@media (max-width: ${theme.breakpoints.md}) and (hover: none)`,
  tabletOnly: `@media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg})`,
  desktopOnly: `@media (min-width: ${theme.breakpoints.lg})`
};

// 🎯 COMPONENT VARIANTS
export const variants = {
  button: {
    primary: `
      background: ${theme.gradients.primary};
      color: #1a1a2e;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.glowHover};
      }
    `,
    secondary: `
      background: ${theme.colors.background.glass};
      color: ${theme.colors.text.primary};
      border: 1px solid ${theme.colors.border.secondary};
      
      &:hover:not(:disabled) {
        background: ${theme.colors.background.glassHover};
        border-color: ${theme.colors.border.hover};
      }
    `,
    ghost: `
      background: transparent;
      color: ${theme.colors.text.secondary};
      
      &:hover:not(:disabled) {
        background: ${theme.colors.background.glass};
        color: ${theme.colors.text.primary};
      }
    `,
    danger: `
      background: ${theme.colors.status.error};
      color: white;
      
      &:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-1px);
      }
    `
  },
  
  input: {
    default: `
      ${mixins.input}
    `,
    error: `
      ${mixins.input}
      border-color: ${theme.colors.status.error};
      
      &:focus {
        border-color: ${theme.colors.status.error};
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
      }
    `,
    success: `
      ${mixins.input}
      border-color: ${theme.colors.status.success};
      
      &:focus {
        border-color: ${theme.colors.status.success};
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
      }
    `
  }
};

export default theme; 