import React from "react";

const Modal = ({
  showModal,
  formData,
  setFormData,
  onClose,
  onSubmitUser,
  onSubmitCourse,
}) => {
  if (!showModal) return null;

  const isTeacher = showModal === "addTeacher";
  const isStudent = showModal === "addStudent";
  const isCourse = showModal === "addCourse";
  const isEditTeacher = showModal === "editTeacher";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isTeacher
              ? "Add Teacher"
              : isStudent
                ? "Add Student"
                : isCourse
                  ? "Add Course"
                  : "Edit Teacher"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={isCourse ? onSubmitCourse : onSubmitUser}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              {isCourse ? "Course Title" : "Name"}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              {isCourse ? "Instructor" : "Email"}
            </label>
            <input
              type={isCourse ? "text" : "email"}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {(isTeacher || isStudent) && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Department
                </label>
                <select
                  value={formData.department || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              {isTeacher && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      value={formData.qualifications || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          qualifications: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., PhD in Computer Science"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 8 years"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {isCourse && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Department
                </label>
                <select
                  value={formData.department || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Credits
                </label>
                <input
                  type="number"
                  value={formData.credits || 3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="6"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12 weeks"
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isEditTeacher ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
