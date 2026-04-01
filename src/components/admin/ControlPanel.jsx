import React, { useState } from "react";
import SimpleFeatureControl from "./SimpleFeatureControl";
import SystemMonitor from "./SystemMonitor";

const ControlPanel = ({
  adminStats,
  featureControl,
  featureCategories,
  onToggleFeature,
  onToggleCategory,
  onResetToDefaults,
  onExportConfig,
  onImportConfig,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Feature Control - Main Panel */}
      <SimpleFeatureControl
        featureControl={featureControl}
        featureCategories={featureCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleFeature={onToggleFeature}
        onToggleCategory={onToggleCategory}
        onResetToDefaults={onResetToDefaults}
        onExportConfig={onExportConfig}
        onImportConfig={onImportConfig}
      />

      {/* System Monitor */}
      <SystemMonitor adminStats={adminStats} />
    </div>
  );
};

export default ControlPanel;
