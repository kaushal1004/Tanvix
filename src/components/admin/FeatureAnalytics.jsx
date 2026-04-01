import React from "react";

const FeatureAnalytics = ({ featureControl, featureCategories }) => {
  return (
    <div className="space-y-6">
      {/* Feature Usage Analytics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Feature Usage Analytics
        </h3>
        <div className="space-y-4">
          {Object.entries(featureCategories).map(([key, category]) => {
            const categoryFeatures = Object.keys(featureControl).filter(
              (f) => featureControl[f].category === key,
            );
            const enabledCount = categoryFeatures.filter(
              (f) => featureControl[f].enabled,
            ).length;
            const usagePercent = (enabledCount / categoryFeatures.length) * 100;

            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {category.icon} {category.name}
                  </span>
                  <span className="font-semibold">
                    {enabledCount}/{categoryFeatures.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${category.color}-500`}
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Dependencies Map */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Feature Dependencies Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(featureControl).map(([key, feature]) => {
            if (feature.dependencies.length === 0) return null;

            const allDepsMet = feature.dependencies.every(
              (dep) => featureControl[dep].enabled,
            );
            const category = featureCategories[feature.category];

            return (
              <div
                key={key}
                className={`p-3 rounded-lg border ${
                  allDepsMet
                    ? "bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{category.icon}</span>
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Depends on:
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {feature.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className={`text-xs px-2 py-1 rounded ${
                        featureControl[dep].enabled
                          ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                          : "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {dep.replace(/([A-Z])/g, " $1")}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Impact Analysis
          </h3>
          <div className="space-y-3">
            {["critical", "high", "medium", "low"].map((impact) => {
              const impactFeatures = Object.values(featureControl).filter(
                (f) => f.impact === impact,
              );
              const enabledCount = impactFeatures.filter(
                (f) => f.enabled,
              ).length;

              return (
                <div key={impact} className="flex justify-between items-center">
                  <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                    {impact} Impact:
                  </span>
                  <span className="font-semibold">
                    {enabledCount}/{impactFeatures.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(featureCategories).map(([key, category]) => {
              const categoryFeatures = Object.keys(featureControl).filter(
                (f) => featureControl[f].category === key,
              );

              return (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category.icon} {category.name}:
                  </span>
                  <span className="font-semibold">
                    {categoryFeatures.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            System Readiness
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Core Features:
              </span>
              <span
                className={`font-semibold ${
                  Object.values(featureControl).filter(
                    (f) => f.category === "core" && f.enabled,
                  ).length ===
                  Object.values(featureControl).filter(
                    (f) => f.category === "core",
                  ).length
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {
                  Object.values(featureControl).filter(
                    (f) => f.category === "core" && f.enabled,
                  ).length
                }
                /
                {
                  Object.values(featureControl).filter(
                    (f) => f.category === "core",
                  ).length
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Dependency Issues:
              </span>
              <span
                className={`font-semibold ${
                  Object.values(featureControl).some(
                    (f) =>
                      f.dependencies.some(
                        (dep) => !featureControl[dep].enabled,
                      ) && f.enabled,
                  )
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {
                  Object.values(featureControl).filter(
                    (f) =>
                      f.dependencies.some(
                        (dep) => !featureControl[dep].enabled,
                      ) && f.enabled,
                  ).length
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Enabled:
              </span>
              <span className="font-semibold text-blue-600">
                {Object.values(featureControl).filter((f) => f.enabled).length}/
                {Object.keys(featureControl).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureAnalytics;
