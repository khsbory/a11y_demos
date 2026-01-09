
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ToggleButtonDemoPage from '../pages/ToggleButtonDemoPage';
import '@testing-library/jest-dom';

describe('ToggleButtonDemoPage', () => {
    it('renders the page title', () => {
        render(<ToggleButtonDemoPage />);
        // Adjust this depending on actual PageTitle implementation
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    describe('Section 1: Text Change Implementation', () => {
        it('toggles Play/Pause text on click', () => {
            render(<ToggleButtonDemoPage />);

            // Initial state: Play
            const playButton = screen.getByRole('button', { name: /^Play$/i });
            expect(playButton).toHaveTextContent(/Play/i);

            // Click to toggle
            fireEvent.click(playButton);

            // New state: Pause
            expect(playButton).toHaveTextContent(/Pause/i);

            // Click again
            fireEvent.click(playButton);
            expect(playButton).toHaveTextContent(/Play/i);
        });

        it('toggles Favorite text on click', () => {
            render(<ToggleButtonDemoPage />);

            // Initial state: Add to Favorites
            const favButton = screen.getByRole('button', { name: /add to favorites/i });
            expect(favButton).toBeInTheDocument();

            // Click to toggle
            fireEvent.click(favButton);

            // New state: Remove from Favorites
            expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument();
        });
    });

    describe('Section 2: Aria-Pressed Implementation', () => {
        it('toggles aria-pressed state on Play/Pause button', () => {
            render(<ToggleButtonDemoPage />);

            // Find by accessible name "Play/Pause"
            const playButton = screen.getByRole('button', { name: "Play/Pause" });

            // Initial state: not pressed (false) or just ensure it exists
            // Note: aria-pressed="false" is often default, or missing. 
            // In our code: aria-pressed={isPlayingState} (false initially)
            expect(playButton).toHaveAttribute('aria-pressed', 'false');

            // Click to toggle
            fireEvent.click(playButton);
            expect(playButton).toHaveAttribute('aria-pressed', 'true');

            // Click again
            fireEvent.click(playButton);
            expect(playButton).toHaveAttribute('aria-pressed', 'false');
        });

        it('toggles aria-pressed state on Favorite button', () => {
            render(<ToggleButtonDemoPage />);

            const favButton = screen.getByRole('button', { name: "Favorite" });
            expect(favButton).toHaveAttribute('aria-pressed', 'false');

            fireEvent.click(favButton);
            expect(favButton).toHaveAttribute('aria-pressed', 'true');
        });
    });
});
