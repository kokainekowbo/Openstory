import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import WorkingStoryGenerator from './components/WorkingStoryGenerator';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  color: #f5f5f5;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  /* Mobile-first responsive padding */
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 0.25rem;
  }
`;

const HeaderContainer = styled.header`
  background-color: #0a0a0a;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.1);
  
  /* Mobile responsive padding */
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  /* Mobile responsive layout */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const Logo = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700; /* Oro */
  text-decoration: none;
  letter-spacing: 1px;
  
  span {
    color: #f5f5f5;
  }
  
  /* Mobile responsive typography */
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    letter-spacing: 0.5px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  
  /* Mobile responsive navigation */
  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    flex-direction: column;
    align-items: center;
  }
`;

const NavLink = styled(Link)`
  color: #f5f5f5;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-height: 44px; /* Touch target size */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Touch optimizations */
  -webkit-tap-highlight-color: rgba(255, 215, 0, 0.2);
  touch-action: manipulation;
  
  &:hover {
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
  
  /* Mobile touch feedback */
  @media (hover: none) and (pointer: coarse) {
    &:active {
      background: rgba(255, 215, 0, 0.2);
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.75rem 1.25rem;
  }
`;

const FooterContainer = styled.footer`
  background-color: #0a0a0a;
  padding: 1.5rem 1rem;
  text-align: center;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Copyright = styled.p`
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PoweredBy = styled.p`
  color: #777;
  font-size: 0.8rem;
  
  a {
    color: #ffd700;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Componente Header
const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          Open<span>Story</span>
        </Logo>
        <Nav>
          <NavLink to="/">🏠 Generatore</NavLink>
          <NavLink to="/about">ℹ️ Info</NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

// Componente Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          &copy; {currentYear} OpenStory - Generatore di Storie AI. Tutti i diritti riservati.
        </Copyright>
        <PoweredBy>
          🚀 Powered by <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter</a> | 
          🎨 Design moderno e ottimizzato | 
          ⚡ Performance avanzate
        </PoweredBy>
      </FooterContent>
    </FooterContainer>
  );
};

// About Page component
const AboutPage = () => {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      color: '#f5f5f5',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#ffd700', textAlign: 'center', marginBottom: '2rem' }}>
        🌟 Benvenuto in OpenStory
      </h1>
      
      <div style={{ 
        background: 'rgba(26, 26, 26, 0.8)', 
        padding: '2rem', 
        borderRadius: '15px',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <h2 style={{ color: '#ffd700' }}>🎬 Cos'è OpenStory?</h2>
        <p>
          OpenStory è un generatore di storie alimentato da intelligenza artificiale che ti permette di creare 
          narrazioni coinvolgenti e personalizzate in stile hollywoodiano. Utilizzando i modelli AI più avanzati 
          disponibili tramite OpenRouter, OpenStory trasforma le tue idee in storie complete e strutturate.
        </p>
      </div>

      <div style={{ 
        background: 'rgba(26, 26, 26, 0.8)', 
        padding: '2rem', 
        borderRadius: '15px',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <h2 style={{ color: '#ffd700' }}>✨ Caratteristiche Principali</h2>
        <ul>
          <li><strong>🎭 Diversi Generi:</strong> Action/Thriller, Commedia Romantica, Horror, Fantasy e molto altro</li>
          <li><strong>🎨 Personalizzazione Completa:</strong> Personaggi, ambientazioni, trama completamente personalizzabili</li>
          <li><strong>🚀 AI Avanzata:</strong> Utilizza i migliori modelli AI per risultati di alta qualità</li>
          <li><strong>📚 Struttura Professionale:</strong> Storie organizzate in atti con sviluppo narrativo coerente</li>
          <li><strong>💾 Salvataggio e Export:</strong> Salva le tue storie preferite ed esportale in vari formati</li>
          <li><strong>🔄 Rigenerazione Sezioni:</strong> Non soddisfatto di una parte? Rigenera singole sezioni</li>
        </ul>
      </div>

      <div style={{ 
        background: 'rgba(26, 26, 26, 0.8)', 
        padding: '2rem', 
        borderRadius: '15px',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <h2 style={{ color: '#ffd700' }}>🛠️ Tecnologie Utilizzate</h2>
        <ul>
          <li><strong>Frontend:</strong> React 18 + TypeScript + Styled Components</li>
          <li><strong>State Management:</strong> Zustand per gestione stato ottimizzata</li>
          <li><strong>AI Services:</strong> OpenRouter per accesso a modelli AI multipli</li>
          <li><strong>Prompt Engineering:</strong> Sistema avanzato di template per ogni genere</li>
          <li><strong>UI/UX:</strong> Design moderno con animazioni fluide e responsive</li>
          <li><strong>Performance:</strong> Ottimizzazioni avanzate per velocità e efficienza</li>
        </ul>
      </div>

      <div style={{ 
        background: 'rgba(26, 26, 26, 0.8)', 
        padding: '2rem', 
        borderRadius: '15px',
        textAlign: 'center',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <h2 style={{ color: '#ffd700' }}>🚀 Inizia Subito!</h2>
        <p style={{ marginBottom: '2rem' }}>
          Pronto a creare la tua prossima storia? Bastano pochi click per trasformare le tue idee 
          in narrazioni professionali e coinvolgenti.
        </p>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            color: '#1a1a2e',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ✨ Crea la Tua Storia
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<WorkingStoryGenerator />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Main>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
