import React from 'react';
import { useTranslation } from 'react-i18next';
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

const ASCII_BANNER_DE = `
 ╔═══════════════════════════════════════════════════╗
 ║  ███████╗██╗   ██╗███████╗████████╗███████╗███╗  ║
 ║  ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ║
 ║  ███████╗ ╚████╔╝ ███████╗   ██║   █████╗ ██╔██╗║
 ║  ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝ ██║╚█║║
 ║  ███████║   ██║   ███████║   ██║   ███████╗██║ ║║║
 ║  ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝ ║║║
 ║                                                   ║
 ║  ███████╗██╗ ██████╗██╗  ██╗███████╗██████╗ ██╗   ║
 ║  ██╔════╝██║██╔════╝██║  ██║██╔════╝██╔══██╗██║   ║
 ║  ███████╗██║██║     ███████║█████╗  ██████╔╝██║   ║
 ║  ╚════██║██║██║     ██╔══██║██╔══╝  ██╔══██╗╚═╝   ║
 ║  ███████║██║╚██████╗██║  ██║███████╗██║  ██║██╗   ║
 ║  ╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ║
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

function getRatingLabelKey(rating: string): string {
  switch (rating) {
    case 'S':
      return 'victory.rating_s';
    case 'A':
      return 'victory.rating_a';
    case 'B':
      return 'victory.rating_b';
    default:
      return 'victory.rating_c';
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
  const { t, i18n } = useTranslation('ui');
  const rating = getAgentRating(completedChallenges, totalChallenges, totalXp, level);
  const ratingLabel = t(getRatingLabelKey(rating));

  return (
    <div className="victory-screen">
      <div className="victory-content">
        <pre className="victory-ascii-banner" aria-hidden="true">
          {i18n.language.startsWith('de') ? ASCII_BANNER_DE : ASCII_BANNER}
        </pre>

        <h1 className="victory-header">{t('victory.header')}</h1>
        <p className="victory-subheader">{t('victory.subheader')}</p>

        <div className="victory-divider">{'═'.repeat(48)}</div>

        <div className="victory-agent-section">
          <p className="victory-agent-name">{t('victory.agent', { name: playerName })}</p>
          <p className={`victory-rating victory-rating--${rating.toLowerCase()}`}>
            {t('victory.rating', { rating, label: ratingLabel })}
          </p>
        </div>

        <div className="victory-divider">{'─'.repeat(48)}</div>

        <div className="victory-stats">
          <div className="victory-stat-row">
            <span className="victory-stat-label">{t('victory.stat_challenges')}</span>
            <span className="victory-stat-value">
              {completedChallenges}/{totalChallenges}
            </span>
          </div>
          <div className="victory-stat-row">
            <span className="victory-stat-label">{t('victory.stat_xp')}</span>
            <span className="victory-stat-value">{totalXp.toLocaleString()}</span>
          </div>
          <div className="victory-stat-row">
            <span className="victory-stat-label">{t('victory.stat_level')}</span>
            <span className="victory-stat-value">{t('victory.level_value', { level })}</span>
          </div>
        </div>

        <div className="victory-divider">{'═'.repeat(48)}</div>

        <div className="victory-freemode">
          <p className="victory-freemode-header">{t('victory.free_mode_header')}</p>
          <p className="victory-freemode-text">{t('victory.free_mode_text')}</p>
        </div>

        <div className="victory-actions">
          <button className="victory-btn victory-btn--primary" onClick={onContinue} type="button">
            {t('victory.continue')}
          </button>
          <button
            className="victory-btn victory-btn--secondary"
            onClick={onReturnToTitle}
            type="button"
          >
            {t('victory.return_to_title')}
          </button>
        </div>
      </div>
    </div>
  );
}

export const VictoryScreen = React.memo(VictoryScreenInner);
