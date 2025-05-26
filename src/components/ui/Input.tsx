import React from 'react';
import styled from 'styled-components';
import { theme, mixins, variants } from '../../theme/designSystem';

// 📝 INPUT COMPONENT - Componente input riutilizzabile ottimizzato
// React.memo per performance, validazione, accessibilità

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  required?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error' | 'success';
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  fullWidth?: boolean;
  required?: boolean;
  rows?: number;
}

// Container principale
const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

// Label
const Label = styled.label<{ $required: boolean }>`
  color: ${theme.colors.text.accent};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
  
  ${props => props.$required && `
    &::after {
      content: ' *';
      color: ${theme.colors.status.error};
    }
  `}
`;

// Input wrapper per icone
const InputWrapper = styled.div<{ $hasIcon: boolean; $iconPosition: 'left' | 'right' }>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${props => props.$hasIcon && props.$iconPosition === 'left' && `
    padding-left: ${theme.spacing[10]};
  `}
  
  ${props => props.$hasIcon && props.$iconPosition === 'right' && `
    padding-right: ${theme.spacing[10]};
  `}
`;

// Styled Input
const StyledInput = styled.input<{
  $variant: InputProps['variant'];
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
}>`
  width: 100%;
  
  /* Varianti di stile */
  ${props => {
    switch (props.$variant) {
      case 'error':
        return variants.input.error;
      case 'success':
        return variants.input.success;
      default:
        return variants.input.default;
    }
  }}
  
  /* Padding per icone */
  ${props => props.$hasIcon && props.$iconPosition === 'left' && `
    padding-left: ${theme.spacing[10]};
  `}
  
  ${props => props.$hasIcon && props.$iconPosition === 'right' && `
    padding-right: ${theme.spacing[10]};
  `}
  
  /* Responsive */
  ${mixins.mobile} {
    font-size: ${theme.typography.fontSize.base}; /* Previene zoom su iOS */
  }
`;

// Styled TextArea
const StyledTextArea = styled.textarea<{
  $variant: TextAreaProps['variant'];
}>`
  width: 100%;
  min-height: 100px;
  resize: vertical;
  font-family: ${theme.typography.fontFamily.primary};
  
  /* Varianti di stile */
  ${props => {
    switch (props.$variant) {
      case 'error':
        return variants.input.error;
      case 'success':
        return variants.input.success;
      default:
        return variants.input.default;
    }
  }}
  
  /* Responsive */
  ${mixins.mobile} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

// Icon wrapper
const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.muted};
  pointer-events: none;
  z-index: 1;
  
  ${props => props.$position === 'left' ? `
    left: ${theme.spacing[3]};
  ` : `
    right: ${theme.spacing[3]};
  `}
`;

// Message (error, success, hint)
const Message = styled.div<{ $type: 'error' | 'success' | 'hint' }>`
  font-size: ${theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  
  ${props => {
    switch (props.$type) {
      case 'error':
        return `color: ${theme.colors.status.error};`;
      case 'success':
        return `color: ${theme.colors.status.success};`;
      default:
        return `color: ${theme.colors.text.muted};`;
    }
  }}
`;

/**
 * Input Component - Componente input riutilizzabile e accessibile
 */
const Input = React.memo<InputProps>(({
  variant = 'default',
  label,
  error,
  success,
  hint,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  required = false,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasIcon = !!icon;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const currentVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;
  
  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={inputId} $required={required}>
          {label}
        </Label>
      )}
      
      <InputWrapper $hasIcon={hasIcon} $iconPosition={iconPosition}>
        {hasIcon && (
          <IconWrapper $position={iconPosition}>
            {icon}
          </IconWrapper>
        )}
        
        <StyledInput
          id={inputId}
          $variant={currentVariant}
          $hasIcon={hasIcon}
          $iconPosition={iconPosition}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : 
            success ? `${inputId}-success` : 
            hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
      </InputWrapper>
      
      {error && (
        <Message $type="error" id={`${inputId}-error`} role="alert">
          <span>❌</span>
          {error}
        </Message>
      )}
      
      {success && !error && (
        <Message $type="success" id={`${inputId}-success`}>
          <span>✅</span>
          {success}
        </Message>
      )}
      
      {hint && !error && !success && (
        <Message $type="hint" id={`${inputId}-hint`}>
          <span>💡</span>
          {hint}
        </Message>
      )}
    </InputContainer>
  );
});

/**
 * TextArea Component - Componente textarea riutilizzabile e accessibile
 */
const TextArea = React.memo<TextAreaProps>(({
  variant = 'default',
  label,
  error,
  success,
  hint,
  fullWidth = false,
  required = false,
  rows = 4,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const currentVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;
  
  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={textareaId} $required={required}>
          {label}
        </Label>
      )}
      
      <StyledTextArea
        id={textareaId}
        rows={rows}
        $variant={currentVariant}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${textareaId}-error` : 
          success ? `${textareaId}-success` : 
          hint ? `${textareaId}-hint` : undefined
        }
        {...props}
      />
      
      {error && (
        <Message $type="error" id={`${textareaId}-error`} role="alert">
          <span>❌</span>
          {error}
        </Message>
      )}
      
      {success && !error && (
        <Message $type="success" id={`${textareaId}-success`}>
          <span>✅</span>
          {success}
        </Message>
      )}
      
      {hint && !error && !success && (
        <Message $type="hint" id={`${textareaId}-hint`}>
          <span>💡</span>
          {hint}
        </Message>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';
TextArea.displayName = 'TextArea';

export { Input, TextArea };
export default Input;

// 🎯 ESEMPI DI UTILIZZO
/*
// Input base con label
<Input 
  label="Nome Protagonista"
  placeholder="Inserisci il nome..."
  required
/>

// Input con icona e validazione
<Input 
  label="Email"
  type="email"
  icon={<span>📧</span>}
  error={emailError}
  success={emailValid ? "Email valida!" : undefined}
  fullWidth
/>

// Input con hint
<Input 
  label="Password"
  type="password"
  icon={<span>🔒</span>}
  iconPosition="right"
  hint="Minimo 8 caratteri"
/>

// TextArea per descrizioni
<TextArea 
  label="Descrizione Personaggio"
  placeholder="Descrivi il personaggio..."
  rows={6}
  hint="Includi aspetto fisico, personalità e background"
  fullWidth
/>

// Input con errore
<Input 
  label="Titolo Storia"
  value={title}
  error={titleError}
  onChange={handleTitleChange}
/>
*/ 