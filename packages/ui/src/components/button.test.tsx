import { describe, expect, it } from 'bun:test';
import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('should export Button component', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('object'); // forwardRef components are objects
  });

  it('should export buttonVariants', () => {
    expect(buttonVariants).toBeDefined();
    expect(typeof buttonVariants).toBe('function');
  });

  it('should generate default variant classes', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
  });

  it('should generate destructive variant classes', () => {
    const classes = buttonVariants({ variant: 'destructive' });
    expect(classes).toContain('bg-destructive');
  });

  it('should generate outline variant classes', () => {
    const classes = buttonVariants({ variant: 'outline' });
    expect(classes).toContain('border');
    expect(classes).toContain('bg-background');
  });

  it('should generate small size classes', () => {
    const classes = buttonVariants({ size: 'sm' });
    expect(classes).toContain('h-8');
    expect(classes).toContain('text-xs');
  });

  it('should generate large size classes', () => {
    const classes = buttonVariants({ size: 'lg' });
    expect(classes).toContain('h-10');
    expect(classes).toContain('px-8');
  });
});
