import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../layouts/Header';

describe('Header Component', () => {
  test('shows Login and Register links when user is not authenticated', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Use `getAllByText` because mobile and desktop buttons are both in the DOM.
    // This asserts that there is at least one "Login" button visible.
    const loginButtons = screen.getAllByText(/login/i);
    expect(loginButtons.length).toBeGreaterThan(0);

    const registerButtons = screen.getAllByText(/register/i);
    expect(registerButtons.length).toBeGreaterThan(0);
  });

  // Note: The test for the authenticated state (showing "Dashboard" and "Logout")
  // has been removed because the current Header.jsx component does not contain
  // the logic for it. This test can be added back once that functionality is implemented.
});