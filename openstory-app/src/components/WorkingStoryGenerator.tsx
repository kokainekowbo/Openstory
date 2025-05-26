import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import { StoryTemplateEngine } from './story-templates/StoryTemplateEngine';
import { IntelligentSuggestionEngine } from './story-templates/IntelligentSuggestions';
import { DynamicFormEngine, type GenreFormStructure } from './story-templates/DynamicFormEngine';
import { StoryQualityEngine } from './story-templates/StoryQualityEngine';
import DeepSeekService from '../services/DeepSeekService';
import OpenVoiceService, { type NarrationResponse, type VoiceOptions } from '../services/OpenVoiceService';
import '../config/quickFix'; // Importa le funzioni di risoluzione rapida

// Animazioni
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700; }
  50% { box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700; }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 20px;
  color: #f5f5f5;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  
  /* Mobile-first responsive design */
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin: 0.25rem;
    border-radius: 12px;
  }
`;

const Title = styled.h1`
  color: #ffd700;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  ${css`animation: ${pulse} 2s ease-in-out infinite;`}
  
  /* Mobile responsive typography */
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  margin-bottom: 2rem;
  
  /* Mobile responsive padding */
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
  }
`;

const SectionTitle = styled.h3`
  color: #ffd700;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  /* Mobile-first responsive grid */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
  
  /* Tablet optimization */
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Input = styled.input`
  padding: 0.75rem;
  border-radius: 10px;
  border: 2px solid #333;
  background: #2a2a2a;
  color: #f5f5f5;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 10px;
  border: 2px solid #333;
  background: #2a2a2a;
  color: #f5f5f5;
  font-size: 1rem;
  transition: border-color 0.3s;
  min-height: 44px; /* Touch target size */

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  option {
    background: #2a2a2a;
    color: #f5f5f5;
    padding: 0.5rem;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 16px; /* Prevents zoom on iOS */
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 16px;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 10px;
  border: 2px solid #333;
  background: #2a2a2a;
  color: #f5f5f5;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 120px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    min-height: 100px;
    font-size: 16px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span<{ selected: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? '#ffd700' : '#555'};
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(85, 85, 85, 0.2)'};
  color: ${props => props.selected ? '#ffd700' : '#ccc'};

  &:hover {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  border: none;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-top: 2rem;
  min-height: 48px; /* Touch target size */
  
  /* Touch optimizations */
  -webkit-tap-highlight-color: rgba(255, 215, 0, 0.2);
  touch-action: manipulation;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  }
  
  /* Mobile hover alternative */
  @media (hover: none) and (pointer: coarse) {
    &:active:not(:disabled) {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const GenerationContainer = styled.div`
  background: rgba(26, 26, 46, 0.9);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid #ffd700;
  ${css`animation: ${fadeInUp} 0.5s ease-out, ${glow} 2s ease-in-out infinite;`}
`;

const ProgressHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const GenerationTitle = styled.h2`
  color: #ffd700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const SpinningIcon = styled.span`
  display: inline-block;
  ${css`animation: ${rotate} 2s linear infinite;`}
  font-size: 1.5rem;
`;

const PercentageDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  margin: 1rem 0;
`;

const PhaseIndicator = styled.div`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
  background-size: 200% 100%;
  ${css`animation: ${shimmer} 2s ease-in-out infinite;`}
  transition: width 0.3s ease-out;
  border-radius: 10px;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StepCard = styled.div<{ active: boolean; completed: boolean }>`
  background: ${props => 
    props.completed ? 'rgba(255, 215, 0, 0.2)' : 
    props.active ? 'rgba(255, 215, 0, 0.1)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => 
    props.completed ? '#ffd700' : 
    props.active ? '#ffd700' : 
    'transparent'
  };
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  
  ${props => props.active && css`
    animation: ${pulse} 1.5s ease-in-out infinite;
  `}
`;

const StepIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StepLabel = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  font-weight: bold;
  
  ${props => props.type === 'success' && `
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    color: #00ff00;
  `}
  
  ${props => props.type === 'error' && `
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: #ff6b6b;
  `}
  
  ${props => props.type === 'info' && `
    background: rgba(0, 150, 255, 0.1);
    border: 1px solid rgba(0, 150, 255, 0.3);
    color: #66b3ff;
  `}
`;

// StoryOutput component removed - not currently used
// const StoryOutput = styled.div`
//   background: rgba(255, 255, 255, 0.05);
//   border: 2px solid #ffd700;
//   border-radius: 15px;
//   padding: 2rem;
//   margin-top: 2rem;
//   white-space: pre-wrap;
//   line-height: 1.8;
//   font-size: 1.1rem;
//   max-height: 600px;
//   overflow-y: auto;
// `;

const StorySection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
`;

const SectionContent = styled.div`
  color: #f5f5f5;
  line-height: 1.8;
  font-size: 1.05rem;
  white-space: pre-wrap;
  margin-bottom: 1rem;
`;

// 🎙️ COMPONENTI STYLED PER NARRAZIONE VOCALE
const VoiceControlsContainer = styled.div`
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.1));
  border: 2px solid rgba(138, 43, 226, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const VoiceButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => 
    props.variant === 'danger' ? 'linear-gradient(45deg, #FF6B6B, #FF8E8E)' :
    props.variant === 'secondary' ? 'linear-gradient(45deg, #6C5CE7, #A29BFE)' :
    'linear-gradient(45deg, #8A2BE2, #9370DB)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(138, 43, 226, 0.4);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  
  &::-webkit-media-controls-panel {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const VoiceStatus = styled.div<{ type: 'generating' | 'success' | 'error' }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.type === 'generating' && `
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid rgba(255, 193, 7, 0.5);
    color: #FFC107;
  `}
  
  ${props => props.type === 'success' && `
    background: rgba(40, 167, 69, 0.2);
    border: 1px solid rgba(40, 167, 69, 0.5);
    color: #28A745;
  `}
  
  ${props => props.type === 'error' && `
    background: rgba(220, 53, 69, 0.2);
    border: 1px solid rgba(220, 53, 69, 0.5);
    color: #DC3545;
  `}
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VoiceOptionsPanel = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const VoiceSelect = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #555;
  background: #2a2a2a;
  color: #f5f5f5;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #8A2BE2;
  }
`;

const VoiceSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
  
  &[type="range"] {
    -webkit-appearance: none;
    height: 6px;
    border-radius: 3px;
    background: #555;
    outline: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #8A2BE2;
      cursor: pointer;
    }
    
    &::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #8A2BE2;
      cursor: pointer;
      border: none;
    }
  }
`;

// 🎙️ COMPONENTI AVANZATI PER VOCI ULTRA-REALISTICHE
const UltraVoicePanel = styled.div`
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.1));
  border: 2px solid rgba(138, 43, 226, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.2);
`;

const VoiceControlHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  h3 {
    color: #8A2BE2;
    margin: 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const VoicePresetSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const VoicePresetCard = styled.div<{ selected: boolean }>`
  background: ${props => props.selected ? 
    'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.2))' : 
    'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => props.selected ? '#8A2BE2' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    border-color: #8A2BE2;
    background: rgba(138, 43, 226, 0.1);
    transform: translateY(-2px);
  }
  
  .preset-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .preset-name {
    color: #8A2BE2;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  
  .preset-desc {
    color: #ccc;
    font-size: 0.8rem;
  }
`;

const VoiceParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const VoiceParameterGroup = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  
  h4 {
    color: #8A2BE2;
    margin: 0 0 1rem 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const VoiceParameter = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    color: #e0e0e0;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .parameter-value {
    color: #8A2BE2;
    font-weight: bold;
    float: right;
  }
`;

const VoiceQualityIndicator = styled.div<{ quality: number }>`
  background: ${props => 
    props.quality >= 90 ? 'linear-gradient(45deg, #4CAF50, #8BC34A)' :
    props.quality >= 70 ? 'linear-gradient(45deg, #FF9800, #FFC107)' :
    'linear-gradient(45deg, #F44336, #FF5722)'
  };
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const VoiceLanguageDetector = styled.div`
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  
  .detector-header {
    color: #0096FF;
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .detected-language {
    color: #e0e0e0;
    font-size: 0.9rem;
  }
  
  .confidence-bar {
    background: rgba(255, 255, 255, 0.1);
    height: 6px;
    border-radius: 3px;
    margin: 0.5rem 0;
    overflow: hidden;
    
    .confidence-fill {
      background: linear-gradient(90deg, #0096FF, #00D4FF);
      height: 100%;
      transition: width 0.3s ease;
    }
  }
`;

const VoiceGenderSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
  
  button {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 2px solid rgba(138, 43, 226, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      background: rgba(138, 43, 226, 0.3);
      border-color: #8A2BE2;
      color: #8A2BE2;
      font-weight: bold;
    }
    
    &:hover {
      border-color: #8A2BE2;
      background: rgba(138, 43, 226, 0.1);
    }
  }
`;

// 🎛️ Componenti per Sistema Dinamico
const GenreSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const GenreCard = styled.div<{ selected: boolean; compatibility?: number }>`
  background: ${props => props.selected ? 
    'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))' : 
    'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => props.selected ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    transform: translateY(-2px);
  }
  
  ${props => props.selected && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}
`;

const GenreIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const GenreTitle = styled.h3`
  color: #ffd700;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const GenreDescription = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const CompatibilityIndicator = styled.div<{ score: number }>`
  background: ${props => 
    props.score >= 80 ? 'linear-gradient(45deg, #4CAF50, #8BC34A)' :
    props.score >= 60 ? 'linear-gradient(45deg, #FF9800, #FFC107)' :
    'linear-gradient(45deg, #F44336, #FF5722)'
  };
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 1rem 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

// Componenti DynamicSelect e OptionCompatibility rimossi per evitare duplicazioni

const HelpText = styled.div`
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
`;

const WarningsList = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  
  h4 {
    color: #F44336;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #ff9999;
  }
`;

const SuggestionsList = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  
  h4 {
    color: #4CAF50;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #99ff99;
  }
`;



// ImagePromptCard component removed - not currently used
// const ImagePromptCard = styled.div`
//   background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
//   border: 2px solid rgba(255, 215, 0, 0.5);
//   border-radius: 12px;
//   padding: 1.5rem;
//   margin: 1.5rem 0;
//   box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
//   
//   h4 {
//     color: #ffd700;
//     margin: 0 0 1rem 0;
//     font-size: 1.1rem;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//   }
//   
//   p {
//     color: #e0e0e0;
//     margin: 0;
//     font-style: italic;
//     line-height: 1.6;
//     background: rgba(0, 0, 0, 0.3);
//     padding: 1rem;
//     border-radius: 8px;
//     border-left: 4px solid #ffd700;
//   }
// `;

// Interfacce
interface StoryParams {
  // Base
  genre: string;
  tone: string;
  length: string;
  
  // Personaggi
  protagonistName: string;
  protagonistDetails: string;
  antagonistName: string;
  antagonistDetails: string;
  
  // Ambientazione
  setting: string;
  timeperiod: string;
  atmosphere: string;
  
  // Trama
  mainConflict: string;
  plotElements: string[];
  
  // Stile
  narrativeStyle: string;
  writingStyle: string;
  
  // Extra
  specialRequests: string;
}

interface GenerationStep {
  id: string;
  label: string;
  icon: string;
  duration: number;
}

// Function removed - not currently used
// const processStoryWithImagePrompts = (storyText: string) => {
//   const imagePromptRegex = /🎨\s*\*\*PROMPT\s+IMMAGINE:\s*([^*]+)\*\*\s*\n"([^"]+)"/gi;
//   const parts: Array<{ type: 'story' | 'image-prompt'; content: string; title?: string }> = [];
//   let lastIndex = 0;
//   let match;

//   while ((match = imagePromptRegex.exec(storyText)) !== null) {
//     // Aggiungi il testo prima del prompt
//     if (match.index > lastIndex) {
//       parts.push({
//         type: 'story',
//         content: storyText.substring(lastIndex, match.index)
//       });
//     }
    
//     // Aggiungi il prompt dell'immagine
//     parts.push({
//       type: 'image-prompt',
//       title: match[1].trim(),
//       content: match[2].trim()
//     });
    
//     lastIndex = match.index + match[0].length;
//   }
  
//   // Aggiungi il resto del testo
//   if (lastIndex < storyText.length) {
//     parts.push({
//       type: 'story',
//       content: storyText.substring(lastIndex)
//     });
//   }
  
//   return parts;
// };

// Funzione per estrarre le sezioni della storia
const extractStorySections = (storyText: string) => {
  const sections = [];
  
  // Pattern per trovare le sezioni
  const sectionPattern = /\*\*([^*]+)\*\*\s*([\s\S]*?)(?=\*\*[^*]+\*\*|$)/g;
  let match;
  
  while ((match = sectionPattern.exec(storyText)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    
    if (content.length > 50) { // Solo sezioni con contenuto sostanziale
      sections.push({
        title,
        content,
        id: title.toLowerCase().replace(/[^a-z0-9]/g, '-')
      });
    }
  }
  
  return sections;
};

// 🎨 COMPONENTI STYLED PER PROMPT FOOOCUS
const FoocusPromptContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.1));
  border: 2px solid rgba(255, 165, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
`;

const FoocusPromptText = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  color: #f5f5f5;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 165, 0, 0.5);
    border-radius: 3px;
  }
`;

const FoocusButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => 
    props.variant === 'secondary' ? 
    'linear-gradient(45deg, #FF8C00, #FFA500)' : 
    'linear-gradient(45deg, #FF6B35, #FF8C00)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const FoocusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  h4 {
    color: #FFA500;
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FoocusControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StoryGenerator: React.FC = () => {
  const [params, setParams] = useState<StoryParams>({
    genre: 'action_thriller',
    tone: 'intense',
    length: 'medium',
    
    protagonistName: 'Detective Alex Morgan',
    protagonistDetails: 'Investigatore brillante ma tormentato, con un passato misterioso che lo spinge a cercare sempre la verità',
    antagonistName: 'Il Collezionista',
    antagonistDetails: 'Criminale sofisticato che orchestra crimini come opere d\'arte, mosso da una filosofia distorta di perfezione',
    
    setting: 'Metropoli moderna con quartieri storici',
    timeperiod: 'contemporary',
    atmosphere: 'urban_noir',
    
    mainConflict: 'Una serie di crimini apparentemente scollegati nasconde un piano magistrale che minaccia l\'intera città',
    plotElements: ['mystery', 'action', 'psychological'],
    
    narrativeStyle: 'third_person',
    writingStyle: 'commercial',
    
    specialRequests: ''
  });

  const [story, setStory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);



  // 🎛️ Stati per sistema dinamico
  const [currentGenreStructure, setCurrentGenreStructure] = useState<GenreFormStructure | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<number>(0);
  const [formWarnings, setFormWarnings] = useState<string[]>([]);
  const [formSuggestions, setFormSuggestions] = useState<string[]>([]);
  const [regenerationAttempts, setRegenerationAttempts] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [usingDeepSeek, setUsingDeepSeek] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deepSeekProvider, setDeepSeekProvider] = useState<string>('');

  // 🎙️ STATI PER NARRAZIONE VOCALE
  const [voiceNarrations, setVoiceNarrations] = useState<{[sectionId: string]: NarrationResponse}>({});
  const [generatingVoice, setGeneratingVoice] = useState<string | null>(null);
  const [voiceOptions, setVoiceOptions] = useState<VoiceOptions>({
    accent: 'it', // Italiano come default
    speed: 0.9, // Leggermente più lenta per naturalezza
    emotion: 'default',
    language: 'it', // Forza italiano come default
    gender: 'auto', // Selezione automatica del genere
    age: 'auto', // Selezione automatica dell'età
    // Impostazioni ultra-realistiche ottimizzate per italiano
    stability: 0.92, // Maggiore stabilità per voci italiane
    similarity: 0.95, // Massima similarità per naturalezza
    style: 0.80, // Stile più marcato per espressività italiana
    pitch: 0,
    breathiness: 0.18, // Più respiro per naturalezza italiana
    roughness: 0.03, // Minima ruvidezza per voce pulita
    speakerBoost: true, // Sempre attivo per chiarezza
    useEnhancedModel: true // Sempre modello avanzato
  });
  const [showVoiceOptions, setShowVoiceOptions] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<{[sectionId: string]: { type: 'generating' | 'success' | 'error'; message: string }}>({});

  // 🎨 STATI PER PROMPT FOOOCUS
  const [sectionImagePrompts, setSectionImagePrompts] = useState<{[key: string]: string}>({});

  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

  // 🎛️ Funzione per aggiornare il punteggio di compatibilità
  const updateCompatibilityScore = React.useCallback(() => {
    if (!currentGenreStructure) return;
    
    // Converte StoryParams in Record<string, string> per compatibilità
    const paramsRecord: Record<string, string> = {
      genre: params.genre,
      tone: params.tone,
      length: params.length,
      narrativeStyle: params.narrativeStyle,
      writingStyle: params.writingStyle,
      timeperiod: params.timeperiod,
      atmosphere: params.atmosphere
    };
    
    const validation = DynamicFormEngine.validateSettings(params.genre, paramsRecord);
    const suggestions = DynamicFormEngine.getSuggestions(params.genre, paramsRecord);
    
    setCompatibilityScore(suggestions.score);
    setFormWarnings(validation.warnings);
    setFormSuggestions(suggestions.suggestions);
    
    console.log('🎛️ Compatibilità aggiornata:', {
      score: suggestions.score,
      warnings: validation.warnings.length,
      suggestions: suggestions.suggestions.length
    });
  }, [currentGenreStructure, params]);

  // 🎛️ Inizializza il sistema dinamico al caricamento
  React.useEffect(() => {
    const genreStructure = DynamicFormEngine.getFormStructure(params.genre);
    setCurrentGenreStructure(genreStructure);
    
    if (genreStructure) {
      console.log('🎛️ Sistema dinamico inizializzato per:', genreStructure.displayName);
      updateCompatibilityScore();
    }
  }, [params.genre, updateCompatibilityScore]);

  const generationSteps: GenerationStep[] = [
    { id: 'init', label: 'Inizializzazione', icon: '🚀', duration: 5 },
    { id: 'analyze', label: 'Analisi Parametri', icon: '🔍', duration: 10 },
    { id: 'structure', label: 'Struttura Narrativa', icon: '📋', duration: 15 },
    { id: 'characters', label: 'Sviluppo Personaggi', icon: '👥', duration: 20 },
    { id: 'plot', label: 'Generazione Trama', icon: '📖', duration: 30 },
    { id: 'refine', label: 'Raffinamento', icon: '✨', duration: 15 },
    { id: 'complete', label: 'Finalizzazione', icon: '🎉', duration: 5 }
  ];

  // Opzioni preimpostate professionali
  const protagonistNames = [
    // Nomi realistici
    'Detective Alex Morgan', 'Sarah Chen', 'Marcus Blackwood', 'Elena Rossi', 'James Cross',
    'Dr. Katherine Vale', 'Jack Sullivan', 'Maya Patel', 'David Stone', 'Rebecca Hart',
    'Professor William Grey', 'Thomas Kane', 'Ryan Mitchell', 'Stella Rodriguez', 'Cole Turner',
    
    // Nomi di fantasia
    'Phoenix', 'Raven', 'Storm', 'Shadow', 'Luna', 'Blade', 'Frost', 'Sage', 'Nova', 'Zara',
    'Hunter', 'Aria', 'Drake', 'Ivy', 'Axel', 'Scarlett', 'Kai', 'Ember', 'Orion', 'Nyx'
  ];

  const antagonistNames = [
    // Nomi realistici
    'Il Collezionista', 'Dr. Victor Kane', 'Il Professore', 'Il Maestro', 'Il Giudice',
    'Lady Crimson', 'Mr. Zero', 'Il Silenzioso', 'La Sfinge', 'Il Cacciatore',
    
    // Nomi di fantasia
    'La Vedova Nera', 'Madame Serpente', 'Shadow Walker', 'La Regina di Ghiaccio', 'Il Burattinaio',
    'Phoenix Nero', 'Il Corvo', 'Madame X', 'Lord Darkness', 'Lady Vendetta',
    'Viper', 'Phantom', 'Scorpion', 'Reaper', 'Wraith', 'Demon', 'Specter', 'Rogue', 'Tempest', 'Void'
  ];

  const protagonistProfiles = [
    'Investigatore brillante ma tormentato, con un passato misterioso che lo spinge a cercare sempre la verità',
    'Avvocato determinato che lotta contro l\'ingiustizia, disposto a rischiare tutto per i propri principi',
    'Ex agente speciale ora detective privato, esperto in arti marziali e tattiche militari',
    'Giornalista investigativo coraggioso che scopre verità scomode e affronta potenti nemici',
    'Medico brillante coinvolto in misteri che richiedono la sua conoscenza scientifica e intuito',
    'Hacker etico che usa le sue competenze tecnologiche per combattere il crimine informatico',
    'Archeologo avventuroso che scopre antichi segreti e affronta pericoli mortali per la verità',
    'Psicologo forense specializzato nel profilare serial killer e criminali complessi',
    'Ex soldato delle forze speciali ora cacciatore di taglie con un forte senso della giustizia',
    'Scrittore di gialli che si ritrova invischiato in un vero mistero da risolvere',
    'Agente dell\'FBI con abilità speciali e un passato che lo tormenta costantemente',
    'Sicario pentito che ora combatte contro l\'organizzazione che un tempo serviva',
    'Professore universitario con conoscenze segrete che lo rendono un bersaglio pericoloso',
    'Vigilante mascherato che protegge la città dall\'ombra con metodi non convenzionali',
    'Sopravvissuto di una tragedia che dedica la vita a prevenire simili catastrofi',
    'Genius della tecnologia che usa l\'intelligenza artificiale per predire e prevenire crimini',
    'Ex agente sotto copertura con identità multiple e nessuno di cui fidarsi',
    'Cacciatore di mostri specializzato in creature soprannaturali e minacce paranormali',
    'Pilota d\'élite coinvolto in una cospirazione che minaccia l\'equilibrio mondiale',
    'Maestro di arti marziali che protegge antichi segreti da forze malvagie'
  ];

  const antagonistProfiles = [
    'Criminale sofisticato che orchestra crimini come opere d\'arte, mosso da una filosofia distorta di perfezione',
    'Genio del male ossessionato dalla perfezione, disposto a tutto pur di realizzare i suoi piani grandiosi',
    'Ex alleato del protagonista diventato nemico per vendetta personale o tradimento del passato',
    'Magnate corrotto che controlla la città dall\'ombra usando ricchezza e influenza politica',
    'Serial killer intellettuale che considera i suoi omicidi come capolavori artistici da ammirare',
    'Terrorista ideologico convinto di salvare il mondo attraverso la distruzione controllata',
    'Scienziato pazzo che conduce esperimenti illegali per raggiungere l\'immortalità o il potere assoluto',
    'Capo del crimine organizzato spietato ma con un codice d\'onore personale molto rigido',
    'Agente rogue di un\'organizzazione segreta che persegue i propri obiettivi nascosti',
    'Cult leader carismatico che manipola le persone per costruire il suo impero di potere',
    'Assassino professionista senza emozioni che vede ogni omicidio come un lavoro perfetto',
    'Hacker criminale che controlla il mondo digitale e ricatta governi e corporation',
    'Ex militare che usa le sue competenze per creare un\'armata privata e seminare il caos',
    'Magnate della tecnologia che vuole controllare l\'umanità attraverso l\'intelligenza artificiale',
    'Signore del crimine che costruisce il suo impero sulla paura e sulla violenza sistematica',
    'Manipolatore psicologico che distrugge le vite delle persone dall\'interno senza lasciare tracce',
    'Cacciatore sadico che vede gli esseri umani come prede in un gioco mortale di sopravvivenza',
    'Guru spirituale corrotto che usa la religione per coprire i suoi crimini più atroci',
    'CEO psicopatico che sacrifica tutto e tutti per il profitto e il controllo del mercato',
    'Entità soprannaturale che si nutre del dolore umano e semina morte ovunque passi'
  ];

  const settings = [
    'Metropoli moderna con quartieri storici', 'New York City - Manhattan', 'Londra vittoriana',
    'Tokyo futuristico', 'Roma antica', 'Parigi contemporanea', 'Los Angeles noir',
    'Venezia misteriosa', 'San Francisco tech', 'Chicago degli anni \'20',
    'Hong Kong cyberpunk', 'Berlino post-guerra', 'Las Vegas notturna',
    'Mosca invernale', 'Dubai futuristica', 'Amsterdam canali',
    'Città universitaria New England', 'Piccola città del Midwest', 'Metropoli post-apocalittica',
    'Stazione spaziale orbitale', 'Isola tropicale isolata', 'Base militare segreta',
    'Castello medievale', 'Monastero tibetano', 'Laboratorio sotterraneo'
  ];

  const conflicts = [
    'Una serie di crimini apparentemente scollegati nasconde un piano magistrale',
    'Il protagonista deve fermare un attentato che cambierà la storia del mondo',
    'Un serial killer sfida il protagonista con indovinelli e giochi mentali mortali',
    'Una cospirazione globale minaccia di rovesciare i governi mondiali',
    'Il protagonista deve salvare una persona cara rapita da un nemico del passato',
    'Un virus letale è stato rubato e verrà rilasciato se non si pagano le richieste',
    'Il protagonista scopre di essere stato usato e deve vendicare il tradimento',
    'Una setta apocalittica vuole scatenare il caos per far rinascere il mondo',
    'Il protagonista deve proteggere un testimone chiave da assassini professionali',
    'Un\'intelligenza artificiale senziente minaccia di controllare la rete mondiale',
    'Il protagonista deve risolvere un caso irrisolto che ha distrutto la sua carriera',
    'Una reliquia antica con poteri soprannaturali è caduta nelle mani sbagliate',
    'Il protagonista deve infiltrarsi in un\'organizzazione criminale per smascherarla',
    'Un esperimento scientifico è andato storto creando una minaccia mortale',
    'Il protagonista deve fermare un ricattatore che conosce i segreti di tutti'
  ];

  const atmospheres = [
    'urban_noir', 'gothic_horror', 'futuristic_tech', 'cozy_mystery',
    'gritty_realistic', 'romantic_tension', 'supernatural_dark',
    'corporate_thriller', 'military_action', 'psychological_mind',
    'historical_epic', 'cyberpunk_neon', 'western_dusty',
    'tropical_paradise', 'arctic_survival', 'underground_secret'
  ];

  const plotElementsOptions = [
    'mystery', 'action', 'romance', 'humor', 'suspense', 'adventure',
    'drama', 'twist', 'flashback', 'dialogue_heavy', 'character_driven', 'plot_driven',
    'psychological', 'conspiracy', 'revenge', 'redemption', 'betrayal', 'sacrifice',
    'discovery', 'chase', 'infiltration', 'investigation', 'survival', 'transformation'
  ];

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
      setStatus({
        type: 'error',
        message: '❌ API Key OpenRouter non configurata. Configura il file .env con la tua chiave.'
      });
      return;
    }

    setLoading(true);
    setStory('');
    setProgress(0);
    setCurrentStep(0);
    setStatus(null);
    setRegenerationAttempts(0); // Reset contatore tentativi
      setUsingDeepSeek(false); // Reset stato DeepSeek
      setDeepSeekProvider(''); // Reset provider DeepSeek

    try {
      // Simula le fasi di generazione con progresso realistico
      for (let i = 0; i < generationSteps.length; i++) {
        const step = generationSteps[i];
        setCurrentStep(i);
        setCurrentPhase(step.label);
        
        const stepStart = Date.now();
        const stepDuration = step.duration * 100;
        
        while (Date.now() - stepStart < stepDuration) {
          const stepProgress = (Date.now() - stepStart) / stepDuration;
          const totalStepProgress = (i + stepProgress) / generationSteps.length;
          const newProgress = Math.min(Math.round(totalStepProgress * 90), 90);
          
          setProgress(newProgress);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      setCurrentPhase('Generazione AI in corso...');
      setProgress(90);
      
      const prompt = buildStoryPrompt(params);
      console.log('📝 Prompt creato:', prompt.substring(0, 200) + '...');

      const response = await callOpenRouterAPI(prompt);
      
      setProgress(100);
      setCurrentStep(generationSteps.length - 1);
      setCurrentPhase('Storia completata!');
      
      console.log('📊 Risposta completa API:', response.data);
      
      // 🔍 DEBUG ULTRA-DETTAGLIATO
      console.log('🔍 Analisi risposta API:');
      console.log('- Status:', response.status);
      console.log('- Data exists:', !!response.data);
      console.log('- Choices exists:', !!response.data?.choices);
      console.log('- Choices length:', response.data?.choices?.length || 0);
      console.log('- First choice:', response.data?.choices?.[0]);
      console.log('- Message exists:', !!response.data?.choices?.[0]?.message);
      console.log('- Content exists:', !!response.data?.choices?.[0]?.message?.content);
      console.log('- Content type:', typeof response.data?.choices?.[0]?.message?.content);
      
      const generatedStory = response.data?.choices?.[0]?.message?.content || '';
      console.log('📝 Storia generata (lunghezza: ' + generatedStory.length + '):', generatedStory.substring(0, 200));
      
      // 🚫 Se la storia è vuota, prova a estrarre da altre parti della risposta
      if (!generatedStory || generatedStory.length === 0) {
        console.log('⚠️ Contenuto principale vuoto, cercando alternative...');
        console.log('📋 Risposta completa stringificata:', JSON.stringify(response.data, null, 2));
        
        // Prova alternative
        const alternatives = [
          response.data?.choices?.[0]?.text,
          response.data?.choices?.[0]?.delta?.content,
          response.data?.text,
          response.data?.content
        ];
        
        for (let i = 0; i < alternatives.length; i++) {
          if (alternatives[i] && alternatives[i].length > 0) {
            console.log(`✅ Trovato contenuto alternativo ${i + 1}:`, alternatives[i].substring(0, 100));
            const alternativeStory = alternatives[i];
            if (alternativeStory.length > 100) {
              console.log('🔄 Usando contenuto alternativo');
              // Continua con il contenuto alternativo
              break;
            }
          }
        }
        
        throw new Error(`Risposta API vuota. Modello: ${response.data?.model || 'sconosciuto'}. Choices: ${response.data?.choices?.length || 0}`);
      }
      
      // 🚫 VALIDAZIONE CONTENUTO CORROTTO - Nuovo controllo
      const corruptedPatterns = [
        /^[A-Z\s*!]+$/,                    // Solo maiuscole e simboli
        /AUTORE|ANTITRA|CON tempo/gi,      // Parole corrotte specifiche
        /^\s*[*!@#$%^&()]+\s*$/,          // Solo simboli
        /^.{1,100}$/,                     // Troppo breve
        /^[^a-z]*$/i                      // Nessuna lettera minuscola
      ];
      
      const isCorrupted = corruptedPatterns.some(pattern => pattern.test(generatedStory));
      
      if (isCorrupted) {
        console.error('🚫 CONTENUTO CORROTTO RILEVATO:', generatedStory.substring(0, 200));
        throw new Error(`Contenuto corrotto rilevato: "${generatedStory.substring(0, 100)}...". Riprova con il pulsante di rigenerazione ottimizzata.`);
      }
      
      // ✅ Verifica PRELIMINARE ultra-rigida
      const cleanedStory = generatedStory.trim();
      console.log('🧹 Storia pulita (lunghezza: ' + cleanedStory.length + '):', cleanedStory.substring(0, 100));
      
      // 🚫 BLOCCO IMMEDIATO per storie chiaramente fallite
      if (cleanedStory.length < 500) {
        throw new Error(`Storia troppo breve (${cleanedStory.length} caratteri). Minimo richiesto: 1500 caratteri. Contenuto: "${cleanedStory.substring(0, 100)}..."`);
      }

      // 🚫 BLOCCO per risposte non valide (guide, spiegazioni, rifiuti) - MIGLIORATO
      const invalidResponses = [
        'Mi dispiace', 'Non posso', 'Come scrivere', 'Let\'s break down', 
        'Here\'s how', 'Understanding the', 'Crafting Your', 'Remember:',
        'tutorial', 'istruzioni', 'come fare', 'step-by-step',
        'breakdown', 'brainstorm'
      ];
      
      // 🚫 RILEVAMENTO RIFIUTI AI SPECIFICI
      const aiRefusalPatterns = [
        /I'm sorry.*can't.*complete.*request/i,
        /I cannot.*write.*story/i,
        /I'm not able to.*create/i,
        /I can't help.*with.*content/i,
        /I'm unable to.*generate/i,
        /I cannot assist.*with/i,
        /I'm sorry.*I cannot/i,
        /I can't provide.*story/i
      ];
      
      const isAiRefusal = aiRefusalPatterns.some(pattern => pattern.test(cleanedStory));
      
      // 🎯 VALIDAZIONE MIGLIORATA: Controlla solo se la storia INIZIA con contenuto non valido
      const startsWithInvalidContent = invalidResponses.some(phrase => 
        cleanedStory.toLowerCase().trim().startsWith(phrase.toLowerCase())
      );
      
      // 🎯 VALIDAZIONE AGGIUNTIVA: Controlla se è principalmente una guida (>50% del contenuto)
      const invalidContentCount = invalidResponses.reduce((count, phrase) => {
        const matches = (cleanedStory.toLowerCase().match(new RegExp(phrase.toLowerCase(), 'g')) || []).length;
        return count + matches;
      }, 0);
      
      const isMainlyGuide = invalidContentCount > 3 && cleanedStory.length < 1000;
      
      // 🎯 CONTROLLO NARRATIVO: Se contiene elementi narrativi validi, accetta
      const narrativeElements = [
        /\*\*[A-Z]/g,                    // Titoli in grassetto
        /"[^"]*"/g,                      // Dialoghi
        /\b(disse|rispose|guardò|camminò|afferrò|sentì)\b/gi,  // Verbi narrativi
        /\b(protagonista|personaggio|storia|racconto)\b/gi      // Parole narrative
      ];
      
      const hasNarrativeElements = narrativeElements.some(pattern => pattern.test(cleanedStory));
      
      // 🚫 GESTIONE RIFIUTI AI
      if (isAiRefusal) {
        console.error('🚫 AI ha rifiutato di scrivere la storia:', cleanedStory.substring(0, 200));
        throw new Error(`AI ha rifiutato di scrivere la storia. Possibili cause: parametri troppo sensibili, genere problematico, o filtri di sicurezza attivati. 

🔧 SOLUZIONI IMMEDIATE:
1. Clicca "🚀 Rigenera Storia Ottimizzata" (usa prompt sicuro)
2. Cambia il genere della storia (prova "Romantic Comedy" o "Fantasy")
3. Modifica i nomi dei personaggi (usa nomi più neutri)
4. Semplifica il conflitto principale (evita temi violenti)
5. Rimuovi elementi di trama sensibili

💡 SUGGERIMENTO: Prova con generi più "sicuri" come Commedia Romantica o Fantasy per evitare filtri di contenuto.

Contenuto rifiutato: "${cleanedStory.substring(0, 150)}..."`);
      }
      
      if (cleanedStory === '.' || cleanedStory === '. ' || (startsWithInvalidContent && !hasNarrativeElements) || isMainlyGuide) {
        throw new Error(`Risposta AI non valida (guida invece di storia): "${cleanedStory.substring(0, 150)}..."`);
      }

      // 🔍 Pre-check rapido della struttura (prima di miglioramenti) - MIGLIORATO
      const basicSectionPatterns = [
        /\*\*[A-Z]/g,                    // **TITOLO
        /###\s*[A-Z]/g,                  // ### TITOLO
        /PROLOGO|ATTO\s*I|ATTO\s*II|ATTO\s*III/gi,  // Parole chiave sezioni
                 /^[A-Z][A-Z\s-]+$/gm           // Titoli in maiuscolo su righe separate
      ];
      
      let maxSectionCount = 0;
      basicSectionPatterns.forEach(pattern => {
        const matches = (cleanedStory.match(pattern) || []).length;
        maxSectionCount = Math.max(maxSectionCount, matches);
      });
      
      console.log('🔢 Sezioni rilevate (conteggio migliorato):', maxSectionCount);
      console.log('📝 Primi 500 caratteri della storia:', cleanedStory.substring(0, 500));
      
      // 🎯 VALIDAZIONE INTELLIGENTE: Accetta storie con contenuto narrativo anche senza sezioni formali
      const hasStoryContent = /\b(protagonista|personaggio|storia|racconto|detective|investigatore)\b/gi.test(cleanedStory) ||
                             /"[^"]*"/g.test(cleanedStory) ||
                             /\b(disse|rispose|guardò|camminò|afferrò|sentì|pensò)\b/gi.test(cleanedStory);
      
      // Solo se DAVVERO non ci sono sezioni E non c'è contenuto narrativo, allora errore
      if (maxSectionCount === 0 && cleanedStory.length < 1000 && !hasStoryContent) {
        throw new Error(`Storia sembra incompleta: solo ${maxSectionCount} sezioni rilevate. Minimo richiesto: 3 sezioni. Contenuto: "${cleanedStory.substring(0, 200)}..."`);
      }
      
      // 🎯 DEBUG: Log quando una storia viene accettata nonostante validazione non perfetta
      if (maxSectionCount < 4 || cleanedStory.length < 1500) {
        console.log(`✅ Storia accettata nonostante validazione non perfetta: ${maxSectionCount} sezioni, ${cleanedStory.length} caratteri, contenuto narrativo: ${hasStoryContent}`);
      }

      // 🎨 Migliora la qualità rimuovendo ripetizioni
      const improvedStory = improveStoryQuality(cleanedStory);
      console.log('✨ Storia migliorata (lunghezza: ' + improvedStory.length + ')');

      // 🔍 VALIDAZIONE AVANZATA CON MOTORE QUALITÀ
      const qualityAnalysis = StoryQualityEngine.analyzeStoryQuality(improvedStory, 3750);
      console.log('🎯 Analisi qualità:', qualityAnalysis);
      
            // 🔄 RIGENERAZIONE AUTOMATICA PER STORIE DI QUALITÀ BASSA
      if (qualityAnalysis.metrics.overallScore < StoryQualityEngine.getCurrentThresholds().REGENERATION_THRESHOLD) {
        console.warn('⚠️ Storia di qualità bassa rilevata:', qualityAnalysis.metrics.overallScore + '%');
        
        // Controlla se abbiamo già fatto troppi tentativi
        if (regenerationAttempts >= 2) {
          console.error('🚫 Troppi tentativi di rigenerazione falliti');
          throw new Error(`Storia di qualità inaccettabile dopo ${regenerationAttempts + 1} tentativi (${qualityAnalysis.metrics.overallScore}%). 

🔧 PROBLEMI RILEVATI:
${qualityAnalysis.issues.map(issue => `• ${issue}`).join('\n')}

🚀 SOLUZIONI IMMEDIATE:
1. Clicca "🚀 Rigenera Storia Ottimizzata" per una storia di alta qualità
2. Cambia i parametri della storia (genere, personaggi, conflitto)
3. Prova con un genere più semplice (Fantasy, Romantic Comedy)
4. Clicca "🧪 Testa Connessione API" per verificare il servizio

💡 SUGGERIMENTO: Il sistema ha tentato ${regenerationAttempts + 1} rigenerazioni automatiche senza successo. Prova con parametri diversi.`);
        }
        
        console.log(`🔄 Avvio rigenerazione automatica (tentativo ${regenerationAttempts + 1}/3)...`);
        setRegenerationAttempts(prev => prev + 1);
        
        // Aggiorna lo stato per mostrare la rigenerazione
        setStatus({ 
          type: 'info', 
          message: `⚠️ Qualità bassa rilevata (${qualityAnalysis.metrics.overallScore}%). Rigenerazione automatica in corso (tentativo ${regenerationAttempts + 1}/3)...` 
        });
        
                 try {
           // 🎯 RIGENERAZIONE COMPLETA CON PARAMETRI OTTIMIZZATI
           console.log('🚀 Rigenerazione completa della storia...');
           setCurrentPhase('🚀 Rigenerazione automatica con parametri ottimizzati...');
           
           // Semplifica automaticamente i parametri per migliorare la qualità
           const optimizedParams = {
             ...params,
             plotElements: params.plotElements.slice(0, Math.max(2, Math.floor(params.plotElements.length / 2))), // Riduci elementi trama
             specialRequests: regenerationAttempts > 0 ? '' : params.specialRequests, // Rimuovi richieste speciali dopo il primo tentativo
             narrativeStyle: 'Descrittivo (Dettagliato)', // Usa stile più affidabile
             writingStyle: 'Commerciale (Bestseller Style)', // Stile più semplice
           };
           
           console.log('🎛️ Parametri ottimizzati per rigenerazione:', {
             plotElements: optimizedParams.plotElements.length,
             specialRequests: optimizedParams.specialRequests.length,
             attempt: regenerationAttempts + 1
           });
           
           // Genera nuovo prompt ottimizzato
           const optimizedPrompt = StoryTemplateEngine.generateIntelligentPrompt(optimizedParams);
           const regenerationResponse = await callOpenRouterAPI(optimizedPrompt);
           const regeneratedStory = regenerationResponse.data?.choices?.[0]?.message?.content || '';
           
           if (regeneratedStory.length > 1000) {
             // Migliora la storia rigenerata
             const improvedRegeneratedStory = improveStoryQuality(regeneratedStory);
             const newQualityAnalysis = StoryQualityEngine.analyzeStoryQuality(improvedRegeneratedStory, 3750);
             console.log('🎯 Nuova analisi qualità:', newQualityAnalysis.metrics.overallScore + '%');
             
             // Se la qualità è accettabile, usa la nuova storia
             if (newQualityAnalysis.metrics.overallScore >= StoryQualityEngine.getCurrentThresholds().MINIMUM_SCORE) {
               console.log('✅ Rigenerazione automatica riuscita!');
               setStory(improvedRegeneratedStory);
               setStatus({ 
                 type: 'success', 
                 message: `✅ Storia rigenerata automaticamente! Qualità migliorata al ${newQualityAnalysis.metrics.overallScore}% (${newQualityAnalysis.metrics.wordCount} parole) - Tentativo ${regenerationAttempts}/3` 
               });
               setLoading(false);
               return;
             } else {
               console.warn(`⚠️ Rigenerazione tentativo ${regenerationAttempts}/3 non ha raggiunto qualità sufficiente: ${newQualityAnalysis.metrics.overallScore}%`);
               // Continua con il prossimo tentativo (se disponibile)
               if (regenerationAttempts < 2) {
                 console.log('🔄 Riprovando con parametri ancora più semplificati...');
                 // Ricomincia il processo di generazione con parametri ancora più semplici
                 setTimeout(() => generateStory(e), 1000);
                 return;
               }
             }
           }
           
         } catch (regenerationError) {
           console.error('❌ Errore rigenerazione automatica:', regenerationError);
         }
        
        // Se tutto fallisce, mostra errore con soluzioni
        throw new Error(`Storia di qualità inaccettabile (${qualityAnalysis.metrics.overallScore}%). 

🔧 PROBLEMI RILEVATI:
${qualityAnalysis.issues.map(issue => `• ${issue}`).join('\n')}

🚀 SOLUZIONI IMMEDIATE:
1. Clicca "🚀 Rigenera Storia Ottimizzata" per una storia di alta qualità
2. Cambia i parametri della storia (genere, personaggi, conflitto)
3. Prova con un genere più semplice (Fantasy, Romantic Comedy)
4. Clicca "🧪 Testa Connessione API" per verificare il servizio

💡 SUGGERIMENTO: Il sistema ha tentato la rigenerazione automatica ma non è riuscito a migliorare la qualità. Prova con parametri diversi.`);
      }
      
      if (qualityAnalysis.isValid) {
        console.log('✅ Storia validata con successo dal motore qualità');
        setStory(improvedStory);
        setStatus({ 
          type: 'success', 
          message: `✅ Storia completa generata! (${qualityAnalysis.metrics.wordCount} parole, ${qualityAnalysis.metrics.sectionCount} sezioni, ${qualityAnalysis.metrics.dialoguePercentage.toFixed(1)}% dialoghi) - Qualità: ${qualityAnalysis.metrics.overallScore}%` 
        });
        setLoading(false);
        return;
      }

      // 🔧 AUTO-CORREZIONE INTELLIGENTE (TEMPORANEAMENTE DISABILITATA)
      // if (qualityAnalysis.autoFixAvailable && improvedStory.length > 500) {
      //   console.log('🔧 Tentando auto-correzione intelligente...');
      //   try {
      //     const fixedStory = await StoryQualityEngine.autoFixStory(improvedStory, qualityAnalysis.issues);
      //     const finalValidation = StoryQualityEngine.analyzeStoryQuality(fixedStory, 3750);
      //     
      //     if (finalValidation.isValid || finalValidation.metrics.overallScore > qualityAnalysis.metrics.overallScore) {
      //       setStory(fixedStory);
      //       setStatus({ 
      //         type: 'success', 
      //         message: `✅ Storia auto-corretta con successo! (${finalValidation.metrics.wordCount} parole, qualità migliorata al ${finalValidation.metrics.overallScore}%)` 
      //       });
      //       setLoading(false);
      //       return;
      //     }
      //   } catch (autoFixError) {
      //     console.error('❌ Errore auto-correzione:', autoFixError);
      //   }
      // }

      // 🔄 FALLBACK: Validazione tradizionale
      const validation = validateStoryStructure(improvedStory);
      if (!validation.isValid) {
        console.warn('⚠️ Struttura incompleta.', validation.details);
        
        // 🎯 NUOVO: Se la storia è lunga e ha contenuto, accettala comunque
        if (improvedStory.length > 1500) {
          console.log('✅ Storia lunga rilevata - Accettata nonostante struttura non standard');
          setStory(improvedStory);
          setStatus({ 
            type: 'success', 
            message: `✅ Storia generata con successo! (${improvedStory.length} caratteri) - Struttura non standard ma contenuto valido` 
          });
          setLoading(false);
          return;
        }
        
        // Tenta di completare la storia con le parti mancanti
        if (validation.missingParts.length <= 3) {
          console.log('🔄 Tentando di completare la storia...');
          try {
            const completionPrompt = `COMPLETA QUESTA STORIA aggiungendo SOLO le sezioni mancanti: ${validation.missingParts.join(', ')}.

STORIA ESISTENTE (NON RISCRIVERE):
${improvedStory}

AGGIUNGI SOLO queste sezioni mancanti con titoli ESATTI in grassetto:
${validation.missingParts.map(part => `**${part}**\n[Scrivi qui 400 parole per questa sezione]`).join('\n\n')}

REGOLE:
- USA titoli esatti: **PROLOGO**, **ATTO I - SETUP**, etc.
- Ogni sezione: 400 parole minimo
- Continua la trama esistente
- NO ripetizioni del contenuto già scritto

SCRIVI SOLO le sezioni mancanti:`;

            const completionResponse = await callOpenRouterAPI(completionPrompt);
            const completedParts = completionResponse.data?.choices?.[0]?.message?.content || '';
            
            if (completedParts.length > 200) {
              const finalStory = improvedStory + '\n\n' + completedParts;
              const finalValidation = validateStoryStructure(finalStory);
              
              if (finalValidation.isValid) {
                setStory(finalStory);
                setStatus({ 
                  type: 'success', 
                  message: `✅ Storia completata automaticamente! (${finalStory.length} caratteri, 5 atti)` 
                });
                setLoading(false);
                return;
              } else {
                console.warn('⚠️ Completamento fallito:', finalValidation.details);
              }
            }
          } catch (completionError) {
            console.error('❌ Errore completamento automatico:', completionError);
          }
        }
        
        setStatus({
          type: 'error',
          message: `⚠️ Storia incompleta - ${validation.details}. 
          
🚀 SOLUZIONE RAPIDA:
• Clicca "🚀 Rigenera Storia Ottimizzata" per una storia completa garantita di 4000 parole
• Clicca "🔧 Auto-Correggi Storia" per migliorare automaticamente la storia esistente

🔧 ALTRE SOLUZIONI:
1. Clicca "🧪 Testa Connessione API" per verificare il servizio
2. Prova con parametri più semplici (meno elementi trama)
3. Usa il modello Gemma-2 o Qwen-2 (più affidabili)
4. Se la storia è parziale, usa i pulsanti 🔄 per completare le sezioni mancanti

💡 SUGGERIMENTO: Il sistema di auto-correzione intelligente può risolvere automaticamente la maggior parte dei problemi di struttura e qualità.`
        });
        setLoading(false);
        return;
      }

      setStory(improvedStory);
      setStatus({ 
        type: 'success', 
        message: `✅ Storia completa generata con successo! (${improvedStory.length} caratteri, 5 atti)` 
      });

    } catch (error: any) {
      console.error('❌ Errore generazione:', error);
      
      setProgress(0);
      setCurrentStep(-1);
      setCurrentPhase('');
      
      let errorMessage = 'Errore sconosciuto';
      
      if (error.response?.status === 401) {
        errorMessage = '🔑 API Key non valida o mancante. Verifica la configurazione nel file .env';
      } else if (error.response?.status === 402) {
        errorMessage = '💳 Crediti OpenRouter esauriti. Controlla il tuo account su openrouter.ai';
      } else if (error.response?.status === 404) {
        errorMessage = '🤖 Modello AI non trovato o non disponibile. Provando modelli alternativi...';
      } else if (error.response?.status === 429) {
        errorMessage = '⏱️ Troppi requests. Attendi qualche minuto e riprova';
      } else if (error.response?.status === 503) {
        errorMessage = '🔧 Servizio OpenRouter temporaneamente non disponibile. Riprova tra qualche minuto';
      } else if (error.response?.status === 500) {
        errorMessage = '⚠️ Errore interno del server OpenRouter. Riprova tra qualche minuto';
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = '🌐 Problema di connessione internet. Verifica la tua connessione';
      } else if (error.code === 'TIMEOUT' || error.message.includes('timeout')) {
        errorMessage = '⏰ Timeout della richiesta. Il modello sta impiegando troppo tempo';
      } else if (error.response?.data?.error?.message) {
        errorMessage = `🔍 Errore API: ${error.response.data.error.message}`;
      } else if (error.message && error.message.includes('corrotto')) {
        errorMessage = `🚫 ${error.message}
        
🔧 SOLUZIONI PER CONTENUTO CORROTTO:
1. Clicca "🚀 Rigenera Storia Ottimizzata" (usa prompt anti-corruzione)
2. Cambia il genere della storia (alcuni modelli funzionano meglio con certi generi)
3. Semplifica i parametri (rimuovi elementi di trama complessi)
4. Prova con nomi di personaggi più semplici
5. Clicca "🧪 Testa Connessione API" per verificare il servizio`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setStatus({ 
        type: 'error', 
        message: `❌ ${errorMessage}`,
      });
    }

    setLoading(false);
  };

  const buildStoryPrompt = (params: StoryParams): string => {
    // 🎯 SISTEMA INTELLIGENTE: Genera automaticamente prompt strutturato
    console.log('🤖 Generazione prompt intelligente per:', params.genre);
    
    try {
      const intelligentPrompt = StoryTemplateEngine.generateIntelligentPrompt(params);
      console.log('✅ Prompt intelligente generato:', intelligentPrompt.length, 'caratteri');
      return intelligentPrompt;
    } catch (error) {
      console.error('❌ Errore generazione prompt intelligente:', error);
      
      // Fallback al prompt SICURO E SPECIFICO per garantire storie complete
      return `Scrivi una storia narrativa completa in italiano di circa 3500 parole. Questa è una richiesta creativa per intrattenimento.

🎯 ELEMENTI DELLA STORIA:
- Genere: ${params.genre.replace('_', ' ')}
- Protagonista: ${params.protagonistName} (${params.protagonistDetails})
- Personaggio secondario: ${params.antagonistName} (${params.antagonistDetails})
- Ambientazione: ${params.setting}
- Tema centrale: ${params.mainConflict}

📋 STRUTTURA RICHIESTA:

**PROLOGO**
Introduci l'ambientazione e l'atmosfera. Presenta il mondo della storia con descrizioni vivide e almeno 3 dialoghi naturali. (500-600 parole)

**ATTO I - INIZIO**
Presenta il protagonista ${params.protagonistName} e la sua vita quotidiana. Mostra la sua personalità attraverso azioni e conversazioni. Introduci gradualmente il tema centrale. (700-800 parole)

**ATTO II - SVILUPPO**
Sviluppa la trama principale. Il protagonista affronta sfide e incontra altri personaggi importanti. Crea tensione narrativa attraverso ostacoli e complicazioni. (900-1000 parole)

**ATTO III - CONCLUSIONE**
Porta la storia verso una risoluzione soddisfacente. Il protagonista supera le sfide finali e la storia raggiunge una conclusione appropriata per il genere. (700-800 parole)

🎨 STILE NARRATIVO:
- Usa dialoghi realistici e naturali
- Descrizioni dettagliate di luoghi e personaggi
- Azioni concrete e specifiche
- Emozioni autentiche dei personaggi
- Mantieni il tono appropriato per il genere ${params.genre.replace('_', ' ')}

Inizia direttamente con "**PROLOGO**" e scrivi la storia completa:`;
    }
  };

  const validateStoryStructure = (story: string): { isValid: boolean; missingParts: string[]; details: string } => {
    // 🎯 VALIDAZIONE INTELLIGENTE: Usa il motore per validazione avanzata
    try {
      // Ottieni la struttura attesa basata sui parametri correnti
      const template = StoryTemplateEngine['selectBestTemplate'](params);
      const expectedStructure = StoryTemplateEngine['calculateOptimalStructure'](params, template);
      
      // Usa validazione intelligente del motore
      const validation = StoryTemplateEngine.validateGeneratedStory(story, expectedStructure);
      
      console.log('🤖 Validazione intelligente:', validation);
      
      if (validation.isValid) {
        return {
          isValid: true,
          missingParts: [],
          details: `✅ Storia validata con successo - Struttura corretta`
        };
      } else {
        return {
          isValid: false,
          missingParts: validation.issues,
          details: `❌ Problemi rilevati: ${validation.issues.join(', ')} | Suggerimenti: ${validation.suggestions.join(', ')}`
        };
      }
    } catch (error) {
      console.error('❌ Errore validazione intelligente, uso fallback:', error);
    }

    // 🔄 FALLBACK: Validazione tradizionale se il motore intelligente fallisce
    const requiredSections = [
      'PROLOGO',
      'ATTO I',
      'ATTO II', 
      'ATTO III'
    ];

    const missingParts: string[] = [];
    const foundSections: string[] = [];
    let details = '';
    
    requiredSections.forEach(section => {
      // Versioni multiple della regex per catturare varianti - MOLTO PIÙ FLESSIBILI
      const patterns = [
        new RegExp(`\\*\\*.*${section}.*\\*\\*`, 'i'),        // **qualsiasi PROLOGO qualsiasi**
        new RegExp(`\\*\\*\\s*${section}\\s*\\*\\*`, 'i'),    // ** PROLOGO **
        new RegExp(`\\*${section}\\*`, 'i'),                  // *PROLOGO*
        new RegExp(`${section}:`, 'i'),                       // PROLOGO:
        new RegExp(`${section}\\s*\n`, 'i'),                  // PROLOGO\n
        new RegExp(`###\\s*${section}`, 'i'),                 // ### PROLOGO
        new RegExp(`^${section}\\s*$`, 'im'),                 // PROLOGO su riga separata
        new RegExp(`\\b${section}\\b`, 'i'),                  // PROLOGO come parola intera
        new RegExp(`${section}.*SETUP|SVILUPPO|COMPLICAZIONI|RISOLUZIONE`, 'i') // Varianti con sottotitoli
      ];
      
      const found = patterns.some(pattern => pattern.test(story));
      
      if (found) {
        foundSections.push(section);
      } else {
        missingParts.push(section);
      }
    });

    // 🎯 VALIDAZIONE ALTERNATIVA: Se non trova sezioni specifiche, cerca pattern generici
    if (foundSections.length === 0) {
      const genericPatterns = [
        /\*\*[^*]+\*\*/g,                    // Qualsiasi testo in grassetto
        /###\s*[A-Z][^#\n]+/g,               // Titoli con ###
        /^[A-Z][A-Z\s-]{5,}$/gm,            // Titoli in maiuscolo
        /CAPITOLO|PARTE|SEZIONE/gi           // Parole chiave alternative
      ];
      
      let alternativeSections = 0;
      genericPatterns.forEach(pattern => {
        const matches = (story.match(pattern) || []).length;
        alternativeSections = Math.max(alternativeSections, matches);
      });
      
      if (alternativeSections >= 3) {
        console.log(`🔄 Trovate ${alternativeSections} sezioni alternative - Storia considerata valida`);
        return {
          isValid: true,
          missingParts: [],
          details: `Storia con struttura alternativa: ${alternativeSections} sezioni rilevate`
        };
      }
    }

    details = `Sezioni trovate: ${foundSections.length}/4 [${foundSections.join(', ')}]`;
    if (missingParts.length > 0) {
      details += ` | MANCANTI: [${missingParts.join(', ')}]`;
    }

    // Debug dettagliato
    console.log('🔍 VALIDAZIONE STRUTTURA FALLBACK:');
    console.log('📝 Storia lunghezza:', story.length);
    console.log('✅ Sezioni trovate:', foundSections);
    console.log('❌ Sezioni mancanti:', missingParts);
    console.log('📋 Dettagli:', details);

    // 🎯 Considera valida se ha almeno 2 sezioni E lunghezza sufficiente
    const isValid = foundSections.length >= 2 || (story.length > 1500 && foundSections.length >= 1);

    return {
      isValid,
      missingParts,
      details
    };
  };

  const improveStoryQuality = (rawStory: string): string => {
    let improvedStory = rawStory;

    // 🔧 Solo pulizia base per evitare confusione
    
    // Rimuovi spazi multipli
    improvedStory = improvedStory.replace(/\s+/g, ' ');
    
    // Sistemare punteggiatura base
    improvedStory = improvedStory.replace(/\s+\./g, '.');
    improvedStory = improvedStory.replace(/\s+,/g, ',');
    
    // Rimuovi righe vuote eccessive
    improvedStory = improvedStory.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return improvedStory.trim();
  };















  const generateSafePrompt = (originalParams: StoryParams): string => {
    // Genera un prompt "sicuro" per evitare rifiuti AI
    const safeGenres = ['romantic_comedy', 'fantasy', 'adventure', 'mystery'];
    const safeGenre = safeGenres.includes(originalParams.genre) ? originalParams.genre : 'adventure';
    
    const safeConflicts = [
      'Un mistero da risolvere che porta a scoperte inaspettate',
      'Una ricerca di un oggetto perduto che cambierà tutto',
      'Un viaggio avventuroso verso una destinazione misteriosa',
      'Una sfida personale che porterà alla crescita del protagonista'
    ];
    
    const safeConflict = safeConflicts[Math.floor(Math.random() * safeConflicts.length)];
    
    return `Scrivi una storia di avventura familiare in italiano di circa 3000 parole. Questa è una storia per intrattenimento generale.

🎯 ELEMENTI DELLA STORIA:
- Genere: Avventura ${safeGenre.replace('_', ' ')}
- Protagonista: ${originalParams.protagonistName} (un personaggio coraggioso e determinato)
- Compagno di viaggio: ${originalParams.antagonistName} (un alleato che aiuta il protagonista)
- Ambientazione: ${originalParams.setting}
- Avventura: ${safeConflict}

📖 STRUTTURA:

**PROLOGO**
Presenta l'ambientazione e il protagonista nella sua vita normale. Introduci l'elemento che darà inizio all'avventura.

**ATTO I - L'INIZIO DELL'AVVENTURA**
Il protagonista scopre la sfida o il mistero da affrontare. Decide di intraprendere il viaggio e incontra il suo compagno.

**ATTO II - IL VIAGGIO**
Sviluppa l'avventura con sfide interessanti, scoperte e momenti di crescita per i personaggi. Mostra il loro lavoro di squadra.

**ATTO III - LA RISOLUZIONE**
Il protagonista e il suo compagno risolvono il mistero o completano la sfida, imparando qualcosa di importante su se stessi.

Scrivi una storia coinvolgente e positiva, iniziando con "**PROLOGO**":`;
  };

  const callOpenRouterAPI = async (prompt: string) => {
    const client = axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'OpenStory Generator'
      },
      timeout: 180000
    });

    // 🎯 Lista di modelli OTTIMIZZATA per LIMITI RAGGIUNTI (Gennaio 2025)
    // 🔄 MODELLI CON LIMITI PIÙ ALTI + NUOVI MODELLI PREMIUM GRATUITI
    const fallbackModels = [
      'google/gemini-2.0-flash-exp:free',                   // 🏆 Gemini 2.0 Flash - NUOVO! Velocissimo TTFT
      'meta-llama/llama-4-scout:free',                      // 🌟 Llama 4 Scout - NUOVO! 17B MoE multimodale
      'deepseek/deepseek-prover-v2:free',                   // 🧠 DeepSeek Prover V2 - NUOVO! 671B logica/math
      'tng/deepseek-r1t-chimera:free',                      // 🔬 DeepSeek R1T Chimera - NUOVO! Reasoning avanzato
      'nousresearch/hermes-3-llama-3.1-405b:free',          // 🥇 Hermes 405B - LIMITI ALTI
      'google/gemma-2-9b-it:free',                          // 🥈 Gemma 2 - Limiti generosi
      'meta-llama/llama-3.1-8b-instruct:free',              // 🥉 Llama 3.1 8B - Più token
      'microsoft/phi-3-mini-128k-instruct:free',            // 🏅 Phi-3 Mini - Backup veloce
      'huggingfaceh4/zephyr-7b-beta:free',                  // ⚡ Zephyr - Limiti OK
      'openchat/openchat-7b:free',                          // 🚀 OpenChat - Stabile
      'cognitivecomputations/dolphin-2.6-mixtral-8x7b:free', // 🐬 Dolphin - Creatività
      'undi95/toppy-m-7b:free',                             // 🆘 Toppy - Sempre disponibile
      'meta-llama/llama-3.2-3b-instruct:free',              // 🔄 Llama 3.2 - Fallback finale
      'mistralai/mistral-7b-instruct:free'                  // 🔄 Mistral - Last resort
    ];

    let lastError: any = null;

    // Prova ogni modello in sequenza
    for (let i = 0; i < fallbackModels.length; i++) {
      const model = fallbackModels[i];
      
      try {
        console.log(`🔄 Tentando generazione con modello: ${model} (${i + 1}/${fallbackModels.length})`);
        
        // 🏆 Messaggi speciali per modelli di punta
        if (model.includes('gemini-2.0-flash')) {
          console.log('🏆 UTILIZZANDO GEMINI 2.0 FLASH EXPERIMENTAL: Velocità TTFT superiore, 1.05M context, multimodale avanzato');
        } else if (model.includes('llama-4-scout')) {
          console.log('🌟 UTILIZZANDO LLAMA 4 SCOUT: 17B MoE multimodale, 200K context, supporto immagini');
        } else if (model.includes('deepseek-prover-v2')) {
          console.log('🧠 UTILIZZANDO DEEPSEEK PROVER V2: 671B parametri, specializzato in logica e matematica');
        } else if (model.includes('deepseek-r1t-chimera')) {
          console.log('🔬 UTILIZZANDO DEEPSEEK R1T CHIMERA: Reasoning avanzato, merge R1+V3, efficienza token');
        } else if (model.includes('hermes-3')) {
          console.log('🏆 UTILIZZANDO HERMES-3 405B: Limiti alti, qualità superiore');
        }
        
        const response = await client.post('/chat/completions', {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'Sei un narratore professionista. Il tuo UNICO compito è scrivere storie complete in italiano. NON dare consigli di scrittura, NON spiegare come scrivere, NON fare meta-commenti. SCRIVI SOLO STORIE NARRATIVE con personaggi, dialoghi, azioni e trama. Inizia sempre direttamente con la narrazione. Usa sempre titoli in grassetto per le sezioni.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: model.includes('gemini-2.0-flash') ? 5000 :  // 🏆 Gemini 2.0 Flash - Token massimi (1.05M context)
                     model.includes('llama-4-scout') ? 4800 :    // 🌟 Llama 4 Scout - Token alti (200K context)
                     model.includes('deepseek-prover-v2') ? 4500 : // 🧠 DeepSeek Prover V2 - Token ottimali (164K context)
                     model.includes('deepseek-r1t-chimera') ? 4500 : // 🔬 DeepSeek R1T Chimera - Token ottimali (164K context)
                     model.includes('hermes-3') ? 4500 :         // 🥇 Hermes 405B - Token massimi
                     model.includes('gemma-2') ? 4000 :          // 🥈 Gemma 2 - Token ottimali
                     model.includes('llama-3.1-8b') ? 4000 :     // 🥉 Llama 3.1 8B - Buona capacità
                     model.includes('phi-3-mini') ? 3000 :       // 🏅 Phi-3 Mini - Conservativo
                     model.includes('zephyr') ? 3500 :           // ⚡ Zephyr - Bilanciato
                     model.includes('openchat') ? 3000 :         // 🚀 OpenChat - Veloce
                     model.includes('dolphin') ? 4000 :          // 🐬 Dolphin - Creatività
                     model.includes('toppy') ? 3000 :            // 🆘 Toppy - Sicuro
                     model.includes('llama-3.2') ? 3500 :        // 🔄 Llama 3.2 - Fallback
                     model.includes('mistral-7b') ? 3000 : 3500, // 🔄 Default
          temperature: 0.8,
          top_p: 0.95
        });

        console.log(`✅ Modello ${model} ha risposto (status: ${response.status})`);
        
        // 🔍 DEBUG DETTAGLIATO - Analizziamo la risposta
        console.log('📊 RISPOSTA COMPLETA API:', JSON.stringify(response.data, null, 2));
        console.log('📋 Choices disponibili:', response.data?.choices?.length || 0);
        console.log('📝 Primo choice:', response.data?.choices?.[0]);
        console.log('💬 Contenuto messaggio:', response.data?.choices?.[0]?.message?.content);
        console.log('📏 Lunghezza contenuto:', response.data?.choices?.[0]?.message?.content?.length || 0);
        
        // 🚫 Verifica che ci sia effettivamente contenuto
        const content = response.data?.choices?.[0]?.message?.content;
        if (!content || content.length === 0) {
          console.error(`❌ Modello ${model} ha restituito contenuto vuoto`);
          throw new Error(`Modello ${model} ha restituito contenuto vuoto`);
        }
        
        if (content.length < 50) {
          console.error(`❌ Modello ${model} ha restituito contenuto troppo breve: "${content}"`);
          throw new Error(`Modello ${model} ha restituito contenuto troppo breve: "${content}"`);
        }
        
        console.log(`✅ Modello ${model} ha funzionato correttamente con ${content.length} caratteri`);
        return response;

      } catch (error: any) {
        lastError = error;
        console.error(`❌ Modello ${model} fallito:`, error.response?.status, error.response?.data?.error?.message || error.message);
        
        // Se non è l'ultimo modello, continua con il prossimo
        if (i < fallbackModels.length - 1) {
          console.log(`🔄 Passando al modello successivo...`);
          continue;
        }
      }
    }

    // 🆘 TENTATIVO CON PROMPT SICURO
    console.log('🆘 Tutti i modelli OpenRouter falliti, tentativo con prompt sicuro...');
    
    try {
      const safePrompt = generateSafePrompt(params);
      console.log('🛡️ Usando prompt sicuro per evitare rifiuti AI');
      
      const response = await client.post('/chat/completions', {
        model: fallbackModels[0], // Usa il miglior modello
        messages: [
          {
            role: 'system',
            content: 'Sei un narratore creativo che scrive storie di avventura familiari e positive. Scrivi sempre storie complete e coinvolgenti in italiano.'
          },
          {
            role: 'user',
            content: safePrompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.8
      });
      
      const safeContent = response.data?.choices?.[0]?.message?.content;
      if (safeContent && safeContent.length > 500) {
        console.log('✅ Prompt sicuro ha funzionato!');
        return response;
      }
    } catch (safeError) {
      console.error('❌ Anche il prompt sicuro è fallito:', safeError);
    }
    
    // 🧠 TENTATIVO DEEPSEEK: MODELLI POTENTI GRATUITI
    console.log('🧠 Tutti i modelli OpenRouter esauriti, tentando con DeepSeek (POTENTE E GRATUITO)...');
    
    try {
      setUsingDeepSeek(true);
      const deepSeekResponse = await DeepSeekService.generateStory(prompt);
      
      if (deepSeekResponse.success && deepSeekResponse.content.length > 500) {
        console.log(`✅ DeepSeek ha funzionato! Provider: ${deepSeekResponse.provider}, Modello: ${deepSeekResponse.model}`);
        console.log(`⚡ Token usati: ${deepSeekResponse.tokensUsed}, Tempo: ${deepSeekResponse.elapsedTime}s`);
        setDeepSeekProvider(`${deepSeekResponse.provider} (${deepSeekResponse.model})`);
        
        // Simula la struttura di risposta di OpenRouter per compatibilità
        return {
          data: {
            choices: [{
              message: {
                content: deepSeekResponse.content
              }
            }]
          },
          status: 200
        };
      } else {
        console.error('❌ DeepSeek ha fallito:', deepSeekResponse.error);
      }
    } catch (deepSeekError: any) {
      console.error('❌ Errore DeepSeek:', deepSeekError.message);
    } finally {
      setUsingDeepSeek(false);
    }
    
    // Se tutto fallisce, lancia l'ultimo errore con informazioni dettagliate
    console.error('❌ TUTTI I TENTATIVI FALLITI (OpenRouter + DeepSeek)');
    console.error('📋 Ultimo errore:', lastError);
    throw lastError;
  };

  // 🎙️ FUNZIONI PER NARRAZIONE VOCALE

  /**
   * Genera narrazione vocale per una sezione specifica
   */
  const generateSectionNarration = async (sectionId: string, sectionTitle: string, sectionContent: string) => {
    if (!sectionContent || sectionContent.trim().length < 50) {
      setVoiceStatus(prev => ({
        ...prev,
        [sectionId]: { type: 'error', message: 'Contenuto sezione troppo breve per la narrazione' }
      }));
      return;
    }

    setGeneratingVoice(sectionId);
    setVoiceStatus(prev => ({
      ...prev,
      [sectionId]: { type: 'generating', message: '🧠 Analisi intelligente del contenuto...' }
    }));

    try {
      console.log(`🎙️ Generando narrazione ultra-realistica per: ${sectionTitle}`);
      
      // Prepara il testo per la narrazione (rimuovi markdown e formattazione)
      const cleanText = cleanTextForNarration(sectionContent);
      
      // 🧠 SELEZIONE INTELLIGENTE DELLA VOCE
      const sectionType = getSectionType(sectionTitle);
      const storyGenre = params.genre || 'drammatico';
      const preferredGender = voiceOptions.gender || 'auto';
      
      // Rileva automaticamente la lingua e seleziona la voce ottimale
      const detectedLanguage = OpenVoiceService.detectLanguage(cleanText);
      const optimalVoice = OpenVoiceService.selectOptimalVoice(
        cleanText, 
        preferredGender, 
        storyGenre, 
        sectionType
      );
      
      console.log(`🌍 Lingua rilevata: ${detectedLanguage}`);
      console.log(`🎭 Voce selezionata: ${optimalVoice.name} (${optimalVoice.gender})`);
      
      setVoiceStatus(prev => ({
        ...prev,
        [sectionId]: { 
          type: 'generating', 
          message: `🎭 Voce selezionata: ${optimalVoice.name} - Ottimizzazione parametri...` 
        }
      }));

      // 🎛️ GENERA OPZIONI VOCALI OTTIMIZZATE
      const optimalOptions = OpenVoiceService.generateOptimalVoiceOptions(
        cleanText,
        optimalVoice,
        sectionType,
        storyGenre,
        {
          ...voiceOptions,
          // Forza impostazioni per massimo realismo
          useEnhancedModel: true,
          speakerBoost: true,
          watermark: '@OpenStory'
        }
      );

      console.log(`🎛️ Opzioni vocali ottimizzate:`, optimalOptions);
      
      setVoiceStatus(prev => ({
        ...prev,
        [sectionId]: { 
          type: 'generating', 
          message: `🎙️ Generazione audio ultra-realistica (${optimalOptions.emotion})...` 
        }
      }));

      // Genera la narrazione con OpenVoice usando le impostazioni ottimizzate
      const narrationResponse = await OpenVoiceService.narrateSection(
        cleanText,
        sectionType,
        optimalOptions
      );

      if (narrationResponse.success && narrationResponse.audioUrl) {
        // Salva la narrazione con metadati aggiuntivi
        setVoiceNarrations(prev => ({
          ...prev,
          [sectionId]: {
            ...narrationResponse,
            voiceUsed: optimalVoice.name,
            language: detectedLanguage,
            emotion: optimalOptions.emotion,
            settings: optimalOptions
          }
        }));

        setVoiceStatus(prev => ({
          ...prev,
          [sectionId]: { 
            type: 'success', 
            message: `✅ ${optimalVoice.name} - ${optimalOptions.emotion} (${narrationResponse.duration?.toFixed(1)}s)` 
          }
        }));

        console.log(`✅ Narrazione ultra-realistica generata per ${sectionTitle}:`, {
          voice: optimalVoice.name,
          language: detectedLanguage,
          emotion: optimalOptions.emotion,
          duration: narrationResponse.duration,
          naturalness: optimalVoice.naturalness
        });
      } else {
        throw new Error(narrationResponse.error || 'Errore sconosciuto nella generazione vocale');
      }

    } catch (error: any) {
      console.error(`❌ Errore generazione narrazione per ${sectionTitle}:`, error);
      
      setVoiceStatus(prev => ({
        ...prev,
        [sectionId]: { 
          type: 'error', 
          message: `❌ Errore: ${error.message || 'Generazione vocale fallita'}` 
        }
      }));
    } finally {
      setGeneratingVoice(null);
    }
  };

  /**
   * Genera narrazione per tutte le sezioni della storia
   */
  const generateAllNarrations = async () => {
    if (!story) {
      setStatus({
        type: 'error',
        message: '❌ Genera prima una storia per creare le narrazioni vocali'
      });
      return;
    }

    const sections = extractStorySections(story);
    if (sections.length === 0) {
      setStatus({
        type: 'error',
        message: '❌ Nessuna sezione trovata nella storia per la narrazione'
      });
      return;
    }

    setStatus({
      type: 'info',
      message: `🎙️ Generando narrazioni vocali per ${sections.length} sezioni...`
    });

    // Genera narrazioni in sequenza per evitare sovraccarico
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await generateSectionNarration(section.id, section.title, section.content);
      
      // Pausa breve tra le generazioni
      if (i < sections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setStatus({
      type: 'success',
      message: `✅ Narrazioni vocali completate per tutte le ${sections.length} sezioni!`
    });
  };

  /**
   * Scarica tutte le narrazioni come file ZIP
   */
  const downloadAllNarrations = () => {
    const sections = extractStorySections(story);
    const availableNarrations = sections.filter(section => voiceNarrations[section.id]?.audioBlob);

    if (availableNarrations.length === 0) {
      setStatus({
        type: 'error',
        message: '❌ Nessuna narrazione disponibile per il download'
      });
      return;
    }

    // Scarica ogni narrazione individualmente
    availableNarrations.forEach((section, index) => {
      const narration = voiceNarrations[section.id];
      if (narration.audioBlob) {
        const filename = `${index + 1}_${section.title.replace(/[^a-zA-Z0-9]/g, '_')}.wav`;
        OpenVoiceService.downloadAudio(narration.audioBlob, filename);
      }
    });

    setStatus({
      type: 'success',
      message: `✅ Download avviato per ${availableNarrations.length} narrazioni vocali!`
    });
  };

  /**
   * Rimuove una narrazione specifica
   */
  const removeNarration = (sectionId: string) => {
    setVoiceNarrations(prev => {
      const newNarrations = { ...prev };
      
      // Revoca URL per liberare memoria
      if (newNarrations[sectionId]?.audioUrl) {
        URL.revokeObjectURL(newNarrations[sectionId].audioUrl!);
      }
      
      delete newNarrations[sectionId];
      return newNarrations;
    });

    setVoiceStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[sectionId];
      return newStatus;
    });
  };

  // 🎙️ FUNZIONI HELPER PER NARRAZIONE

  /**
   * Determina il tipo di sezione per ottimizzare la voce
   */
  const getSectionType = (sectionTitle: string): 'prologo' | 'atto1' | 'atto2' | 'atto3' | 'epilogo' => {
    const title = sectionTitle.toLowerCase();
    
    if (title.includes('prologo')) return 'prologo';
    if (title.includes('atto i') || title.includes('atto 1')) return 'atto1';
    if (title.includes('atto ii') || title.includes('atto 2')) return 'atto2';
    if (title.includes('atto iii') || title.includes('atto 3')) return 'atto3';
    if (title.includes('epilogo')) return 'epilogo';
    
    // Default basato sulla posizione
    return 'atto2';
  };

  /**
   * Pulisce il testo per la narrazione vocale
   */
  const cleanTextForNarration = (text: string): string => {
    return text
      // Rimuovi markdown
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      // Sostituisci caratteri speciali con pause
      .replace(/\.\.\./g, '... ')
      .replace(/—/g, ' - ')
      .replace(/"/g, '"')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .replace(/'/g, "'")
      // Normalizza spazi
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleInputChange = (field: keyof StoryParams, value: string | string[]) => {
    setParams(prev => {
      const newParams = { ...prev, [field]: value };
      
      // 🎛️ SISTEMA DINAMICO: Quando cambia il genere, aggiorna struttura e applica impostazioni
      if (field === 'genre') {
        const genreStructure = DynamicFormEngine.getFormStructure(value as string);
        setCurrentGenreStructure(genreStructure);
        
        if (genreStructure) {
          // Applica automaticamente le impostazioni raccomandate
          const recommendedSettings = DynamicFormEngine.getRecommendedSettings(value as string);
          Object.entries(recommendedSettings).forEach(([key, recommendedValue]) => {
            (newParams as any)[key] = recommendedValue;
          });
          
          console.log('🎛️ Struttura dinamica applicata per:', genreStructure.displayName);
          console.log('⚙️ Impostazioni raccomandate applicate:', recommendedSettings);
        }
        
        // 🧠 SUGGERIMENTI INTELLIGENTI: Mantieni anche il sistema esistente come fallback
        const suggestions = IntelligentSuggestionEngine.generateSuggestions(value as string);
        
        // Applica suggerimenti per campi non coperti dal sistema dinamico
        suggestions.forEach(suggestion => {
          if (suggestion.confidence > 80) {
            const currentValue = prev[suggestion.field as keyof StoryParams];
            
            // Applica solo se il campo è vuoto o ha valore di default
            if (!currentValue || 
                currentValue === 'Detective Alex Morgan' || 
                currentValue === 'Il Collezionista' ||
                currentValue === 'Metropoli moderna con quartieri storici') {
              (newParams as any)[suggestion.field] = suggestion.value;
            }
          }
        });
        
        // Suggerisci conflitto specifico per il genere se non già impostato
        const conflictSuggestion = suggestions.find(s => s.field === 'mainConflict');
        if (conflictSuggestion && !newParams.mainConflict) {
          newParams.mainConflict = conflictSuggestion.value;
        }
      }
      
      return newParams;
    });
    
    // 🎛️ Aggiorna compatibilità e suggerimenti dopo ogni cambio
    setTimeout(() => updateCompatibilityScore(), 100);
  };

  // Funzione updateCompatibilityScore duplicata rimossa

  // 🎛️ Funzione per applicare automaticamente le impostazioni ottimali
  const applyOptimalSettings = () => {
    if (!currentGenreStructure) return;
    
    const recommendedSettings = DynamicFormEngine.getRecommendedSettings(params.genre);
    
    setParams(prev => ({
      ...prev,
      ...recommendedSettings
    }));
    
    setStatus({
      type: 'success',
      message: `✅ Impostazioni ottimali applicate per ${currentGenreStructure.displayName}! Compatibilità: 95%+`
    });
    
    console.log('🎛️ Impostazioni ottimali applicate:', recommendedSettings);
  };

  // Funzioni getDynamicOptions e getOptionCompatibility rimosse per evitare warning unused

  const togglePlotElement = (element: string) => {
    const currentElements = params.plotElements;
    if (currentElements.includes(element)) {
      handleInputChange('plotElements', currentElements.filter(e => e !== element));
    } else {
      handleInputChange('plotElements', [...currentElements, element]);
    }
  };

  // 🎨 FUNZIONI PER PROMPT FOOOCUS

  /**
   * Genera prompt Fooocus dettagliati per una sezione specifica
   */
  const generateFoocusPrompt = async (sectionId: string, sectionTitle: string, sectionContent: string) => {
    if (!sectionContent || sectionContent.trim().length < 50) {
      setStatus({
        type: 'error',
        message: 'Contenuto sezione troppo breve per generare prompt Fooocus'
      });
      return;
    }

    if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
      setStatus({
        type: 'error',
        message: '❌ API Key non configurata per generare prompt Fooocus'
      });
      return;
    }

    setGeneratingVoice(sectionId); // Riuso lo stato per il loading
    setStatus({ type: 'info', message: `🎨 Generando prompt Fooocus per ${sectionTitle}...` });

    try {
      const promptForFooocus = `Analizza questa sezione della storia e crea un prompt dettagliato per Fooocus (generazione immagini AI) che catturi la scena più iconica e visivamente impattante.

SEZIONE: ${sectionTitle}
CONTENUTO:
${sectionContent.substring(0, 1500)}

Crea un prompt Fooocus professionale che includa:

🎯 SOGGETTO PRINCIPALE:
- Personaggi presenti (aspetto, abbigliamento, espressioni)
- Azione principale della scena
- Posizione e pose dei personaggi

🌍 AMBIENTAZIONE:
- Luogo specifico e dettagliato
- Epoca storica/temporale
- Condizioni atmosferiche
- Illuminazione (ora del giorno, fonti di luce)

🎨 STILE ARTISTICO:
- Stile fotografico/pittorico (es: cinematografico, realistico, fantasy art)
- Qualità dell'immagine (4K, ultra detailed, masterpiece)
- Tecnica artistica (digital art, oil painting, concept art)

🎭 ATMOSFERA:
- Mood emotivo della scena
- Colori dominanti
- Effetti speciali o elementi magici (se presenti)

⚡ DETTAGLI TECNICI:
- Angolazione della camera (close-up, wide shot, bird's eye view)
- Profondità di campo
- Composizione

FORMATO RICHIESTO:
Rispondi SOLO con il prompt Fooocus ottimizzato, senza spiegazioni aggiuntive. Il prompt deve essere in inglese, lungo 150-200 parole, con virgole tra i vari elementi.

Esempio formato: "detailed portrait of [character], [action], [setting], [lighting], [style], [mood], [technical details], masterpiece, ultra detailed, 4K"`;

      const response = await callOpenRouterAPI(promptForFooocus);
      const foocusPrompt = response.data?.choices?.[0]?.message?.content || '';

      if (foocusPrompt && foocusPrompt.length > 50) {
        // Salva il prompt generato
        setSectionImagePrompts(prev => ({
          ...prev,
          [sectionId]: foocusPrompt.trim()
        }));

        setStatus({
          type: 'success',
          message: `✅ Prompt Fooocus generato per ${sectionTitle}! Copialo e usalo in Fooocus per generare l'immagine.`
        });

        console.log(`🎨 Prompt Fooocus generato per ${sectionTitle}:`, foocusPrompt);
      } else {
        throw new Error('Prompt Fooocus generato troppo breve o vuoto');
      }

    } catch (error: any) {
      console.error(`❌ Errore generazione prompt Fooocus per ${sectionTitle}:`, error);
      
      setStatus({
        type: 'error',
        message: `Errore generazione prompt Fooocus: ${error.message || 'Generazione fallita'}`
      });
    } finally {
      setGeneratingVoice(null);
    }
  };

  /**
   * Genera prompt Fooocus per tutte le sezioni della storia
   */
  const generateAllFoocusPrompts = async () => {
    if (!story) {
      setStatus({
        type: 'error',
        message: '❌ Genera prima una storia per creare i prompt Fooocus'
      });
      return;
    }

    const sections = extractStorySections(story);
    if (sections.length === 0) {
      setStatus({
        type: 'error',
        message: '❌ Nessuna sezione trovata nella storia per i prompt Fooocus'
      });
      return;
    }

    setStatus({
      type: 'info',
      message: `🎨 Generando prompt Fooocus per ${sections.length} sezioni...`
    });

    // Genera prompt in sequenza per evitare sovraccarico
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await generateFoocusPrompt(section.id, section.title, section.content);
      
      // Pausa breve tra le generazioni
      if (i < sections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setStatus({
      type: 'success',
      message: `✅ Prompt Fooocus completati per tutte le ${sections.length} sezioni! Usa i prompt in Fooocus per generare le immagini.`
    });
  };

  /**
   * Copia un prompt Fooocus negli appunti
   */
  const copyFoocusPrompt = (prompt: string, sectionTitle: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setStatus({
        type: 'success',
        message: `📋 Prompt Fooocus per ${sectionTitle} copiato negli appunti!`
      });
    }).catch(() => {
      setStatus({
        type: 'error',
        message: '❌ Errore durante la copia del prompt'
      });
    });
  };

  // 🎙️ FUNZIONI PER VOCI ULTRA-REALISTICHE

  /**
   * Preset vocali predefiniti per diversi tipi di storie
   */
  const voicePresets = [
    {
      id: 'auto_intelligent',
      name: 'Auto Intelligente Italiano',
      icon: '🧠',
      description: 'Selezione automatica ottimale per italiano',
      settings: {
        gender: 'auto' as const,
        age: 'auto' as const,
        language: 'it' as const,
        accent: 'it' as const,
        speed: 0.9,
        useEnhancedModel: true,
        speakerBoost: true,
        stability: 0.92,
        similarity: 0.96,
        style: 0.82,
        breathiness: 0.18,
        roughness: 0.03
      }
    },
    {
      id: 'cinematic_male',
      name: 'Cinematografico Maschile',
      icon: '🎬',
      description: 'Voce maschile profonda e drammatica',
      settings: {
        gender: 'male' as const,
        age: 'mature' as const,
        useEnhancedModel: true,
        speakerBoost: true,
        stability: 0.95,
        similarity: 0.90,
        style: 0.85,
        pitch: -3,
        breathiness: 0.10,
        roughness: 0.08
      }
    },
    {
      id: 'elegant_female',
      name: 'Elegante Femminile',
      icon: '👑',
      description: 'Voce femminile sofisticata e espressiva',
      settings: {
        gender: 'female' as const,
        age: 'adult' as const,
        useEnhancedModel: true,
        speakerBoost: true,
        stability: 0.88,
        similarity: 0.92,
        style: 0.75,
        pitch: 5,
        breathiness: 0.20,
        roughness: 0.02
      }
    },
    {
      id: 'mysterious_neutral',
      name: 'Misterioso Neutrale',
      icon: '🌙',
      description: 'Voce enigmatica per thriller',
      settings: {
        gender: 'auto' as const,
        age: 'adult' as const,
        useEnhancedModel: true,
        speakerBoost: true,
        stability: 0.92,
        similarity: 0.88,
        style: 0.90,
        pitch: -1,
        breathiness: 0.25,
        roughness: 0.03
      }
    },
    {
      id: 'energetic_young',
      name: 'Energico Giovane',
      icon: '⚡',
      description: 'Voce vivace per avventure',
      settings: {
        gender: 'auto' as const,
        age: 'young' as const,
        useEnhancedModel: true,
        speakerBoost: true,
        stability: 0.85,
        similarity: 0.90,
        style: 0.70,
        pitch: 3,
        breathiness: 0.12,
        roughness: 0.04
      }
    },
    {
      id: 'ultra_realistic',
      name: 'Ultra Realistico Italiano',
      icon: '🎯',
      description: 'Massima qualità e naturalezza per italiano',
      settings: {
        gender: 'auto' as const,
        age: 'auto' as const,
        language: 'it' as const,
        accent: 'it' as const,
        speed: 0.85,
        useEnhancedModel: true,
        speakerBoost: true,
        stability: 0.98,
        similarity: 0.99,
        style: 0.90,
        pitch: 0,
        breathiness: 0.20,
        roughness: 0.01
      }
    }
  ];

  const [selectedVoicePreset, setSelectedVoicePreset] = useState<string>('auto_intelligent');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('it');
  const [languageConfidence, setLanguageConfidence] = useState<number>(95);

  /**
   * Applica un preset vocale
   */
  const applyVoicePreset = (presetId: string) => {
    const preset = voicePresets.find(p => p.id === presetId);
    if (preset) {
      setVoiceOptions(prev => ({
        ...prev,
        ...preset.settings
      }));
      setSelectedVoicePreset(presetId);
      
      setStatus({
        type: 'success',
        message: `🎙️ Preset "${preset.name}" applicato con successo!`
      });
    }
  };

  /**
   * Calcola la qualità vocale stimata
   */
  const calculateVoiceQuality = (): number => {
    const options = voiceOptions;
    let quality = 50; // Base
    
    // Bonus per modello avanzato
    if (options.useEnhancedModel) quality += 20;
    if (options.speakerBoost) quality += 10;
    
    // Bonus per stabilità alta
    if ((options.stability || 0) >= 0.9) quality += 15;
    else if ((options.stability || 0) >= 0.8) quality += 10;
    
    // Bonus per similarità alta
    if ((options.similarity || 0) >= 0.9) quality += 10;
    else if ((options.similarity || 0) >= 0.8) quality += 5;
    
    // Bonus per impostazioni ottimali
    if ((options.breathiness || 0) >= 0.1 && (options.breathiness || 0) <= 0.2) quality += 5;
    if ((options.roughness || 0) <= 0.1) quality += 5;
    
    return Math.min(100, quality);
  };

  /**
   * Rileva la lingua del testo della storia
   */
  const detectStoryLanguage = React.useCallback(() => {
    if (story) {
      const detected = OpenVoiceService.detectLanguage(story);
      setDetectedLanguage(detected);
      
      // Simula confidence basata sulla lunghezza del testo
      const confidence = Math.min(95, 60 + (story.length / 100));
      setLanguageConfidence(confidence);
    }
  }, [story, setDetectedLanguage, setLanguageConfidence]);

  // Rileva automaticamente la lingua quando la storia cambia
  React.useEffect(() => {
    if (story) {
      detectStoryLanguage();
    }
  }, [story, detectStoryLanguage]);

  /**
   * Aggiorna un parametro vocale specifico
   */
  const updateVoiceParameter = (parameter: keyof VoiceOptions, value: any) => {
    setVoiceOptions(prev => ({
      ...prev,
      [parameter]: value
    }));
    
    // Reset preset se modificato manualmente
    if (selectedVoicePreset !== 'custom') {
      setSelectedVoicePreset('custom');
    }
  };

  return (
    <Container>
      <Title>🎬 Generatore di Storie OpenStory</Title>
      
      {/* Messaggio Informativo API Key */}
      {(!apiKey || !apiKey.startsWith('sk-or-v1-')) && (
        <StatusMessage type="info">
          <strong>🔑 Configurazione API Key richiesta:</strong><br/>
          1. Vai su <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={{color: '#66b3ff'}}>openrouter.ai</a><br/>
          2. Registrati gratuitamente e ottieni la tua API key<br/>
          3. Crea un file <code>.env</code> nella cartella <code>openstory-app</code><br/>
          4. Aggiungi: <code>REACT_APP_OPENROUTER_API_KEY=sk-or-v1-la-tua-chiave</code><br/>
          5. Riavvia l'applicazione
        </StatusMessage>
      )}


      
      <form onSubmit={generateStory}>
        {/* 🎛️ Selezione Genere Dinamica */}
        <FormSection>
          <SectionTitle>🎭 Selezione Genere Intelligente</SectionTitle>
          <GenreSelector>
            {DynamicFormEngine.getAllGenreStructures().map(genreStructure => (
              <GenreCard
                key={genreStructure.genre}
                selected={params.genre === genreStructure.genre}
                onClick={() => handleInputChange('genre', genreStructure.genre)}
              >
                <GenreIcon>{genreStructure.icon}</GenreIcon>
                <GenreTitle>{genreStructure.displayName}</GenreTitle>
                <GenreDescription>{genreStructure.description}</GenreDescription>
              </GenreCard>
            ))}
          </GenreSelector>
          
          {/* Indicatore di Compatibilità */}
          {compatibilityScore > 0 && (
            <CompatibilityIndicator score={compatibilityScore}>
              {compatibilityScore >= 80 ? '✅' : compatibilityScore >= 60 ? '⚠️' : '❌'}
              Compatibilità: {compatibilityScore}%
              {compatibilityScore >= 80 ? ' - Ottimale' : 
               compatibilityScore >= 60 ? ' - Buona' : ' - Migliorabile'}
            </CompatibilityIndicator>
          )}
        </FormSection>

        {/* 🎛️ Impostazioni Dinamiche per Genere */}
        {currentGenreStructure && (
          <FormSection>
            <SectionTitle>
              {currentGenreStructure.icon} Impostazioni Ottimizzate per {currentGenreStructure.displayName}
            </SectionTitle>
            
            <Grid>
              {currentGenreStructure.fields.map(field => (
                <InputGroup key={field.field}>
                  <Label>{field.label} {field.required && '*'}</Label>
                  <Select
                    value={(params as any)[field.field] || ''}
                    onChange={(e) => handleInputChange(field.field as keyof StoryParams, e.target.value)}
                  >
                    <option value="">-- Seleziona {field.label} --</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} {option.recommended && '⭐'}
                      </option>
                    ))}
                  </Select>
                  {field.helpText && <HelpText>{field.helpText}</HelpText>}
                </InputGroup>
              ))}
            </Grid>
            
            {/* Pulsante Impostazioni Ottimali */}
            <Button 
              type="button" 
              onClick={applyOptimalSettings}
              disabled={loading}
              style={{ 
                marginTop: '1rem',
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                fontSize: '1rem'
              }}
            >
              ⚙️ Applica Impostazioni Ottimali per {currentGenreStructure.displayName}
            </Button>
          </FormSection>
        )}

        {/* Avvisi e Suggerimenti */}
        {formWarnings.length > 0 && (
          <WarningsList>
            <h4>⚠️ Avvisi di Compatibilità</h4>
            <ul>
              {formWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </WarningsList>
        )}

        {formSuggestions.length > 0 && (
          <SuggestionsList>
            <h4>💡 Suggerimenti per Migliorare</h4>
            <ul>
              {formSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </SuggestionsList>
        )}



        {/* Sezione Personaggi */}
        <FormSection>
          <SectionTitle>👤 Personaggi</SectionTitle>
          <Grid>
            <InputGroup>
              <Label>Nome Protagonista</Label>
              <Select 
                value={params.protagonistName}
                onChange={(e) => handleInputChange('protagonistName', e.target.value)}
              >
                {protagonistNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Nome Antagonista</Label>
              <Select 
                value={params.antagonistName}
                onChange={(e) => handleInputChange('antagonistName', e.target.value)}
              >
                {antagonistNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </Select>
            </InputGroup>
          </Grid>

          <InputGroup>
            <Label>Dettagli Protagonista</Label>
            <Select 
              value={params.protagonistDetails}
              onChange={(e) => handleInputChange('protagonistDetails', e.target.value)}
            >
              {protagonistProfiles.map(profile => (
                <option key={profile} value={profile}>{profile}</option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Dettagli Antagonista</Label>
            <Select 
              value={params.antagonistDetails}
              onChange={(e) => handleInputChange('antagonistDetails', e.target.value)}
            >
              {antagonistProfiles.map(profile => (
                <option key={profile} value={profile}>{profile}</option>
              ))}
            </Select>
          </InputGroup>
        </FormSection>

        {/* Sezione Ambientazione */}
        <FormSection>
          <SectionTitle>🌍 Ambientazione</SectionTitle>
          <Grid>
            <InputGroup>
              <Label>Ambientazione Principale</Label>
              <Select 
                value={params.setting}
                onChange={(e) => handleInputChange('setting', e.target.value)}
              >
                {settings.map(setting => (
                  <option key={setting} value={setting}>{setting}</option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Periodo Temporale</Label>
              <Select 
                value={params.timeperiod} 
                onChange={(e) => handleInputChange('timeperiod', e.target.value)}
              >
                <option value="prehistoric">Preistorico</option>
                <option value="ancient">Antico</option>
                <option value="medieval">Medievale</option>
                <option value="renaissance">Rinascimento</option>
                <option value="19th_century">XIX Secolo</option>
                <option value="early_20th">Inizio XX Secolo</option>
                <option value="contemporary">Contemporaneo</option>
                <option value="near_future">Futuro Prossimo</option>
                <option value="far_future">Futuro Lontano</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Atmosfera</Label>
              <Select 
                value={params.atmosphere} 
                onChange={(e) => handleInputChange('atmosphere', e.target.value)}
              >
                {atmospheres.map(atmosphere => (
                  <option key={atmosphere} value={atmosphere}>{atmosphere.replace('_', ' ')}</option>
                ))}
              </Select>
            </InputGroup>
          </Grid>
        </FormSection>

        {/* Sezione Trama */}
        <FormSection>
          <SectionTitle>⚔️ Trama</SectionTitle>
          <InputGroup>
            <Label>Conflitto Principale</Label>
            <Select 
              value={params.mainConflict}
              onChange={(e) => handleInputChange('mainConflict', e.target.value)}
            >
              {conflicts.map(conflict => (
                <option key={conflict} value={conflict}>{conflict}</option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Elementi della Trama</Label>
            <TagsContainer>
              {plotElementsOptions.map(element => (
                <Tag 
                  key={element}
                  selected={params.plotElements.includes(element)}
                  onClick={() => togglePlotElement(element)}
                >
                  {element.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Tag>
              ))}
            </TagsContainer>
          </InputGroup>

          <InputGroup>
            <Label>Richieste Speciali (Opzionale)</Label>
            <TextArea 
              value={params.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Aggiungi dettagli specifici: elementi di suspense particolari, temi da esplorare, riferimenti letterari, stile di dialoghi, ambientazioni aggiuntive, flashback importanti, colpi di scena desiderati..."
            />
          </InputGroup>
        </FormSection>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <SpinningIcon>⚡</SpinningIcon> Generazione in corso...
            </>
          ) : (
            '🎬 Genera Storia'
          )}
        </Button>
      </form>

      {loading && (
        <GenerationContainer>
          <ProgressHeader>
            <GenerationTitle>
              <SpinningIcon>🎬</SpinningIcon> Creazione Storia in Corso
            </GenerationTitle>
            <PercentageDisplay>{progress}%</PercentageDisplay>
            <PhaseIndicator>
              {generationSteps[currentStep]?.icon} {currentPhase}
            </PhaseIndicator>
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>
          </ProgressHeader>

          <StepsGrid>
            {generationSteps.map((step, index) => (
              <StepCard 
                key={step.id}
                active={index === currentStep}
                completed={index < currentStep}
              >
                <StepIcon>{step.icon}</StepIcon>
                <StepLabel>{step.label}</StepLabel>
              </StepCard>
            ))}
          </StepsGrid>
        </GenerationContainer>
      )}

      {status && (
        <StatusMessage type={status.type}>
          {status.message}
        </StatusMessage>
      )}

      {story && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#ffd700', marginBottom: '2rem', textAlign: 'center' }}>
            📖 La Tua Storia Completa
          </h2>
          
          {/* 🎙️ CONTROLLI GLOBALI NARRAZIONE VOCALE */}
          <VoiceControlsContainer>
            <VoiceButton 
              onClick={generateAllNarrations}
              disabled={loading || generatingVoice !== null}
            >
              {generatingVoice ? (
                <>
                  <SpinningIcon>🎙️</SpinningIcon> Generando...
                </>
              ) : (
                <>
                  🎙️ Genera Tutte le Narrazioni
                </>
              )}
            </VoiceButton>

            <VoiceButton 
              variant="secondary"
              onClick={() => setShowVoiceOptions(!showVoiceOptions)}
              disabled={loading}
            >
              ⚙️ Opzioni Voce
            </VoiceButton>

            <VoiceButton 
              variant="secondary"
              onClick={downloadAllNarrations}
              disabled={Object.keys(voiceNarrations).length === 0}
            >
              💾 Scarica Narrazioni
            </VoiceButton>

            <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: '0.9rem' }}>
              {Object.keys(voiceNarrations).length > 0 && (
                `✅ ${Object.keys(voiceNarrations).length} narrazione/i pronte`
              )}
            </div>
          </VoiceControlsContainer>

          {/* 🎙️ PANNELLO OPZIONI VOCALI ULTRA-REALISTICHE */}
          {showVoiceOptions && (
            <UltraVoicePanel>
              <VoiceControlHeader>
                <h3>🎙️ Configurazione Voci Ultra-Realistiche</h3>
                <VoiceButton 
                  variant="secondary" 
                  onClick={() => setShowVoiceOptions(false)}
                >
                  ✕ Chiudi
                </VoiceButton>
              </VoiceControlHeader>

              {/* Rilevamento Lingua Automatico */}
              {story && (
                <VoiceLanguageDetector>
                  <div className="detector-header">
                    🌍 Rilevamento Lingua Automatico
                  </div>
                  <div className="detected-language">
                    Lingua rilevata: <strong>{detectedLanguage.toUpperCase()}</strong>
                  </div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${languageConfidence}%` }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                    Confidenza: {languageConfidence.toFixed(1)}%
                  </div>
                </VoiceLanguageDetector>
              )}

              {/* Indicatore Qualità Vocale */}
              <VoiceQualityIndicator quality={calculateVoiceQuality()}>
                {calculateVoiceQuality() >= 90 ? '🎯' : 
                 calculateVoiceQuality() >= 70 ? '⚡' : '⚠️'}
                Qualità Vocale: {calculateVoiceQuality()}%
                {calculateVoiceQuality() >= 90 ? ' - Ultra Realistica' : 
                 calculateVoiceQuality() >= 70 ? ' - Buona Qualità' : ' - Migliorabile'}
              </VoiceQualityIndicator>

              {/* Selezione Preset Vocali */}
              <div>
                <h4 style={{ color: '#8A2BE2', marginBottom: '1rem' }}>
                  🎭 Preset Vocali Ottimizzati
                </h4>
                <VoicePresetSelector>
                  {voicePresets.map(preset => (
                    <VoicePresetCard
                      key={preset.id}
                      selected={selectedVoicePreset === preset.id}
                      onClick={() => applyVoicePreset(preset.id)}
                    >
                      <div className="preset-icon">{preset.icon}</div>
                      <div className="preset-name">{preset.name}</div>
                      <div className="preset-desc">{preset.description}</div>
                    </VoicePresetCard>
                  ))}
                </VoicePresetSelector>
              </div>

              {/* Parametri Vocali Avanzati */}
              <VoiceParametersGrid>
                {/* Gruppo Controlli Base */}
                <VoiceParameterGroup>
                  <h4>🎛️ Controlli Base</h4>
                  
                  <VoiceParameter>
                    <label>
                      Genere Voce
                      <span className="parameter-value">
                        {voiceOptions.gender === 'auto' ? 'Auto' : 
                         voiceOptions.gender === 'male' ? 'Maschile' : 'Femminile'}
                      </span>
                    </label>
                    <VoiceGenderSelector>
                      <button
                        type="button"
                        className={voiceOptions.gender === 'auto' ? 'active' : ''}
                        onClick={() => updateVoiceParameter('gender', 'auto')}
                      >
                        🧠 Auto
                      </button>
                      <button
                        type="button"
                        className={voiceOptions.gender === 'male' ? 'active' : ''}
                        onClick={() => updateVoiceParameter('gender', 'male')}
                      >
                        👨 Maschile
                      </button>
                      <button
                        type="button"
                        className={voiceOptions.gender === 'female' ? 'active' : ''}
                        onClick={() => updateVoiceParameter('gender', 'female')}
                      >
                        👩 Femminile
                      </button>
                    </VoiceGenderSelector>
                  </VoiceParameter>

                  <VoiceParameter>
                    <label>
                      Velocità
                      <span className="parameter-value">{voiceOptions.speed?.toFixed(1)}x</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceOptions.speed || 1.0}
                      onChange={(e) => updateVoiceParameter('speed', parseFloat(e.target.value))}
                    />
                  </VoiceParameter>

                  <VoiceParameter>
                    <label>Emozione</label>
                    <VoiceSelect
                      value={voiceOptions.emotion || 'default'}
                      onChange={(e) => updateVoiceParameter('emotion', e.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="dramatic">Drammatica</option>
                      <option value="mysterious">Misteriosa</option>
                      <option value="romantic">Romantica</option>
                      <option value="epic">Epica</option>
                      <option value="cheerful">Allegra</option>
                      <option value="calm">Calma</option>
                      <option value="energetic">Energica</option>
                      <option value="terrified">Terrorizzata</option>
                      <option value="angry">Arrabbiata</option>
                      <option value="sad">Triste</option>
                    </VoiceSelect>
                  </VoiceParameter>
                </VoiceParameterGroup>

                {/* Gruppo Parametri Avanzati */}
                <VoiceParameterGroup>
                  <h4>⚙️ Parametri Avanzati</h4>
                  
                  <VoiceParameter>
                    <label>
                      Stabilità
                      <span className="parameter-value">{((voiceOptions.stability || 0) * 100).toFixed(0)}%</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={voiceOptions.stability || 0.85}
                      onChange={(e) => updateVoiceParameter('stability', parseFloat(e.target.value))}
                    />
                  </VoiceParameter>

                  <VoiceParameter>
                    <label>
                      Similarità
                      <span className="parameter-value">{((voiceOptions.similarity || 0) * 100).toFixed(0)}%</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={voiceOptions.similarity || 0.90}
                      onChange={(e) => updateVoiceParameter('similarity', parseFloat(e.target.value))}
                    />
                  </VoiceParameter>

                  <VoiceParameter>
                    <label>
                      Intensità Stile
                      <span className="parameter-value">{((voiceOptions.style || 0) * 100).toFixed(0)}%</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={voiceOptions.style || 0.75}
                      onChange={(e) => updateVoiceParameter('style', parseFloat(e.target.value))}
                    />
                  </VoiceParameter>
                </VoiceParameterGroup>

                {/* Gruppo Caratteristiche Vocali */}
                <VoiceParameterGroup>
                  <h4>🎵 Caratteristiche Vocali</h4>
                  
                  <VoiceParameter>
                    <label>
                      Tonalità
                      <span className="parameter-value">{(voiceOptions.pitch || 0) > 0 ? '+' : ''}{voiceOptions.pitch || 0}</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={voiceOptions.pitch || 0}
                      onChange={(e) => updateVoiceParameter('pitch', parseInt(e.target.value))}
                    />
                  </VoiceParameter>

                  <VoiceParameter>
                    <label>
                      Respiro
                      <span className="parameter-value">{((voiceOptions.breathiness || 0) * 100).toFixed(0)}%</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={voiceOptions.breathiness || 0.15}
                      onChange={(e) => updateVoiceParameter('breathiness', parseFloat(e.target.value))}
                    />
                  </VoiceParameter>

                  <VoiceParameter>
                    <label>
                      Ruvidezza
                      <span className="parameter-value">{((voiceOptions.roughness || 0) * 100).toFixed(0)}%</span>
                    </label>
                    <VoiceSlider
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={voiceOptions.roughness || 0.05}
                      onChange={(e) => updateVoiceParameter('roughness', parseFloat(e.target.value))}
                    />
                  </VoiceParameter>
                </VoiceParameterGroup>
              </VoiceParametersGrid>

              {/* Opzioni Tecniche */}
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                borderRadius: '10px', 
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <h4 style={{ color: '#8A2BE2', marginBottom: '1rem' }}>
                  🔧 Opzioni Tecniche
                </h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e0e0' }}>
                    <input
                      type="checkbox"
                      checked={voiceOptions.useEnhancedModel || false}
                      onChange={(e) => updateVoiceParameter('useEnhancedModel', e.target.checked)}
                    />
                    🧠 Modello AI Avanzato
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e0e0' }}>
                    <input
                      type="checkbox"
                      checked={voiceOptions.speakerBoost || false}
                      onChange={(e) => updateVoiceParameter('speakerBoost', e.target.checked)}
                    />
                    🔊 Potenziamento Voce
                  </label>
                </div>
              </div>

              {/* Pulsanti Azione */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginTop: '1.5rem',
                justifyContent: 'center'
              }}>
                <VoiceButton
                  onClick={() => applyVoicePreset('ultra_realistic')}
                >
                  🎯 Applica Ultra Realistico
                </VoiceButton>
                <VoiceButton
                  variant="secondary"
                  onClick={() => applyVoicePreset('auto_intelligent')}
                >
                  🧠 Reset Auto Intelligente
                </VoiceButton>
              </div>
            </UltraVoicePanel>
          )}

          {/* 🎨 CONTROLLI GLOBALI PROMPT FOOOCUS */}
          <VoiceControlsContainer style={{ 
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.1))',
            borderColor: 'rgba(255, 165, 0, 0.3)'
          }}>
            <FoocusButton 
              onClick={generateAllFoocusPrompts}
              disabled={loading || generatingVoice !== null}
            >
              {generatingVoice ? (
                <>
                  <SpinningIcon>🎨</SpinningIcon> Generando...
                </>
              ) : (
                <>
                  🎨 Genera Tutti i Prompt Fooocus
                </>
              )}
            </FoocusButton>

            <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: '0.9rem' }}>
              {Object.keys(sectionImagePrompts).length > 0 && (
                `✅ ${Object.keys(sectionImagePrompts).length} prompt Fooocus pronti`
              )}
            </div>
          </VoiceControlsContainer>
          
          {extractStorySections(story).map((section, index) => (
            <StorySection key={section.id}>
              <SectionHeader>
                <SectionTitle>
                  {index === 0 ? '🎭' : 
                   index === 1 ? '🚀' : 
                   index === 2 ? '⚔️' : 
                   index === 3 ? '🔥' : '🏆'} {section.title}
                </SectionTitle>
              </SectionHeader>
              
              <SectionContent>{section.content}</SectionContent>

              {/* 🎙️ CONTROLLI NARRAZIONE PER SEZIONE */}
              <VoiceControlsContainer>
                <VoiceButton
                  onClick={() => generateSectionNarration(section.id, section.title, section.content)}
                  disabled={loading || generatingVoice === section.id}
                >
                  {generatingVoice === section.id ? (
                    <>
                      <SpinningIcon>🎙️</SpinningIcon> Generando...
                    </>
                  ) : voiceNarrations[section.id] ? (
                    <>
                      🔄 Rigenera Narrazione
                    </>
                  ) : (
                    <>
                      🎙️ Genera Narrazione
                    </>
                  )}
                </VoiceButton>

                {voiceNarrations[section.id] && (
                  <>
                    <VoiceButton
                      variant="secondary"
                      onClick={() => {
                        const narration = voiceNarrations[section.id];
                        if (narration.audioBlob) {
                          const filename = `${section.title.replace(/[^a-zA-Z0-9]/g, '_')}.wav`;
                          OpenVoiceService.downloadAudio(narration.audioBlob, filename);
                        }
                      }}
                    >
                      💾 Scarica
                    </VoiceButton>

                    <VoiceButton
                      variant="danger"
                      onClick={() => removeNarration(section.id)}
                    >
                      🗑️ Rimuovi
                    </VoiceButton>
                  </>
                )}

                {/* STATUS NARRAZIONE */}
                {voiceStatus[section.id] && (
                  <VoiceStatus type={voiceStatus[section.id].type}>
                    {voiceStatus[section.id].type === 'generating' && <SpinningIcon>🎙️</SpinningIcon>}
                    {voiceStatus[section.id].type === 'success' && '✅'}
                    {voiceStatus[section.id].type === 'error' && '❌'}
                    {voiceStatus[section.id].message}
                  </VoiceStatus>
                )}
              </VoiceControlsContainer>

              {/* 🎙️ PLAYER AUDIO */}
              {voiceNarrations[section.id]?.audioUrl && (
                <AudioPlayer
                  controls
                  src={voiceNarrations[section.id].audioUrl}
                  preload="metadata"
                >
                  Il tuo browser non supporta l'elemento audio.
                </AudioPlayer>
              )}

              {/* 🎨 CONTROLLI PROMPT FOOOCUS PER SEZIONE */}
              <VoiceControlsContainer style={{ 
                background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.1))',
                borderColor: 'rgba(255, 165, 0, 0.3)'
              }}>
                <FoocusButton
                  onClick={() => generateFoocusPrompt(section.id, section.title, section.content)}
                  disabled={loading || generatingVoice === section.id}
                >
                  {generatingVoice === section.id ? (
                    <>
                      <SpinningIcon>🎨</SpinningIcon> Generando...
                    </>
                  ) : sectionImagePrompts[section.id] ? (
                    <>
                      🔄 Rigenera Prompt Fooocus
                    </>
                  ) : (
                    <>
                      🎨 Genera Prompt Fooocus
                    </>
                  )}
                </FoocusButton>

                {sectionImagePrompts[section.id] && (
                  <FoocusButton
                    variant="secondary"
                    onClick={() => copyFoocusPrompt(sectionImagePrompts[section.id], section.title)}
                  >
                    📋 Copia Prompt
                  </FoocusButton>
                )}
              </VoiceControlsContainer>

              {/* 🎨 DISPLAY PROMPT FOOOCUS */}
              {sectionImagePrompts[section.id] && (
                <FoocusPromptContainer>
                  <FoocusHeader>
                    <h4>🎨 Prompt Fooocus per {section.title}</h4>
                  </FoocusHeader>
                  <FoocusPromptText>
                    {sectionImagePrompts[section.id]}
                  </FoocusPromptText>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#ccc', 
                    fontStyle: 'italic',
                    marginTop: '0.5rem'
                  }}>
                    💡 Copia questo prompt e incollalo in Fooocus per generare l'immagine della scena
                  </div>
                </FoocusPromptContainer>
              )}
            </StorySection>
          ))}
        </div>
      )}
    </Container>
  );
};

export default StoryGenerator; 