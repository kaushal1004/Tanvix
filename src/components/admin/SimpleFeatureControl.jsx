import React from "react";

// Utility function to get category features
const getCategoryFeatures = (featureControl, category) => {
  return Object.entries(featureControl).filter(
    ([, feature]) => feature.category === category,
  );
};

// Utility function to count enabled features
const countEnabled = (features) => features.filter(([, f]) => f.enabled).length;

// Reusable Progress Bar Component
const ProgressBar = ({ value, color = "blue" }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full bg-${color}-500`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs font-semibold w-8 text-right">{value}%</span>
  </div>
);

const SimpleFeatureControl = ({
  featureControl,
  featureCategories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onToggleFeature,
  onToggleCategory,
  onResetToDefaults,
  onExportConfig,
  onImportConfig,
}) => {
  // Filter features based on search and category
  const filteredFeatures = Object.entries(featureControl).filter(
    ([key, feature]) => {
      const categoryMatch =
        selectedCategory === "all" || feature.category === selectedCategory;
      const searchMatch =
        searchTerm === "" ||
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    },
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Feature Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enable or disable system features
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onResetToDefaults}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded text-sm"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Search Features
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search features..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
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
      </div>

      {/* Category Quick Toggles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(featureCategories).map(([key, category]) => {
          const catFeatures = getCategoryFeatures(featureControl, key);
          const enabled = countEnabled(catFeatures);
          const total = catFeatures.length;

          return (
            <div
              key={key}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {enabled}/{total}
                </div>
                <button
                  onClick={() => onToggleCategory(key)}
                  className={`mt-2 w-full py-1 px-2 text-xs rounded ${
                    enabled === total
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 hover:bg-gray-500 text-white"
                  }`}
                >
                  {enabled === total ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Import/Export */}
      <div className="flex gap-2">
        <button
          onClick={onExportConfig}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
        >
          📤 Export Config
        </button>
        <label className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm cursor-pointer text-center">
          📥 Import Config
          <input
            type="file"
            accept=".json"
            onChange={(e) => onImportConfig(e)}
            className="hidden"
          />
        </label>
      </div>

      {/* Features Grid */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
          Features ({filteredFeatures.length})
        </h4>

        {filteredFeatures.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No features match your search
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFeatures.map(([key, feature]) => {
              const category = featureCategories[feature.category];
              const hasUnmetDeps = feature.dependencies.some(
                (dep) => !featureControl[dep].enabled,
              );

              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border transition-all ${
                    feature.enabled
                      ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700"
                      : hasUnmetDeps
                        ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-800 dark:text-white">
                          {key.replace(/([A-Z])/g, " $1")}
                        </h5>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {feature.impact}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFeature(key)}
                      disabled={hasUnmetDeps && !feature.enabled}
                      className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${
                        feature.enabled
                          ? "bg-green-500 justify-end"
                          : hasUnmetDeps
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-gray-400 justify-start hover:bg-gray-500"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </p>

                  {feature.dependencies.length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {Object.entries(featureCategories).map(([key, category]) => {
          const catFeatures = getCategoryFeatures(featureControl, key);
          const enabled = countEnabled(catFeatures);
          const total = catFeatures.length;
          const percent = (enabled / total) * 100;

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {category.icon} {category.name}
                </span>
                <span className="font-semibold">
                  {enabled}/{total}
                </span>
              </div>
              <ProgressBar value={percent} color={category.color} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleFeatureControl;
