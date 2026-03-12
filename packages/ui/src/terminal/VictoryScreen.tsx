import React from 'react';
import './victory-screen.css';

export interface VictoryScreenProps {
  totalChallenges: number;
  completedChallenges: number;
  totalXp: number;
  level: number;
  playerName: string;
  onContinue: () => void;
  onReturnToTitle: () => void;
}

const ASCII_BANNER = `
 ╔═══════════════════════════════════════════════════╗
 ║  ███████╗██╗   ██╗███████╗████████╗███████╗███╗  ║
 ║  ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ║
 ║  ███████╗ ╚████╔╝ ███████╗   ██║   █████╗ ██╔██╗║
 ║  ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝ ██║╚█║║
 ║  ███████║   ██║   ███████║   ██║   ███████╗██║ ║║║
 ║  ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝ ║║║
 ║                                                   ║
 ║       ███████╗███████╗ ██████╗██╗   ██╗██████╗   ║
 ║       ██╔════╝██╔════╝██╔════╝██║   ██║██╔══██╗  ║
 ║       ███████╗█████╗  ██║     ██║   ██║██████╔╝  ║
 ║       ╚════██║██╔══╝  ██║     ██║   ██║██╔══██╗  ║
 ║       ███████║███████╗╚██████╗╚██████╔╝██║  ██║  ║
 ║       ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝  ║
 ║                                                   ║
 ║              ███████╗██████╗ ██╗                   ║
 ║              ██╔════╝██╔══██╗██║                   ║
 ║              █████╗  ██║  ██║██║                   ║
 ║              ██╔══╝  ██║  ██║╚═╝                   ║
 ║              ███████╗██████╔╝██╗                   ║
 ║              ╚══════╝╚═════╝ ╚═╝                   ║
 ╚═══════════════════════════════════════════════════╝`;

function getAgentRating(
  completedChallenges: number,
  totalChallenges: number,
  totalXp: number,
  level: number,
): string {
  const completionRatio = totalChallenges > 0 ? completedChallenges / totalChallenges : 0;
  const xpPerChallenge = completedChallenges > 0 ? totalXp / completedChallenges : 0;

  if (completionRatio >= 1 && level >= 50 && xpPerChallenge >= 100) return 'S';
  if (completionRatio >= 1 && level >= 30) return 'A';
  if (completionRatio >= 0.8) return 'B';
  return 'C';
}

function getRatingLabel(rating: string): string {
  switch (rating) {
    case 'S':
      return '★ LEGENDARY HACKER ★';
    case 'A':
      return '◆ ELITE OPERATIVE ◆';
    case 'B':
      return '● SKILLED AGENT ●';
    default:
      return '○ FIELD AGENT ○';
  }
}

function VictoryScreenInner({
  totalChallenges,
  completedChallenges,
  totalXp,
  level,
  playerName,
  onContinue,
  onReturnToTitle,
}: VictoryScreenProps): React.JSX.Element {
  const rating = getAgentRating(completedChallenges, totalChallenges, totalXp, level);
  const ratingLabel = getRatingLabel(rating);

  return (
    <div className="victory-screen">
      <div className="victory-content">
        <pre className="victory-ascii-banner" aria-hidden="true">
          {ASCII_BANNER}
        </pre>

        <h1 className="victory-header">
          {'>'} SYSTEM SECURED {'<'}
        </h1>
        <p className="victory-subheader">All threats neutralized. Network integrity restored.</p>

        <div className="victory-divider">{'═'.repeat(48)}</div>

        <div className="victory-agent-section">
          <p className="victory-agent-name">AGENT: {playerName}</p>
          <p className={`victory-rating victory-rating--${rating.toLowerCase()}`}>
            RATING: [{rating}] {ratingLabel}
          </p>
        </div>

        <div className="victory-divider">{'─'.repeat(48)}</div>

        <div className="victory-stats">
          <div className="victory-stat-row">
            <span className="victory-stat-label">CHALLENGES COMPLETED</span>
            <span className="victory-stat-value">
              {completedChallenges}/{totalChallenges}
            </span>
          </div>
          <div className="victory-stat-row">
            <span className="victory-stat-label">TOTAL XP EARNED</span>
            <span className="victory-stat-value">{totalXp.toLocaleString()}</span>
          </div>
          <div className="victory-stat-row">
            <span className="victory-stat-label">AGENT LEVEL</span>
            <span className="victory-stat-value">LVL {level}</span>
          </div>
        </div>

        <div className="victory-divider">{'═'.repeat(48)}</div>

        <div className="victory-freemode">
          <p className="victory-freemode-header">
            {'>>>'} FREE MODE UNLOCKED {'<<<'}
          </p>
          <p className="victory-freemode-text">
            All floors are now accessible. Revisit any terminal, replay challenges, and explore at
            your leisure.
          </p>
        </div>

        <div className="victory-actions">
          <button className="victory-btn victory-btn--primary" onClick={onContinue} type="button">
            [{'>'} CONTINUE IN FREE MODE]
          </button>
          <button
            className="victory-btn victory-btn--secondary"
            onClick={onReturnToTitle}
            type="button"
          >
            [RETURN TO TITLE]
          </button>
        </div>
      </div>
    </div>
  );
}

export const VictoryScreen = React.memo(VictoryScreenInner);
