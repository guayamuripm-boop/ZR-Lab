import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PartPanel } from '../PartPanel';

describe('PartPanel', () => {
  it('carga la ficha de la batería y muestra sus 4 pestañas', async () => {
    render(<PartPanel componentId="battery" onClose={() => {}} />);
    await waitFor(() => expect(screen.getByText('Batería')).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'Qué es' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cómo funciona' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cómo se prueba' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cuando falla' })).toBeInTheDocument();
  });

  it('cambia de contenido al hacer clic en otra pestaña', async () => {
    render(<PartPanel componentId="battery" onClose={() => {}} />);
    await waitFor(() => expect(screen.getByText('Batería')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('tab', { name: 'Cómo se prueba' }));
    expect(screen.getByText('Multímetro (V DC)')).toBeInTheDocument();
  });

  it('llama a onClose con Escape', async () => {
    const onClose = vi.fn();
    render(<PartPanel componentId="battery" onClose={onClose} />);
    await waitFor(() => expect(screen.getByText('Batería')).toBeInTheDocument());
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('llama a onClose al hacer clic en la X', async () => {
    const onClose = vi.fn();
    render(<PartPanel componentId="battery" onClose={onClose} />);
    await waitFor(() => expect(screen.getByText('Batería')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
