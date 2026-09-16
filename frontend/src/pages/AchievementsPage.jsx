import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  Rocket, 
  BookOpen, 
  Target, 
  Crown, 
  Flame, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  Trophy,
  Filter,
  RefreshCw
} from 'lucide-react';

const iconMap = {
  Rocket: Rocket,
  BookOpen: BookOpen,
  Award: Award,
  Target: Target,
  Crown: Crown,
  Flame: Flame,
  Zap: Zap,
  Sparkles: Sparkles,
  Trophy: Trophy
};

const AchievementsPage = () => {
  const { achievements, fetchAchievements } = useQuiz();
  const { currentUser } = useAuth();
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (fetchAchievements) await fetchAchievements();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const totalAchXp = achievements
    .filter(a => a.isUnlocked)
    .reduce((acc, curr) => acc + (curr.xpAward || 0), 0);

  const getTierBadge = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'bronze':
        return <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.3)' }}>Bronze Tier</span>;
      case 'silver':
        return <span className="badge" style={{ background: 'rgba(203, 213, 225, 0.15)', color: '#cbd5e1', border: '1px solid rgba(203, 213, 225, 0.3)' }}>Silver Tier</span>;
      case 'gold':
        return <span className="badge badge-gold">Gold Tier</span>;
      case 'platinum':
        return <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>Platinum Tier</span>;
      default:
        return <span className="badge badge-gray">{tier}</span>;
    }
  };

  // Filtered Achievements
  const filteredAchievements = achievements.filter(ach => {
    const matchesTier = tierFilter === 'All' || ach.badgeTier?.toLowerCase() === tierFilter.toLowerCase();
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Unlocked' ? ach.isUnlocked :
      !ach.isUnlocked;
    return matchesTier && matchesStatus;
  });

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> Hall of Laurels
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Achievements & Badges</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 620, margin: '0.5rem auto 0' }}>
          Unlock milestone badges as you expand your quiz mastery. Each achievement rewards substantial bonus XP and reputation!
        </p>
      </div>

      {/* Progress Summary Card */}
      <div className="card glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unlocked Badges</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {unlockedCount} <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)' }}>/ {totalCount}</span>
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Achievement Bonus XP</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)' }}>
              +{totalAchXp.toLocaleString()} XP
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Streak Record</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={28} /> {currentUser?.streak || 4} Days
            </div>
          </div>
        </div>

        {/* Global completion bar */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Overall Completion</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="progress-track" style={{ margin: 0, height: 8 }}>
            <div className="progress-fill" style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.75rem',
        padding: '0.85rem 1.25rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Tier Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Tier:</span>
          {['All', 'Bronze', 'Silver', 'Gold', 'Platinum'].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`btn btn-sm ${tierFilter === tier ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Status Tabs & Refresh */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Status:</span>
          {['All', 'Unlocked', 'Locked'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            >
              {st}
            </button>
          ))}
          <button
            onClick={handleRefresh}
            title="Refresh Achievements"
            className="btn btn-sm btn-outline"
            style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {filteredAchievements.map(ach => {
          const IconComponent = iconMap[ach.icon] || Award;
          const isUnlocked = ach.isUnlocked;
          const progressVal = Number(ach.progress || 0);
          const maxVal = Number(ach.maxProgress || 1);
          const progressPercent = Math.min(Math.round((progressVal / maxVal) * 100), 100);

          return (
            <div 
              key={ach.id || ach.code} 
              className="card"
              style={{
                opacity: isUnlocked ? 1 : 0.75,
                background: isUnlocked ? 'var(--bg-card)' : 'rgba(15, 23, 42, 0.45)',
                border: isUnlocked ? '1px solid var(--border-default)' : '1px dashed var(--border-subtle)',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-md)',
                  background: isUnlocked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: isUnlocked ? 'var(--gold)' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isUnlocked ? '0 0 16px rgba(245, 158, 11, 0.25)' : 'none'
                }}>
                  <IconComponent size={26} />
                </div>
                <div>
                  {getTierBadge(ach.badgeTier)}
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {ach.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.5, minHeight: 42 }}>
                {ach.description}
              </p>

              {/* Progress or Completion Strip */}
              <div style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.825rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {isUnlocked ? (
                    <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={15} /> Unlocked {ach.unlockedAt ? `on ${new Date(ach.unlockedAt).toLocaleDateString()}` : ''}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={14} /> Progress: {progressVal} / {maxVal}
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  +{ach.xpAward} XP
                </div>
              </div>

              {/* Mini progress bar if locked */}
              {!isUnlocked && (
                <div className="progress-track" style={{ marginTop: '0.65rem', marginBottom: 0, height: 5 }}>
                  <div className="progress-fill" style={{ width: `${progressPercent}%`, background: 'var(--text-dim)' }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>No achievements match your selected filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
