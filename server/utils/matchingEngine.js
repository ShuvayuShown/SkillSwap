/**
 * Rule-Based Skill Matching Engine
 * Computes match score and explains reasons based on complementary skills.
 */

export const calculateSkillMatches = (currentUser, candidates) => {
  if (!currentUser || !Array.isArray(candidates)) return [];

  const userWantsToLearn = (currentUser.skillsToLearn || []).map((s) => ({
    name: s.name.toLowerCase().trim(),
    category: s.category,
    rawName: s.name
  }));

  const userCanTeach = (currentUser.skillsToTeach || []).map((s) => ({
    name: s.name.toLowerCase().trim(),
    category: s.category,
    rawName: s.name
  }));

  const scoredRecommendations = candidates
    .filter((candidate) => candidate._id.toString() !== currentUser._id.toString())
    .map((candidate) => {
      let score = 0;
      const reasons = [];
      const complementaryTeaching = [];
      const complementaryLearning = [];

      const candidateTeaches = (candidate.skillsToTeach || []).map((s) => ({
        name: s.name.toLowerCase().trim(),
        category: s.category,
        level: s.level,
        rawName: s.name
      }));

      const candidateWants = (candidate.skillsToLearn || []).map((s) => ({
        name: s.name.toLowerCase().trim(),
        category: s.category,
        level: s.level,
        rawName: s.name
      }));

      // Check 1: Can candidate teach what user wants to learn?
      for (const want of userWantsToLearn) {
        const found = candidateTeaches.find(
          (ct) => ct.name === want.name || ct.name.includes(want.name) || want.name.includes(ct.name)
        );
        if (found) {
          complementaryTeaching.push(found.rawName);
        }
      }

      // Check 2: Does candidate want to learn what user can teach?
      for (const teach of userCanTeach) {
        const found = candidateWants.find(
          (cw) => cw.name === teach.name || cw.name.includes(teach.name) || teach.name.includes(cw.name)
        );
        if (found) {
          complementaryLearning.push(found.rawName);
        }
      }

      // Scoring logic:
      if (complementaryTeaching.length > 0 && complementaryLearning.length > 0) {
        // Double complementary match!
        score += 100 + complementaryTeaching.length * 15 + complementaryLearning.length * 15;
        reasons.push(
          `Perfect Match: Can teach you "${complementaryTeaching[0]}" and wants to learn "${complementaryLearning[0]}" from you!`
        );
      } else if (complementaryTeaching.length > 0) {
        score += 60 + complementaryTeaching.length * 10;
        reasons.push(`Can teach you "${complementaryTeaching.join(', ')}" (matches your learning goals)`);
      } else if (complementaryLearning.length > 0) {
        score += 40 + complementaryLearning.length * 10;
        reasons.push(`Eager to learn "${complementaryLearning.join(', ')}" which you offer`);
      } else {
        // Category affinity
        const teachCategories = new Set(userCanTeach.map((s) => s.category));
        const learnCategories = new Set(userWantsToLearn.map((s) => s.category));
        
        const sharedCategories = candidateTeaches.filter((ct) => learnCategories.has(ct.category));
        if (sharedCategories.length > 0) {
          score += 25;
          reasons.push(`Teaches in your interest category: ${sharedCategories[0].category}`);
        }
      }

      // Bonus for candidates with college affinity or high ratings
      if (candidate.college && currentUser.college && candidate.college.toLowerCase() === currentUser.college.toLowerCase()) {
        score += 10;
        reasons.push(`Same campus: ${candidate.college}`);
      }

      return {
        student: candidate,
        score,
        reasons,
        primaryReason: reasons[0] || 'Popular skill exchanger in the community',
        matchType:
          score >= 100
            ? 'perfect'
            : score >= 60
            ? 'high'
            : score >= 25
            ? 'category'
            : 'community'
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredRecommendations;
};
