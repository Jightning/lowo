"use client"

import React from 'react';
import { SingleValue } from "react-select";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

// Custom selection options with shared styling

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: '#374151',
        borderColor: state.isFocused ? '#6366f1' : '#4b5563',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(99,102,241,0.35)' : 'none',
        ':hover': { borderColor: state.isFocused ? '#6366f1' : '#6b7280' },
        minHeight: '2.5rem',
        borderRadius: '0.5rem',
    }),
    valueContainer: (base: any) => ({ ...base, padding: '0 0.5rem', color: '#e5e7eb' }),
    input: (base: any) => ({ ...base, color: '#e5e7eb' }),
    placeholder: (base: any) => ({ ...base, color: '#9ca3af' }),
    singleValue: (base: any) => ({ ...base, color: '#e5e7eb' }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: '#1f2937',
        border: '1px solid #6b7280',
        borderRadius: '5px',
        overflow: 'hidden',
    }),
    multiValueLabel: (base: any) => ({ ...base, color: '#e5e7eb', padding: '0 8px' }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: '#9ca3af',
        ':hover': { backgroundColor: '#4b5563', color: '#e5e7eb' },
    }),
    menu: (base: any) => ({ ...base, backgroundColor: '#1f2937', color: '#e5e7eb', zIndex: 50 }),
    menuList: (base: any) => ({ ...base, padding: 4 }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? '#1f2937' : state.isFocused ? '#374151' : 'transparent',
        color: '#e5e7eb',
        borderRadius: '0.375rem', // rounded-md
        ':active': { backgroundColor: '#374151' },
    }),
    dropdownIndicator: (base: any, state: any) => ({ ...base, color: state.isFocused ? '#e5e7eb' : '#9ca3af', ':hover': { color: '#e5e7eb' } }),
    clearIndicator: (base: any) => ({ ...base, color: '#9ca3af', ':hover': { color: '#e5e7eb' } }),
    indicatorSeparator: (base: any) => ({ ...base, backgroundColor: '#4b5563' }),
};

const selectTheme = (theme: any) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: '#6366f1',
        primary25: '#374151',
        primary50: '#4338ca',
        neutral0: '#374151',
        neutral80: '#e5e7eb',
        neutral20: '#4b5563',
        neutral30: '#4b5563',
    },
});


export const CustomCreatableSelect = (
    {value, options, onChange, placeholder, isMulti=true, isClearable=true, closeMenuOnSelect=false}: 
    {
        value: { value: string; label: string } | { value: string; label: string }[];
        options: { value: string; label: string }[];
        onChange: (newVal: any) => void;
        placeholder: string;
        isMulti?: boolean;
        isClearable?: boolean;
        closeMenuOnSelect?: boolean;
    }
) => {
    return (
        <CreatableSelect
            isMulti={isMulti}
            isClearable={isClearable}
            closeMenuOnSelect={closeMenuOnSelect}
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}

            styles={selectStyles}
            theme={selectTheme}
            classNamePrefix="rs"

        />
    )
}

export const CustomSelect = (
    {value, options, onChange}: 
    {
        value?: { value: string; label: string };
        options: { value: string; label: string }[];
        onChange: (newValue: SingleValue<{
            value: string;
            label: string;
        }>) => void;
    }
) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            styles={selectStyles}

            theme={selectTheme}
            options={options} 
        />
    )
}