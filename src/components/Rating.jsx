import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Rating() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const labels = {
    1: "Poor 😞",
    2: "Fair 😐",
    3: "Good 😊",
    4: "Very Good 😄",
    5: "Excellent 😍",
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await API.get("/ratings");
      setRatings(res.data || []);

      // Calculate average
      if (res.data && res.data.length > 0) {
        const avg = (
          res.data.reduce((sum, r) => sum + (r.rating || 0), 0) /
          res.data.length
        ).toFixed(1);
        setAverageRating(avg);
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/ratings", {
        rating,
        feedback: feedback.trim(),
        timestamp: new Date(),
      });

      setSuccess("✅ Thank you for your rating!");
      setRating(0);
      setFeedback("");
      fetchRatings();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const StarIcon = ({ filled }) => (
    <span className={filled ? "text-yellow-400" : "text-gray-300"}>★</span>
  );

  return (
    <div className="space-y-6">
      {/* Rating Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Give Rating Section */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-white border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>⭐</span> Give Your Rating
          </h3>

          <form onSubmit={submitRating} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                How would you rate your experience?
              </label>

              <div className="flex gap-3 items-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      onMouseEnter={() => setHoveredRating(r)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <StarIcon filled={r <= (hoveredRating || rating)} />
                    </button>
                  ))}
                </div>

                {(hoveredRating || rating) > 0 && (
                  <span className="text-sm font-semibold text-blue-600">
                    {labels[hoveredRating || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Text Area */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts and suggestions..."
                maxLength="200"
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {feedback.length}/200 characters
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Submitting..." : "📤 Submit Rating"}
            </button>
          </form>
        </div>

        {/* Rating Statistics Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow dark:from-gray-700 dark:to-gray-600 border border-blue-200 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📊</span> Rating Statistics
          </h3>

          {/* Average Rating */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-4 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              Average Rating
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-blue-600">
                {averageRating}
              </span>
              <div className="text-2xl text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} filled={i <= Math.round(averageRating)} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Based on {ratings.length}{" "}
              {ratings.length === 1 ? "rating" : "ratings"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Distribution
            </p>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter((r) => r.rating === star).length;
              const percentage =
                ratings.length > 0 ? (count / ratings.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium">{star}</span>
                  </div>
                  <div className="flex-1 bg-gray-300 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      {ratings.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💬</span> Recent Feedback
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings
              .filter((r) => r.feedback)
              .slice(0, 4)
              .map((r, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-yellow-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon key={i} filled={i <= r.rating} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {r.rating} Star{r.rating !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{r.feedback}"
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
