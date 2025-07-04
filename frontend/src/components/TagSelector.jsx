import AsyncCreatableSelect from "react-select/async-creatable";

const API_URL = import.meta.env.VITE_API_URL;

export default function TagSelector({ value, onChange }) {
  // Load tags from backend for autocomplete
  const loadOptions = async (inputValue) => {
    const res = await fetch(`${API_URL}/api/tags?search=${encodeURIComponent(inputValue)}`);
    const tags = await res.json();
    return tags.map(tag => ({ value: tag.name, label: tag.name }));
  };

  // Handle tag selection/creation
  const handleChange = (selected) => {
    onChange(selected ? selected.map(opt => opt.value) : []);
  };

  // Convert value (array of strings) to react-select format
  const selectValue = value?.map(tag => ({ value: tag, label: tag })) || [];

  return (
    <AsyncCreatableSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      value={selectValue}
      placeholder="Add tags..."
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
}