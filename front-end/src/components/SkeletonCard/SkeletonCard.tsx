import './SkeletonCard.scss';

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-flag"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = () => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
