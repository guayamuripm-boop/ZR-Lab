import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../../components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('toggles data-theme attribute and persists to localStorage', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    const initialTheme = document.documentElement.getAttribute('data-theme');

    fireEvent.click(button);

    const newTheme = document.documentElement.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
    expect(localStorage.getItem('zr-lab-theme')).toBe(newTheme);
  });
});
