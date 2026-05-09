import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/5">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse-slow" />
          AI-Powered Learning Platform
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Level Up Your{' '}
          <span className="gradient-text">Learning</span>
        </h1>

        <p className="text-xl text-text-secondary mb-10 leading-relaxed">
          A gamified AI learning OS. Track progress, earn XP, complete daily quests,
          and get personalized AI mentor feedback — every single day.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
            Start Learning Free →
          </Link>
          <Link href="/auth/login" className="btn-secondary text-lg px-8 py-4">
            Sign In
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-16 flex-wrap">
          {[
            { label: 'Daily Quests', value: '5+' },
            { label: 'Skill Trees', value: '5' },
            { label: 'XP System', value: '∞' },
            { label: 'AI Mentor', value: '24/7' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold font-mono gradient-text">{stat.value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
