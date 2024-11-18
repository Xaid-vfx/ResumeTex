import React, { useState } from 'react';

interface DynamicListProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}

const DynamicList: React.FC<DynamicListProps> = ({ items, onChange, placeholder }) => {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            onChange([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    placeholder={placeholder}
                    className="flex-1 p-2 border rounded"
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item}</span>
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DynamicList; 