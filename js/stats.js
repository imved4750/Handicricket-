import { db, ref, update } from './firebase.js';

export function updateStats(matchId, playerId, stats) {
  const updates = {};
  Object.keys(stats).forEach(key => {
    updates[`matches/${matchId}/stats/${playerId}/${key}`] = stats[key];
  });
  return update(ref(db), updates);
}

export function calculateMilestones(stats) {
  const milestones = [];
  if (stats.runs >= 50) milestones.push('Fifty');
  if (stats.runs >= 100) milestones.push('Century');
  if (stats.wickets >= 3) milestones.push('3-wicket haul');
  if (stats.wickets >= 5) milestones.push('5-wicket haul');
  return milestones;
}
