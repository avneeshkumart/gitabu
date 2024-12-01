export const formatStarCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
};

export const formatDate = (date) => {
  const now = new Date();
  const updated = new Date(date);
  const diffTime = Math.abs(now - updated);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays < 1) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `Updated ${diffMinutes} minutes ago`;
    }
    return `Updated ${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Updated yesterday';
  } else if (diffDays < 30) {
    return `Updated ${diffDays} days ago`;
  } else if (diffMonths < 12) {
    return `Updated ${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else {
    return `Updated ${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
}; 