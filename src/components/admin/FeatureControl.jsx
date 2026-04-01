import React from "react";

const FeatureControl = ({
  featureControl,
  featureCategories,
  selectedCategory,
  setSelectedCategory,
  featureSearch,
  setFeatureSearch,
  showAdvancedSettings,
  setShowAdvancedSettings,
  onToggleFeature,
  onToggleCategory,
  onResetToDefaults,
  onExportConfig,
  onImportConfig,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Advanced Feature Control
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage system features with dependencies and impact analysis
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={onResetToDefaults}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded text-sm"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Advanced Settings Panel */}
      {showAdvancedSettings && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Advanced Controls
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              >
                <option value="all">All Categories</option>
                {Object.entries(featureCategories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Search Features
              </label>
              <input
                type="text"
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                placeholder="Search features..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={onExportConfig}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
              >
                📤 Export
              </button>
              <label className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm cursor-pointer text-center">
                📥 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportConfig}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(featureCategories).map(([key, category]) => {
          const categoryFeatures = Object.keys(featureControl).filter(
            (f) => featureControl[f].category === key,
          );
          const enabledCount = categoryFeatures.filter(
            (f) => featureControl[f].enabled,
          ).length;
          const totalCount = categoryFeatures.length;

          return (
            <div
              key={key}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCategory === key
                  ? `bg-${category.color}-100 dark:bg-${category.color}-900 border-2 border-${category.color}-500`
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              onClick={() =>
                setSelectedCategory(selectedCategory === key ? "all" : key)
              }
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {enabledCount}/{totalCount} enabled
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCategory(key);
                  }}
                  className={`mt-2 px-2 py-1 rounded text-xs ${
                    enabledCount === totalCount
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : enabledCount === 0
                        ? "bg-gray-400 hover:bg-gray-500 text-white"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                  }`}
                >
                  {enabledCount === totalCount ? "Disable All" : "Enable All"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(featureControl)
          .filter(([key, feature]) => {
            const matchesCategory =
              selectedCategory === "all" ||
              feature.category === selectedCategory;
            const matchesSearch =
              featureSearch === "" ||
              key.toLowerCase().includes(featureSearch.toLowerCase()) ||
              feature.description
                .toLowerCase()
                .includes(featureSearch.toLowerCase());
            return matchesCategory && matchesSearch;
          })
          .map(([key, feature]) => {
            const category = featureCategories[feature.category];
            const hasUnmetDeps = feature.dependencies.some(
              (dep) => !featureControl[dep].enabled,
            );
            const impactColor = {
              critical: "text-red-600",
              high: "text-orange-600",
              medium: "text-yellow-600",
              low: "text-green-600",
            }[feature.impact];

            return (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  feature.enabled
                    ? "bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700"
                    : hasUnmetDeps
                      ? "bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${impactColor} bg-current bg-opacity-20`}
                      >
                        {feature.impact}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleFeature(key)}
                    disabled={hasUnmetDeps && !feature.enabled}
                    className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${
                      feature.enabled
                        ? "bg-green-500 justify-end"
                        : hasUnmetDeps
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-gray-400 justify-start hover:bg-gray-500"
                    }`}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                  </button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {feature.description}
                </p>

                {feature.dependencies.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-500 dark:text-gray-500">
                      Requires:{" "}
                    </span>
                    <span
                      className={
                        hasUnmetDeps ? "text-red-600" : "text-green-600"
                      }
                    >
                      {feature.dependencies.join(", ")}
                    </span>
                  </div>
                )}

                {hasUnmetDeps && !feature.enabled && (
                  <div className="text-xs text-red-600 mt-1">
                    ⚠️ Dependencies not met
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {Object.keys(featureControl).filter(([key, feature]) => {
        const matchesCategory =
          selectedCategory === "all" || feature.category === selectedCategory;
        const matchesSearch =
          featureSearch === "" ||
          key.toLowerCase().includes(featureSearch.toLowerCase()) ||
          feature.description
            .toLowerCase()
            .includes(featureSearch.toLowerCase());
        return matchesCategory && matchesSearch;
      }).length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No features match your current filters.
        </div>
      )}
    </div>
  );
};

export default FeatureControl;
