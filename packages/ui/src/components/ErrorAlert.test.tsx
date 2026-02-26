import { describe, expect, it } from 'bun:test';

import { render, screen } from '@testing-library/react';

import { ErrorAlert } from './ErrorAlert';

describe('ErrorAlert', () => {
  it('renders the error message', () => {
    render(<ErrorAlert message="Something went wrong" />);

    expect(screen.getByText('Analysis Failed')).toBeDefined();
    expect(screen.getByText('Something went wrong')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(<ErrorAlert message="test error" className="custom-class" />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('custom-class');
  });

  it('renders with destructive variant styling', () => {
    const { container } = render(<ErrorAlert message="test" />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('destructive');
  });
});
