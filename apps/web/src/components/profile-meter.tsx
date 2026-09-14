'use client';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface ProfileMeterProps {
  profile: {
    hasAvatar: boolean;
    hasHeadline: boolean;
    hasBio: boolean;
    hasPortfolio: boolean;
    hasServices: boolean;
    hasSkills: boolean;
  };
  className?: string;
}

export function ProfileMeter({ profile, className }: ProfileMeterProps) {
  const checks = Object.values(profile).filter(Boolean).length;
  const total = Object.keys(profile).length;
  const percentage = Math.round((checks / total) * 100);

  const tips = [
    !profile.hasAvatar && 'Add a profile photo',
    !profile.hasHeadline && 'Add a headline describing your expertise',
    !profile.hasBio && 'Write a bio about your experience',
    !profile.hasPortfolio && 'Add portfolio items to showcase your work',
    !profile.hasServices && 'Create service packages',
    !profile.hasSkills && 'Add your skills',
  ].filter(Boolean);

  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Profile Completeness</h3>
        <span className="text-2xl font-bold text-primary">{percentage}%</span>
      </div>

      <div className="w-full h-3 bg-surface rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {tips.length > 0 ? (
        <div>
          <p className="text-sm font-medium mb-2">To improve your profile:</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            {tips.slice(0, 3).map((tip, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-success">🎉 Your profile is complete!</p>
      )}
    </div>
  );
}
