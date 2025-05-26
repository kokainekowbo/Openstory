import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h3 {
    color: #f5f5f5;
    margin-bottom: 1rem;
  }
`;

const RequiredAsterisk = styled.span`
  color: #ff4d4d; /* Rosso per l'asterisco */
  margin-left: 0.25rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #f5f5f5;
  font-size: 1rem;
  
  &:focus {
    border-color: #ffd700;
    outline: none;
  }
`;

const Description = styled.p`
  color: #999;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface GenreSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
}

const genres = [
  { value: 'thriller', label: 'Thriller', description: 'Storie di suspense e tensione' },
  { value: 'mystery', label: 'Mistero', description: 'Enigmi da risolvere e segreti da svelare' },
  { value: 'fantasy', label: 'Fantasy', description: 'Mondi magici e avventure epiche' },
  { value: 'sci-fi', label: 'Fantascienza', description: 'Tecnologia, spazio e futuri alternativi' },
  { value: 'romance', label: 'Romance', description: 'Storie d\'amore e relazioni' },
  { value: 'horror', label: 'Horror', description: 'Paura, tensione e soprannaturale' },
  { value: 'adventure', label: 'Avventura', description: 'Viaggi, scoperte e sfide' },
  { value: 'historical', label: 'Storico', description: 'Ambientazioni ed eventi del passato' },
  { value: 'crime', label: 'Crime', description: 'Crimini, indagini e giustizia' },
  { value: 'drama', label: 'Drammatico', description: 'Conflitti emotivi e personali' }
];

const GenreSelector: React.FC<GenreSelectorProps> = ({ value, onChange, isRequired }) => {
  return (
    <Container>
      <h3>
        Genere
        {isRequired && <RequiredAsterisk>*</RequiredAsterisk>}
      </h3>
      <Select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Seleziona un genere</option>
        {genres.map(genre => (
          <option key={genre.value} value={genre.value}>
            {genre.label}
          </option>
        ))}
      </Select>
      {value && (
      <Description>
          {genres.find(g => g.value === value)?.description}
      </Description>
      )}
    </Container>
  );
};

export default GenreSelector; 