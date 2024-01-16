import React from 'react';
import './PlanetsList/PlanetsList.css'
interface ListProps<T> {
    items: T[],
    renderItem: (item: T) => React.ReactNode
}

export default function List<T>({ items, renderItem }: ListProps<T>) {
    // Проверяем, что items не null и не undefined. Если items не определен, используем пустой массив.
    const safeItems = items || [];

    return (
        <div className="card-grid">
            {safeItems.map(renderItem)}
        </div>
    );
}
