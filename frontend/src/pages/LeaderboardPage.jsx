import React, { useState, useEffect } from 'react';
import { initialLeaderboard } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Flame, 
  Zap, 
  Award, 
  Search, 
  User, 
  RefreshCw, 
  Loader2,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [searchFilter, setSearchFilter] = useState('');
  const [leaderboardData, setLeaderboardData] = useState({
    podium: [],
    standings: [],
    userRank: null
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = async (timeframe) => {
    try {
      const res = await api.get(`/leaderboard?timeframe=${timeframe}`);
      if (res?.data?.standings && Array.isArray(res.data.standings)) {
        setLeaderboardData({
          podium: res.data.podium || res.data.standings.slice(0, 3),
          standings: res.data.standings,
          userRank: res.data.userRank || null
        });
        return;
      }
    } catch (e) {
      console.warn('[LEADERBOARD NOTICE] Falling back to local data:', e.message);
    }

    // Local fallback
    const mockList = initialLeaderboard[timeframe] || initialLeaderboard.global;
    setLeaderboardData({
      podium: mockList.slice(0, 3),
      standings: mockList,
      userRank: mockList.find(u => u.username.includes('You') || u.username.toLowerCase().includes(currentUser?.name?.toLowerCase() || '')) || null
    });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchLeaderboard(activeTab).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [activeTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboard(activeTab);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const { podium, standings, userRank } = leaderboardData;

  const filteredStandings = standings.filter(user => 
    user.username.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const topThree = podium.length >= 3 ? podium : standings.slice(0, 3);
  const remainingRanks = filteredStandings.slice(searchFilter ? 0 : (topThree.length >= 3 ? 3 : 0));

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
          <Trophy size={14} /> Competitive Rankings
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Galaxy Leaderboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 600, margin: '0.5rem auto 0' }}>
          Top scholars competing across Quiziverse. Earn XP, maintain streaks, and rise up the galactic ranks.
        </p>

        {/* Tab Switcher */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--bg-card)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-default)',
          marginTop: '1.75rem',
          gap: '0.25rem',
          alignItems: 'center'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`btn btn-sm ${activeTab === 'global' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem' }}
          >
            All-Time Global
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`btn btn-sm ${activeTab === 'weekly' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem' }}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`btn btn-sm ${activeTab === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem' }}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh Leaderboard"
            className="btn btn-sm btn-ghost"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 0.75rem', marginLeft: '0.25rem' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <Loader2 size={40} className="spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-indigo)' }} />
          <h3 style={{ color: 'var(--text-secondary)' }}>Calculating Real-Time Galaxy Rankings...</h3>
        </div>
      ) : (
        <>
          {/* Top 3 Podium (when no search filter active) */}
          {!searchFilter && topThree.length >= 3 && (
            <div className="podium-wrapper">
              {/* Rank 2 - Silver */}
              <div className="podium-card podium-2">
                <div style={{ color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: 700 }}>
                  <Medal size={28} />
                </div>
                <div className="podium-avatar" style={{ background: topThree[1]?.avatarBg || '#94a3b8' }}>
                  {topThree[1]?.username?.charAt(0) || 'S'}
                </div>
                <span className="badge badge-gray" style={{ marginBottom: '0.5rem' }}>Rank #2</span>
                <h3 style={{ fontSize: '1.15rem' }}>{topThree[1]?.username}</h3>
                <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem' }}>
                  {topThree[1]?.points?.toLocaleString()} pts
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {topThree[1]?.xp?.toLocaleString()} XP • {topThree[1]?.quizzesCompleted ?? 0} Quizzes
                </div>
              </div>

              {/* Rank 1 - Gold Champion */}
              <div className="podium-card podium-1">
                <div className="podium-crown">
                  <Crown size={38} />
                </div>
                <div className="podium-avatar" style={{ 
                  background: topThree[0]?.avatarBg || '#f59e0b', 
                  width: 74, 
                  height: 74, 
                  boxShadow: '0 0 24px rgba(245, 158, 11, 0.4)' 
                }}>
                  {topThree[0]?.username?.charAt(0) || 'C'}
                </div>
                <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Champion #1</span>
                <h3 style={{ fontSize: '1.35rem' }}>{topThree[0]?.username}</h3>
                <div style={{ color: 'var(--gold)', fontWeight: 900, fontSize: '1.6rem', marginTop: '0.5rem' }}>
                  {topThree[0]?.points?.toLocaleString()} pts
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {topThree[0]?.xp?.toLocaleString()} XP • {topThree[0]?.quizzesCompleted ?? 0} Quizzes
                </div>
              </div>

              {/* Rank 3 - Bronze */}
              <div className="podium-card podium-3">
                <div style={{ color: '#d97706', marginBottom: '0.25rem', fontWeight: 700 }}>
                  <Medal size={28} />
                </div>
                <div className="podium-avatar" style={{ background: topThree[2]?.avatarBg || '#d97706' }}>
                  {topThree[2]?.username?.charAt(0) || 'B'}
                </div>
                <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Rank #3</span>
                <h3 style={{ fontSize: '1.15rem' }}>{topThree[2]?.username}</h3>
                <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem' }}>
                  {topThree[2]?.points?.toLocaleString()} pts
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {topThree[2]?.xp?.toLocaleString()} XP • {topThree[2]?.quizzesCompleted ?? 0} Quizzes
                </div>
              </div>
            </div>
          )}

          {/* User's Current Rank Pinned Alert if outside top 3 */}
          {userRank && userRank.rank > 3 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'var(--accent-indigo)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  #{userRank.rank}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Your Current Rank</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Rank #{userRank.rank} in {activeTab === 'global' ? 'All-Time Global' : activeTab === 'weekly' ? 'This Week' : 'This Month'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 800 }}>{userRank.points?.toLocaleString()} pts</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{userRank.xp?.toLocaleString()} XP</div>
                </div>
                <span className="badge badge-indigo">YOU</span>
              </div>
            </div>
          )}

          {/* Rankings Table Card */}
          <div className="card" style={{ marginBottom: '4rem' }}>
            {/* Table Filter / Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Full Standings</h3>
                <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                  {filteredStandings.length} Competitors
                </span>
              </div>

              <div style={{ position: 'relative', width: 280 }}>
                <input
                  type="text"
                  placeholder="Find participant..."
                  className="form-input"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Rank</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Participant</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Points</th>
                    <th style={{ padding: '0.75rem 1rem' }}>XP</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Completed</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {remainingRanks.map(item => {
                    const isMe = item.isCurrentUser || 
                                 item.username.toLowerCase().includes('you') || 
                                 item.username.toLowerCase().includes(currentUser?.name?.toLowerCase() || '');

                    return (
                      <tr 
                        key={`${item.rank}-${item.username}`} 
                        style={{ 
                          borderBottom: '1px solid var(--border-subtle)',
                          background: isMe ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: 700 }}>
                          <span style={{ 
                            color: item.rank <= 3 ? 'var(--gold)' : 'var(--text-muted)',
                            fontSize: '1rem'
                          }}>
                            #{item.rank}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: item.avatarBg || '#6366f1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}>
                              {item.username.charAt(0)}
                            </div>
                            <span style={{ fontWeight: isMe ? 800 : 600 }}>
                              {item.username} {isMe && <span className="badge badge-indigo" style={{ marginLeft: 6, fontSize: '0.65rem' }}>YOU</span>}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--gold)', fontWeight: 700 }}>
                          {item.points.toLocaleString()} pts
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                          {item.xp.toLocaleString()} XP
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                          {item.quizzesCompleted} Quizzes
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontWeight: 700 }}>
                            <Flame size={15} /> {item.streak}d
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {remainingRanks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <p>No participants match your search query.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
