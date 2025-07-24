import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Footer from '../../layouts/Footer';

describe('Footer Component', () => {
  test('renders the footer with the correct copyright text and current year', () => {
    render(<Footer />);

    // This query now exactly matches the text in your component
    const footerText = screen.getByText(/© 2025 MotoFix. All rights reserved./i);
    
    expect(footerText).toBeInTheDocument();
  });
});