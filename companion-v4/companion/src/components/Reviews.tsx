import { useState, useEffect } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface Review {
  id: number;
  first_name: string;
  last_name: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
}

interface ReviewsProps {
  targetType: 'event' | 'website';
  targetId?: string;   // event ext_id, omit for website reviews
  eventTitle?: string;
}

const StarRating = ({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 transition-colors ${
            star <= (hover || value)
              ? 'fill-amber-400 text-amber-400'
              : 'text-muted-foreground'
          } ${!readonly ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  );
};

const labels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const Reviews = ({ targetType, targetId, eventTitle }: ReviewsProps) => {
  const { user, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE || '';

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: targetType });
      if (targetType === 'event' && targetId) params.append('event_id', targetId);
      const res = await fetch(`${apiBase}/reviews.php?${params}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.avg_rating);
        setTotal(data.total);
      }
    } catch {
      // server offline — silently degrade
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [targetType, targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setSubmitMsg({ text: 'Please select a star rating.', ok: false }); return; }
    if (!body.trim()) { setSubmitMsg({ text: 'Please write something about your experience.', ok: false }); return; }

    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await fetch(`${apiBase}/reviews.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: (user as any)?.id,
          target_type: targetType,
          target_id: targetId ?? null,
          rating,
          title,
          body,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMsg({ text: 'Review submitted! Thank you.', ok: true });
        setRating(0); setTitle(''); setBody('');
        fetchReviews();
      } else {
        setSubmitMsg({ text: data.message || 'Could not submit review.', ok: false });
      }
    } catch {
      setSubmitMsg({ text: 'Server unreachable. Your review was not saved.', ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        {targetType === 'event' ? `Reviews for ${eventTitle ?? 'this event'}` : 'Site Reviews'}
      </h2>

      {/* Summary bar */}
      {total > 0 && (
        <div className="flex flex-col md:flex-row gap-6 mb-8 p-5 bg-muted rounded-xl">
          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
            <StarRating value={Math.round(avgRating)} readonly />
            <span className="text-sm text-muted-foreground mt-1">{total} review{total !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBars.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-muted-foreground">{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-7 text-muted-foreground text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write a review */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-muted rounded-xl space-y-4">
          <h3 className="font-semibold text-foreground">Write a Review</h3>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Your Rating *</label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <span className="text-sm font-medium text-foreground">{labels[rating]}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarise your experience"
              maxLength={200}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Review *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others about your experience…"
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <span className="text-xs text-muted-foreground">{body.length}/1000</span>
          </div>

          {submitMsg && (
            <p className={`text-sm font-medium ${submitMsg.ok ? 'text-green-500' : 'text-red-400'}`}>
              {submitMsg.text}
            </p>
          )}

          <Button type="submit" variant="hero" disabled={submitting} className="gap-2">
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting…' : 'Submit Review'}
          </Button>
        </form>
      ) : (
        <div className="mb-8 p-5 bg-muted rounded-xl text-center">
          <p className="text-muted-foreground text-sm">
            <a href="/signin" className="text-primary font-medium hover:underline">Sign in</a>{' '}
            to leave a review.
          </p>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-6">
          No reviews yet — be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-4 pb-5 border-b border-border last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-sm font-bold">
                  {r.first_name[0]}{r.last_name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                  <span className="font-semibold text-foreground text-sm">
                    {r.first_name} {r.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                </div>
                <StarRating value={r.rating} readonly />
                {r.title && (
                  <p className="font-medium text-foreground text-sm mt-2">{r.title}</p>
                )}
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
