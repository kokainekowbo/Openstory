import React from 'react';
import styled from 'styled-components';
import { theme, mixins, variants } from '../../theme/designSystem';

// 🔘 BUTTON COMPONENT - Componente riutilizzabile ottimizzato
// React.memo per performance, varianti complete, accessibilità

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Styled Button con varianti dinamiche
const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $loading: boolean;
  $fullWidth: boolean;
}>`
  ${mixins.button}
  
  /* Varianti di stile */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return variants.button.primary;
      case 'secondary':
        return variants.button.secondary;
      case 'ghost':
        return variants.button.ghost;
      case 'danger':
        return variants.button.danger;
      default:
        return variants.button.primary;
    }
  }}
  
  /* Dimensioni */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 2rem;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 3.5rem;
        `;
      default: // md
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.base};
          min-height: 2.75rem;
        `;
    }
  }}
  
  /* Full width */
  ${props => props.$fullWidth && 'width: 100%;'}
  
  /* Loading state */
  ${props => props.$loading && `
    cursor: wait;
    position: relative;
    color: transparent;
  `}
  
  /* Responsive */
  ${mixins.mobile} {
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

// Loading Spinner
const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  
  ${theme.animations.keyframes.spin}
`;

// Icon Wrapper
const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${props => props.$position === 'right' && 'order: 1;'}
`;

// Content Wrapper
const ContentWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

/**
 * Button Component - Componente pulsante riutilizzabile e accessibile
 * 
 * @param variant - Stile del pulsante (primary, secondary, ghost, danger)
 * @param size - Dimensione del pulsante (sm, md, lg)
 * @param loading - Stato di caricamento
 * @param icon - Icona da mostrare
 * @param iconPosition - Posizione dell'icona (left, right)
 * @param fullWidth - Pulsante a larghezza piena
 * @param children - Contenuto del pulsante
 */
const Button = React.memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $loading={loading}
      $fullWidth={fullWidth}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      <ContentWrapper>
        {icon && iconPosition === 'left' && (
          <IconWrapper $position="left">
            {icon}
          </IconWrapper>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <IconWrapper $position="right">
            {icon}
          </IconWrapper>
        )}
      </ContentWrapper>
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;

// 🎯 ESEMPI DI UTILIZZO
/*
// Pulsante primario base
<Button>Genera Storia</Button>

// Pulsante con icona e loading
<Button 
  variant="primary" 
  size="lg" 
  loading={isGenerating}
  icon={<span>✨</span>}
>
  {isGenerating ? 'Generando...' : 'Genera Storia'}
</Button>

// Pulsante secondario con icona a destra
<Button 
  variant="secondary" 
  icon={<span>📄</span>}
  iconPosition="right"
>
  Esporta PDF
</Button>

// Pulsante di pericolo
<Button 
  variant="danger" 
  size="sm"
  onClick={handleDelete}
>
  Elimina
</Button>

// Pulsante ghost full width
<Button 
  variant="ghost" 
  fullWidth
  onClick={handleCancel}
>
  Annulla
</Button>
*/ 