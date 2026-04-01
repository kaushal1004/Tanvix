import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";


const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    specialization: "",
    qualification: [
      {
        degree: "",
        institution: "",
        year: ""
      }
    ]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, specialization: e.target.value });
  };

  const handleQualificationChange = (e) => {
    const { name, value } = e.target;
    const updatedQualification = [...formData.qualification];
    updatedQualification[0][name] = value;

    setFormData({ ...formData, qualification: updatedQualification });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
    

    <div className="flex items-center justify-between mb-6">
  
  <h2 className="text-2xl font-bold text-blue-900">
    Application Form
  </h2>

  <button
    type="button"
    onClick={() => navigate("/blank")}
    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2"
  >
    
    <span>Skip</span>
    <FontAwesomeIcon icon={faAngleRight} />
  </button>

</div>

        {/* Specialization */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Specialization
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Enter specialization"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Qualification
        </h3>

        {/* Degree */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Degree
          </label>
          <input
            type="text"
            name="degree"
            value={formData.qualification[0].degree}
            onChange={handleQualificationChange}
            placeholder="Enter degree"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Institution */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Institution
          </label>
          <input
            type="text"
            name="institution"
            value={formData.qualification[0].institution}
            onChange={handleQualificationChange}
            placeholder="Enter institution"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Year */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Year
          </label>
          <input
            type="date"
            name="year"
            value={formData.qualification[0].year}
            onChange={handleQualificationChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;