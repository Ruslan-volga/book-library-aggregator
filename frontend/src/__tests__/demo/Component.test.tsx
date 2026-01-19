import React from 'react';
import { render, screen } from '@testing-library/react';

// Простой компонент для демонстрации тестирования
const DemoComponent: React.FC<{ title: string; count: number }> = ({ title, count }) => {
  return (
    <div data-testid="demo-component">
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button>Increment</button>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  );
};

describe('React Component Testing Demo', () => {
  test('renders component with props', () => {
    render(<DemoComponent title="Test Title" count={5} />);
    
    expect(screen.getByTestId('demo-component')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  test('renders button and list items', () => {
    render(<DemoComponent title="Demo" count={0} />);
    
    expect(screen.getByRole('button', { name: 'Increment' })).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('Item 1');
    expect(listItems[1]).toHaveTextContent('Item 2');
    expect(listItems[2]).toHaveTextContent('Item 3');
  });

  test('component structure is correct', () => {
    const { container } = render(<DemoComponent title="Test" count={10} />);
    
    // Проверяем HTML структуру
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
    expect(container.querySelector('ul')).toBeInTheDocument();
  });
});
