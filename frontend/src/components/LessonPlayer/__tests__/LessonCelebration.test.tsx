import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { LessonCelebration } from '../LessonCelebration';
import { useLessonStore } from '../../../stores/useLessonStore';

describe('LessonCelebration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useLessonStore.setState({ celebration: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('no renderiza nada sin celebración activa', () => {
    render(<LessonCelebration />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('muestra el título de la lección y se autodescarta a los 1.5s', () => {
    useLessonStore.setState({ celebration: { lessonTitle: 'La batería: el corazón eléctrico', badgeKey: 'battery-master' } });
    render(<LessonCelebration />);
    expect(screen.getByText(/La batería: el corazón eléctrico/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(useLessonStore.getState().celebration).toBeNull();
  });
});
