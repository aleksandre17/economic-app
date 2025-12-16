// TEST COMPONENT - Copy this to test if it works

import React, { useState } from 'react';
import { SearchableSelect } from '@/shared/components/SearchableSelect';

// Hardcoded test data
const testOptions = [
    { id: '1', name: 'IT & Technology', code: 'IT' },
    { id: '2', name: 'Human Resources', code: 'HR' },
    { id: '3', name: 'Finance', code: 'FIN' },
    { id: '4', name: 'Marketing', code: 'MKT' },
];

export function TestSearchableSelect() {
    const [selectedValue, setSelectedValue] = useState('');

    return (
        <div style={{
            maxWidth: '500px',
            margin: '50px auto',
            padding: '30px',
            backgroundColor: '#ffffff',  // Force light background
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
            <h2 style={{ marginBottom: '20px', color: '#374151' }}>
                Test SearchableSelect
            </h2>

            {/* Test Component */}
            <SearchableSelect
                options={testOptions}
                value={selectedValue}
                onChange={(value, option) => {
                    console.log('✅ onChange called!');
                    console.log('Value:', value);
                    console.log('Option:', option);
                    setSelectedValue(value);
                }}
                valueField="code"  // Returns string codes
                label="Test Select"
                placeholder="აირჩიეთ ოფცია..."
                required
            />

            {/* Debug Display */}
            <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
            }}>
                <div style={{ marginBottom: '10px', fontWeight: '600', color: '#374151' }}>
                    Debug Info:
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>Selected Value:</strong> {selectedValue || '(empty)'}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>Value Type:</strong> {typeof selectedValue}
                    </div>
                    <div>
                        <strong>Is Empty:</strong> {selectedValue ? 'No' : 'Yes'}
                    </div>
                </div>
            </div>

            {/* Test Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => {
                        console.log('Current value:', selectedValue);
                        alert(`Current value: ${selectedValue || '(empty)'}`);
                    }}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    Log Value
                </button>
                
                <button
                    onClick={() => {
                        console.log('Resetting value');
                        setSelectedValue('');
                    }}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Expected Result */}
            <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#ecfdf5',
                borderRadius: '6px',
                border: '1px solid #a7f3d0',
            }}>
                <div style={{ fontWeight: '600', color: '#065f46', marginBottom: '10px' }}>
                    ✅ Expected Result:
                </div>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '14px' }}>
                    <li>Select dropdown shows "აირჩიეთ ოფცია..."</li>
                    <li>Click dropdown → Shows 4 options</li>
                    <li>Click "IT & Technology"</li>
                    <li>Dropdown closes</li>
                    <li>Shows "IT & Technology" (not "აირჩიეთ ოფცია...")</li>
                    <li>Debug shows: Value = "IT", Type = "string"</li>
                    <li>Background is WHITE (not dark)</li>
                </ol>
            </div>
        </div>
    );
}

export default TestSearchableSelect;
