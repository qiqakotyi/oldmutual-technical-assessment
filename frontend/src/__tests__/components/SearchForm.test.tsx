import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchForm } from '../../components/SearchForm';
import { renderWithClient } from '../test-utils';

describe('SearchForm', () => {
  it('should render with placeholder', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} placeholder="Search here..." />);
    
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
  });

  it('should call onSearch when input changes', async () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('should validate minimum length', async () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    
    await waitFor(() => {
      expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should validate invalid characters', async () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@#$' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Please use only letters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should validate maximum length', async () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    const longString = 'a'.repeat(51);
    fireEvent.change(input, { target: { value: longString } });
    
    await waitFor(() => {
      expect(screen.getByText(/must be less than 50 characters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should show clear button when input has value', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);
    
    expect(input.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should accept valid input with hyphens and apostrophes', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: "Saint-Pierre" } });
    
    expect(mockOnSearch).toHaveBeenCalledWith("Saint-Pierre");
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should allow empty input', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnSearch).toHaveBeenCalledWith('test');
    
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const form = document.querySelector('form') as HTMLFormElement;
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'Nigeria' } });
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Nigeria');
  });

  it('should prevent submission with invalid input', () => {
    const mockOnSearch = vi.fn();
    renderWithClient(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'a' } });
    
    expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument();
  });
});
