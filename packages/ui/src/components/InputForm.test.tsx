import { afterEach, describe, expect, it, mock } from 'bun:test';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { InputForm } from './InputForm';

describe('InputForm', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    repo: 'facebook/react',
    token: '',
    isTokenSectionOpen: false,
    onAnalyze: mock(() => {}),
    onTokenChange: mock(() => {}),
    onTokenSectionOpenChange: mock(() => {}),
  };

  it('renders the repo input', () => {
    render(<InputForm {...defaultProps} />);

    const input = screen.getByLabelText('Repo');
    expect(input).toBeDefined();
  });

  it('sets the default value from repo prop', () => {
    render(<InputForm {...defaultProps} />);

    const input = screen.getByLabelText('Repo') as HTMLInputElement;
    expect(input.defaultValue).toBe('facebook/react');
  });

  it('renders the submit button', () => {
    render(<InputForm {...defaultProps} />);

    expect(screen.getByText('Analyze Now')).toBeDefined();
  });

  it('calls onAnalyze when form is submitted with a value', () => {
    const onAnalyze = mock(() => {});
    render(<InputForm {...defaultProps} onAnalyze={onAnalyze} />);

    // The input has a defaultValue, so we need to set a value
    const input = document.getElementById('repo') as HTMLInputElement;
    input.value = 'vercel/next.js';

    fireEvent.submit(screen.getByText('Analyze Now').closest('form')!);
    expect(onAnalyze).toHaveBeenCalledWith('vercel/next.js');
  });

  it('renders token section toggle', () => {
    render(<InputForm {...defaultProps} />);

    expect(screen.getByText(/access private repos or need higher rate limits/i)).toBeDefined();
  });

  it('renders token input when section is expanded', () => {
    render(<InputForm {...defaultProps} isTokenSectionOpen={true} />);

    expect(screen.getByLabelText(/github personal access token/i)).toBeDefined();
  });

  it('renders null repo as empty input', () => {
    render(<InputForm {...defaultProps} repo={null} />);

    const input = screen.getByLabelText('Repo') as HTMLInputElement;
    expect(input.defaultValue).toBe('');
  });
});
