import React from "react";

const Exams = ({ exams }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">🧪 Tests / Exams</h2>
      <div className="space-y-4">
        {exams.map((exam, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-semibold">{exam.name}</h3>
            <p>
              <strong>Date:</strong> {exam.date}
            </p>
            <p>
              <strong>Duration:</strong> {exam.duration}
            </p>
            {exam.score && (
              <p>
                <strong>Score:</strong> {exam.score}
              </p>
            )}
            {exam.result && (
              <p>
                <strong>Result:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${exam.result === "Pass" ? "bg-green-200" : "bg-red-200"}`}
                >
                  {exam.result}
                </span>
              </p>
            )}
            {exam.rank && (
              <p>
                <strong>Rank:</strong> {exam.rank}
              </p>
            )}
            {!exam.score && <p className="text-gray-500">Exam not taken yet</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
