import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm'; // Correctly import the named export
import { AuthContext } from '../auth/AuthContext'; // Import the context

// Mock the AuthContext
const mockLogin = vi.fn();

describe('LoginForm Component', () => {
  // Helper function to render the component with the necessary context provider
  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <BrowserRouter>
          <LoginForm onSwitch={() => {}} />
        </BrowserRouter>
      </AuthContext.Provider>
    );

  test('renders the login form correctly', () => {
    renderComponent();
    // Check for form fields and the button
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('allows the user to type into email and password fields', () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert that the input values have changed
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});